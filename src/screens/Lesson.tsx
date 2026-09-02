// Экран урока. Наверху те, к кому надо подойти. Остальные — тихо внизу.
import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import { Card, Tech } from "../components/Ui";
import { shortNames } from "../lib/names";
import type { Group, Lesson as LessonRow, User } from "../lib/types";

const HOURS = 2;
const today = () => new Date().toISOString().slice(0, 10);

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

  const open = lessons.find(l => l.is_open);

  const load = useCallback(async () => {
    try {
      const now = Date.now();
      const all = await api.all<LessonRow>("lessons", `on_date=eq.${today()}&select=*`);
      for (const l of all) {
        if (l.is_open && new Date(l.started_at).getTime() < now - HOURS * 3600_000) {
          await api.patch("lessons", `id=eq.${l.id}`,
            { is_open: false, ended_at: new Date().toISOString() });
          l.is_open = false;
        }
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
        api.all<{ student_id: number; status: string }>("plan_items",
          `student_id=${inList}&on_date=eq.${today()}&status=neq.cancelled&select=student_id,status`),
        api.all<{ student_id: number; is_correct: boolean; error_code: string | null; created_at: string }>(
          "answers", `student_id=${inList}&created_at=gte.${today()}&select=student_id,is_correct,error_code,created_at`),
        api.all<{ student_id: number; created_at: string }>("help_requests",
          `student_id=${inList}&resolved_at=is.null&select=student_id,created_at`),
        api.all<{ id: number; student_id: number }>("diag_sessions",
          `student_id=${inList}&select=id,student_id`)
      ]);
      const owner = new Map(sessions.map(s => [s.id, s.student_id]));
      const diagCount = new Map<number, number>();
      if (sessions.length) {
        const items = await api.all<{ session_id: number; answered_at: string }>("diag_items",
          `session_id=in.(${sessions.map(s => s.id).join(",")})` +
          `&answered_at=gte.${today()}&select=session_id,answered_at`);
        for (const it of items) {
          const sid = owner.get(it.session_id);
          if (sid) diagCount.set(sid, (diagCount.get(sid) ?? 0) + 1);
        }
      }
      const names = shortNames(mine);

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
    const id = setInterval(() => void load(), 10_000);
    return () => clearInterval(id);
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
        await api.post("lessons", [{ group_id: group.id, on_date: today(), is_open: true }]);
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
        <span className="text-sm text-muted">закроется через {left} мин</span>
        <button type="button" disabled={busy} onClick={() => void stop(open)}
          className="rounded-xl bg-red/10 px-4 py-2.5 text-sm text-red">Закончить</button>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {order.map(r => <Tile key={r.id} r={r} onClear={() => void clearHelp(r.id)} />)}
      </div>

      <p className="mt-5 text-sm text-muted">
        Синим — кто просит подойти, нажми, когда подошёл. Чем темнее плитка, тем больше ошибок.
      </p>
    </>
  );
}

// Ошибки показываем не цветом тревоги, а густотой: одна ошибка — ещё не беда,
// три подряд — уже видно с другого конца стола.
const SHADES = ["bg-paper", "bg-[#EFE6E2]", "bg-[#E3D2CA]", "bg-[#D5BCB1]"];

function Tile({ r, onClear }: { r: Live; onClear: () => void }) {
  if (r.спросил) {
    return (
      <button type="button" onClick={onClear}
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
    <div className={`rounded-2xl px-4 py-3 ${shade} ${r.начал ? "" : "opacity-50"}`}>
      <div className="font-read text-[19px]">{r.имя}</div>
      <div className="text-[13px] text-muted">
        {r.ошибок > 0
          ? `${r.ошибок} ${r.ошибок === 1 ? "ошибка" : "ошибок"}`
          : r.диагностика > 0 ? `${r.диагностика} отв.`
          : r.план ? `${r.сделано} из ${r.план}`
          : r.начал ? "идёт" : "не начал"}
      </div>
    </div>
  );
}
