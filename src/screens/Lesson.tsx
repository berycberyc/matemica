// Экран урока. Наверху те, к кому надо подойти. Остальные — тихо внизу.
import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import { day } from "../lib/day";
import { Card, Tech } from "../components/Ui";
import { shortNames } from "../lib/names";
import { listen, type LiveState } from "../lib/live";
import type { Group, Lesson as LessonRow, Option, Task, Topic, User } from "../lib/types";

const HOURS = 2;


interface PlanRow { student_id: number; status: string; task_id: number; pos: number }
interface AnswerRow {
  student_id: number; task_id: number; given: string | null;
  is_correct: boolean; error_code: string | null; created_at: string;
}
interface DiagRow {
  session_id: number; student_id?: number; task_id: number; given: string | null;
  is_correct: boolean; error_code: string | null; answered_at: string;
}
interface Details { plan: PlanRow[]; answers: AnswerRow[]; diagItems: DiagRow[] }

interface Live {
  id: number; имя: string;
  план: number; сделано: number;
  ошибок: number; последняя: string | null;
  спросил: number;
  ждёт: number;
  диагностика: number;
  начал: boolean;
}

export function Lesson() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [rows, setRows] = useState<Live[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [live, setLive] = useState<LiveState>("переспрос");
  const [openCard, setOpenCard] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Map<number, Task>>(new Map());
  const [topics, setTopics] = useState<Topic[]>([]);
  const [saving, setSaving] = useState(false);
  const [details, setDetails] = useState<Details>({ plan: [], answers: [], diagItems: [] });

  const open = lessons.find(l => l.is_open);

  const load = useCallback(async () => {
    try {
      const now = Date.now();
      const all = await api.all<LessonRow>("lessons", `on_date=eq.${day()}&select=*`);
      for (const l of all) {
        if (l.is_open && new Date(l.started_at).getTime() < now - HOURS * 3600_000) {
          await api.patch("lessons", `id=eq.${l.id}`,
            { is_open: false, ended_at: new Date().toISOString() });
          l.is_open = false;
        }
      }
      if (tasks.size === 0) {
        const [taskRows, options] = await Promise.all([
          api.all<Task>("tasks", "select=id,topic_ord,level,answer_type,stem_ru,stem_kk,svg,answer_num"),
          api.all<Option>("options", "select=id,task_id,pos,body,is_correct,error_code")
        ]);
        for (const t of taskRows) {
          t.options = options.filter(o => o.task_id === t.id).sort((a, b) => a.pos - b.pos);
        }
        setTasks(new Map(taskRows.map(t => [t.id, t])));
      }
      if (!topics.length) {
        setTopics(await api.all<Topic>("topics",
          "select=ord,code,title_ru,title_kk&order=ord.asc"));
      }
      const [gs, people] = await Promise.all([
        api.all<Group>("groups", "is_active=is.true&select=id,name&order=name.asc"),
        api.all<User>("users", "role=eq.student&is_active=is.true&select=id,full_name,group_id")
      ]);
      setGroups(gs);
      setLessons(all);

      const current = all.find(l => l.is_open);
      if (!current) { setRows([]); setError(null); return; }

      const mine = people.filter(p => p.group_id === current.group_id);
      const ids = mine.map(p => p.id);
      if (!ids.length) { setRows([]); return; }
      const inList = `in.(${ids.join(",")})`;

      const [plan, answers, help, sessions] = await Promise.all([
        api.all<PlanRow>("plan_items",
          `student_id=${inList}&on_date=eq.${day()}&status=neq.cancelled` +
          `&select=student_id,status,task_id,pos&order=pos.asc`),
        api.all<AnswerRow>("answers",
          `student_id=${inList}&created_at=gte.${day()}` +
          `&select=student_id,task_id,given,is_correct,error_code,created_at&order=created_at.asc`),
        api.all<{ student_id: number; created_at: string }>("help_requests",
          `student_id=${inList}&resolved_at=is.null&select=student_id,created_at`),
        api.all<{ id: number; student_id: number }>("diag_sessions",
          `student_id=${inList}&select=id,student_id`)
      ]);
      const owner = new Map(sessions.map(s => [s.id, s.student_id]));
      const diagCount = new Map<number, number>();
      const lastDiag: DiagRow[] = [];
      if (sessions.length) {
        const items = await api.all<DiagRow>("diag_items",
          `session_id=in.(${sessions.map(s => s.id).join(",")})&answered_at=gte.${day()}` +
          `&select=session_id,task_id,given,is_correct,error_code,answered_at&order=answered_at.asc`);
        for (const it of items) {
          const sid = owner.get(it.session_id);
          if (sid) {
            diagCount.set(sid, (diagCount.get(sid) ?? 0) + 1);
            lastDiag.push({ ...it, student_id: sid });
          }
        }
      }
      const names = shortNames(mine);
      setDetails({ plan, answers, diagItems: lastDiag });

      setRows(mine.map(p => {
        const mineAns = answers.filter(a => a.student_id === p.id);
        const wrong = mineAns.filter(a => !a.is_correct);
        const last = wrong.length ? wrong[wrong.length - 1] : undefined;
        const planRows = plan.filter(x => x.student_id === p.id);
        const diag = diagCount.get(p.id) ?? 0;
        return {
          id: p.id, имя: names.get(p.id) ?? p.full_name,
          план: planRows.length,
          сделано: planRows.filter(x => x.status === "done").length,
          ошибок: wrong.length,
          последняя: last?.error_code ?? null,
          спросил: help.filter(h => h.student_id === p.id).length,
          ждёт: help.filter(h => h.student_id === p.id)
            .reduce((min, h) => Math.min(min, Math.round(
              (Date.now() - new Date(h.created_at).getTime()) / 60_000)), 999),
          диагностика: diag,
          начал: mineAns.length > 0 || diag > 0
        };
      }));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  useEffect(() => {
    void load();
    return listen(["diag_items", "answers", "help_requests", "plan_items", "lessons"],
      () => void load(), setLive);
  }, [load]);

  async function startFor(group: Group) {
    setBusy(true);
    try {
      // открытие урока одной группы закрывает урок другой
      for (const l of lessons) {
        if (l.is_open) {
          await api.patch("lessons", `id=eq.${l.id}`,
            { is_open: false, ended_at: new Date().toISOString() });
        }
      }
      const mine = lessons.find(l => l.group_id === group.id);
      if (mine) {
        await api.patch("lessons", `id=eq.${mine.id}`,
          { is_open: true, started_at: new Date().toISOString(), ended_at: null });
      } else {
        await api.post("lessons", [{ group_id: group.id, on_date: day(), is_open: true }]);
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
    setBusy(false);
  }

  async function stop(l: LessonRow) {
    setBusy(true);
    await api.patch("lessons", `id=eq.${l.id}`,
      { is_open: false, ended_at: new Date().toISOString() }).catch(() => undefined);
    await load();
    setBusy(false);
  }

  // Урок главнее цифр: планировщику надо знать, что разбирали,
  // иначе вечерний план заспорит с уроком.
  async function setLessonTopic(l: LessonRow, ord: number | null) {
    setSaving(true);
    await api.patch("lessons", `id=eq.${l.id}`, { topic_ord: ord }).catch(() => undefined);
    await load();
    setSaving(false);
  }

  async function clearHelp(id: number) {
    await api.patch("help_requests", `student_id=eq.${id}&resolved_at=is.null`,
      { resolved_at: new Date().toISOString() }).catch(() => undefined);
    void load();
  }

  if (error) return <Card><p>Не вышло.</p><Tech>{error}</Tech></Card>;

  if (!open) {
    return (
      <Card>
        <h3 className="text-lg">Урок не идёт</h3>
        <p className="mt-1 text-sm text-muted">
          Открытие урока закрывает урок другой группы. Сам закроется через два часа.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {groups.map(g => (
            <button key={g.id} type="button" disabled={busy} onClick={() => void startFor(g)}
              className="rounded-2xl bg-teal px-5 py-5 text-[17px] text-white
                         transition active:scale-[.99] disabled:opacity-50">
              Начать {g.name}
            </button>
          ))}
        </div>
      </Card>
    );
  }

  const group = groups.find(g => g.id === open.group_id);
  const left = Math.max(0, Math.round(
    (new Date(open.started_at).getTime() + HOURS * 3600_000 - Date.now()) / 60_000));
  const order = [...rows].sort((a, b) =>
    (b.спросил ? 1 : 0) - (a.спросил ? 1 : 0) ||
    b.ошибок - a.ошибок ||
    a.имя.localeCompare(b.имя, "ru"));

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h3 className="flex-1 text-xl">Урок {group?.name}</h3>
        <span className="flex items-center gap-2 text-sm text-muted">
          <span className={`inline-block h-2 w-2 rounded-full
            ${live === "живая" ? "bg-teal" : "bg-amber"}`} />
          {live === "живая" ? "живая связь" : "связь с задержкой"}
        </span>
        <span className="text-sm text-muted">закроется через {left} мин</span>
        <button type="button" disabled={busy} onClick={() => void stop(open)}
          className="rounded-xl bg-red/10 px-4 py-2.5 text-sm text-red">Закончить</button>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl bg-white px-5 py-4">
        <span className="text-[15px] text-muted">Разбираем сегодня</span>
        <select
          value={open.topic_ord ?? ""} disabled={saving}
          onChange={e => void setLessonTopic(open, e.target.value ? Number(e.target.value) : null)}
          className="min-w-[260px] flex-1 rounded-xl bg-paper px-4 py-2.5 outline-none
                     focus:ring-2 focus:ring-teal">
          <option value="">не выбрано</option>
          {topics.map(t => (
            <option key={t.ord} value={t.ord}>{t.code} {t.title_ru}</option>
          ))}
        </select>
        {open.topic_ord === null && (
          <span className="text-sm text-amber">
            без этого вечерний план не будет знать, что вы объясняли
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5">
        {order.map(r => (
          <Tile key={r.id} r={r}
            onOpen={() => setOpenCard(openCard === r.id ? null : r.id)}
            onClear={() => void clearHelp(r.id)} />
        ))}
      </div>

      {openCard !== null && (
        <Detail
          who={rows.find(r => r.id === openCard)?.имя ?? ""}
          plan={details.plan.filter(x => x.student_id === openCard)}
          answers={details.answers.filter(x => x.student_id === openCard)}
          diag={details.diagItems.filter(x => x.student_id === openCard)}
          tasks={tasks}
          onClose={() => setOpenCard(null)}
        />
      )}

      <p className="mt-5 text-sm text-muted">
        Синим — кто просит подойти, нажми, когда подошёл. Чем темнее плитка, тем больше ошибок.
      </p>
    </>
  );
}

// Ошибки показываем не цветом тревоги, а густотой: одна ошибка — ещё не беда,
// три подряд — уже видно с другого конца стола.
const SHADES = ["bg-paper", "bg-[#EFE6E2]", "bg-[#E3D2CA]", "bg-[#D5BCB1]"];

function Tile(
  { r, onOpen, onClear }: { r: Live; onOpen: () => void; onClear: () => void }
) {
  if (r.спросил) {
    return (
      <button type="button" onClick={() => { onClear(); onOpen(); }}
        className="rounded-2xl bg-[#2F6FA8] px-4 py-3 text-left text-white transition active:scale-95">
        <div className="font-read text-[19px]">{r.имя}</div>
        <div className="text-[13px] text-white/75">
          просит подойти{r.спросил > 1 ? ` · ${r.спросил} раза` : ""}
          {r.ждёт < 999 ? ` · ${r.ждёт} мин` : ""}
        </div>
      </button>
    );
  }
  const shade = SHADES[Math.min(r.ошибок, SHADES.length - 1)] ?? "bg-paper";
  return (
    <button type="button" onClick={onOpen}
      className={`rounded-2xl px-4 py-3 text-left transition active:scale-95
                  ${shade} ${r.начал ? "" : "opacity-50"}`}>
      <div className="font-read text-[19px]">{r.имя}</div>
      <div className="text-[13px] text-muted">
        {r.ошибок > 0
          ? `${r.ошибок} ${r.ошибок === 1 ? "ошибка" : "ошибок"}`
          : r.диагностика > 0 ? `${r.диагностика} отв.`
          : r.план ? `${r.сделано} из ${r.план}`
          : r.начал ? "идёт" : "не начал"}
      </div>
    </button>
  );
}

// Что ребёнок делает прямо сейчас: текущая задача и всё, что он сегодня ответил.
function Detail(
  { who, plan, answers, diag, tasks, onClose }:
  { who: string; plan: PlanRow[]; answers: AnswerRow[]; diag: DiagRow[];
    tasks: Map<number, Task>; onClose: () => void }
) {
  const current = plan.find(p => p.status === "pending");
  const task = current ? tasks.get(current.task_id) : undefined;
  const rows: { task_id: number; given: string | null; ok: boolean; code: string | null }[] = [
    ...answers.map(a => ({ task_id: a.task_id, given: a.given, ok: a.is_correct, code: a.error_code })),
    ...diag.map(d => ({ task_id: d.task_id, given: d.given, ok: d.is_correct, code: d.error_code }))
  ];

  return (
    <Card className="mt-5">
      <div className="flex items-center gap-3">
        <h4 className="flex-1 font-read text-[22px]">{who}</h4>
        <button type="button" onClick={onClose}
          className="rounded-xl bg-paper px-3 py-2 text-sm text-muted">Закрыть</button>
      </div>

      {task ? (
        <div className="mt-4 rounded-2xl bg-paper p-5">
          <p className="text-[13px] uppercase tracking-[.14em] text-muted/70">Сейчас решает</p>
          <p className="mt-2 font-read text-[19px] leading-snug">{task.stem_ru}</p>
          {task.svg && (
            <div className="mt-3 flex justify-center"
                 dangerouslySetInnerHTML={{ __html: task.svg }} />
          )}
          {task.answer_type === "choice" ? (
            <p className="mt-3 text-[15px]">
              Верно: <b>{task.options.find(o => o.is_correct)?.body}</b>
              <span className="ml-3 text-muted">
                варианты: {task.options.map(o => o.body).join(", ")}
              </span>
            </p>
          ) : (
            <p className="mt-3 text-[15px]">Верно: <b>{String(task.answer_num)}</b></p>
          )}
        </div>
      ) : (
        <p className="mt-4 text-muted">
          {plan.length ? "План на сегодня закончил." : "Сейчас идёт диагностика — задачу не показываю."}
        </p>
      )}

      <p className="mt-5 text-[13px] uppercase tracking-[.14em] text-muted/70">Сегодня ответил</p>
      {!rows.length && <p className="mt-2 text-muted">Пока ничего.</p>}
      <div className="mt-2 space-y-1.5">
        {rows.map((r, i) => {
          const t = tasks.get(r.task_id);
          return (
            <div key={i} className="flex flex-wrap items-baseline gap-x-3 text-[15px]">
              <span className={r.ok ? "text-teal" : "text-red"}>{r.ok ? "верно" : "неверно"}</span>
              <span className="text-muted">ответил {r.given === "?" ? "«не знаю»" : r.given}</span>
              {r.code && <span className="text-amber">{r.code}</span>}
              {t && <span className="w-full truncate text-sm text-muted/80">{t.stem_ru}</span>}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
