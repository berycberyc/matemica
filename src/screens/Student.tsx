import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { dict } from "../lib/i18n";
import { Keypad } from "../components/Keypad";
import { Card, Primary, Quiet, Tech } from "../components/Ui";
import { apply, build, judge, pickNext, replay, type Engine } from "../lib/engine";
import type { Dep, Item, Option, Session, Task, Topic, User } from "../lib/types";

type Phase =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "question"; task: Task }
  | { kind: "done" };

export function Student({ user, onExit }: { user: User; onExit: () => void }) {
  const t = dict(user.lang);
  const [phase, setPhase] = useState<Phase>({ kind: "loading" });
  const [asked, setAsked] = useState(0);
  const engine = useRef<Engine | null>(null);
  const session = useRef<Session | null>(null);
  const items = useRef<Item[]>([]);
  const shownAt = useRef(0);
  const supervised = useRef(false);

  const advance = useCallback(async () => {
    const e = engine.current;
    if (!e) return;
    const next = pickNext(e);
    if (!next) {
      const s = session.current;
      if (s) {
        try {
          await api.patch("diag_sessions", `id=eq.${s.id}`,
            { status: "done", finished_at: new Date().toISOString() });
        } catch { /* заход всё равно закончен */ }
      }
      setPhase({ kind: "done" });
      return;
    }
    shownAt.current = performance.now();
    setPhase({ kind: "question", task: next });
  }, []);

  const start = useCallback(async () => {
    setPhase({ kind: "loading" });
    try {
      const [topics, deps, tasks, options] = await Promise.all([
        api.all<Topic>("topics", "select=ord,code,title_ru,title_kk"),
        api.all<Dep>("topic_deps", "select=topic_ord,depends_on"),
        api.all<Task>("tasks", "is_active=is.true&select=id,topic_ord,level,answer_type," +
                               "stem_ru,stem_kk,answer_num,target_seconds"),
        api.all<Option>("options", "select=id,task_id,pos,body,is_correct,error_code")
      ]);
      if (!topics.length) throw new Error("в базе нет тем — не залит 02_topics.sql");
      if (!tasks.length) throw new Error("в базе нет задач — не залит 07_bank.sql");
      for (const task of tasks) {
        task.options = options.filter(o => o.task_id === task.id).sort((a, b) => a.pos - b.pos);
      }

      const today = new Date().toISOString().slice(0, 10);
      if (user.group_id !== null) {
        const open = await api.get<{ id: number }>("lessons",
          `group_id=eq.${user.group_id}&on_date=eq.${today}&is_open=is.true&select=id`);
        supervised.current = open.length > 0;
      }

      const running = await api.get<Session>("diag_sessions",
        `student_id=eq.${user.id}&status=eq.in_progress&select=*&order=pass_no.desc&limit=1`);
      let current = running[0];
      if (!current) {
        const all = await api.get<{ pass_no: number }>("diag_sessions",
          `student_id=eq.${user.id}&select=pass_no`);
        const passNo = all.length ? Math.max(...all.map(r => r.pass_no)) + 1 : 1;
        const made = await api.post<Session>("diag_sessions",
          [{ student_id: user.id, pass_no: passNo, supervised: supervised.current }]);
        current = made[0];
      }
      if (!current) throw new Error("не удалось начать заход");
      session.current = current;

      const saved = await api.all<Item>("diag_items",
        `session_id=eq.${current.id}&select=*&order=pos.asc`);
      items.current = saved;
      const e = build(topics, deps, tasks);
      replay(e, saved);
      engine.current = e;
      setAsked(saved.length);
      await advance();
    } catch (err) {
      setPhase({ kind: "error", message: err instanceof Error ? err.message : String(err) });
    }
  }, [user, advance]);

  useEffect(() => { void start(); }, [start]);

  async function answer(task: Task, given: string) {
    const e = engine.current, s = session.current;
    if (!e || !s) return;
    const seconds = Math.round((performance.now() - shownAt.current) / 1000);
    const verdict = judge(task, given);
    const row: Item = {
      session_id: s.id, pos: items.current.length + 1, task_id: task.id,
      topic_ord: task.topic_ord, given, is_correct: verdict.correct,
      error_code: verdict.code, seconds, answered_at: new Date().toISOString(),
      supervised: supervised.current
    };
    try {
      await api.post<Item>("diag_items", [row]);
    } catch (err) {
      setPhase({ kind: "error", message: err instanceof Error ? err.message : String(err) });
      return;
    }
    items.current.push(row);
    e.used.add(task.id);
    apply(e, task.topic_ord, task.level, verdict.correct, seconds, task.target_seconds, given === "?");
    setAsked(items.current.length);
    await advance();
  }

  async function askTeacher(task: Task) {
    try {
      await api.post("help_requests", [{
        student_id: user.id, task_id: task.id,
        context: supervised.current ? "lesson" : "home"
      }]);
    } catch { /* не критично */ }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-4">
      <TopBar name={user.full_name} exitLabel={t.exit} sureLabel={t.sure} onExit={onExit} />

      {phase.kind === "loading" && <Card><p className="text-muted">{t.loading}</p></Card>}

      {phase.kind === "error" && (
        <Card>
          <p className="font-read text-lg">{t.offline}</p>
          <Tech>{phase.message}</Tech>
          <div className="mt-4"><Primary onClick={() => void start()}>{t.retry}</Primary></div>
        </Card>
      )}

      {phase.kind === "done" && (
        <Card><p className="font-read text-lg leading-relaxed">{t.finished}</p></Card>
      )}

      {phase.kind === "question" && (
        <Question
          key={phase.task.id} task={phase.task} lang={user.lang} number={asked + 1}
          onAnswer={g => void answer(phase.task, g)}
          onAsk={() => void askTeacher(phase.task)}
        />
      )}
    </div>
  );
}

function TopBar(
  { name, exitLabel, sureLabel, onExit }:
  { name: string; exitLabel: string; sureLabel: string; onExit: () => void }
) {
  const [armed, setArmed] = useState(false);
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="flex-1 truncate text-sm text-muted">{name}</span>
      <Quiet danger={armed} onClick={() => (armed ? onExit() : setArmed(true))}>
        {armed ? sureLabel : exitLabel}
      </Quiet>
    </div>
  );
}

function Question(
  { task, lang, number, onAnswer, onAsk }:
  { task: Task; lang: "ru" | "kk"; number: number;
    onAnswer: (given: string) => void; onAsk: () => void }
) {
  const t = dict(lang);
  const [value, setValue] = useState("");
  const [sent, setSent] = useState(false);
  const [askedTeacher, setAskedTeacher] = useState(false);
  const stem = lang === "kk" && task.stem_kk ? task.stem_kk : task.stem_ru;

  function send(given: string) {
    if (sent) return;
    setSent(true);
    onAnswer(given);
  }

  return (
    <Card>
      <p className="text-sm text-muted">{t.question} {number}</p>
      <p className="mt-2 font-read text-[19px] leading-relaxed">{stem}</p>

      {task.answer_type === "choice" ? (
        <div className="mt-5 space-y-2">
          {task.options.map(o => (
            <button
              key={o.id} type="button" disabled={sent} onClick={() => send(o.body)}
              className="w-full rounded-xl border border-line bg-white py-4 text-xl
                         active:border-teal active:bg-teal-light disabled:opacity-40"
            >{o.body}</button>
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <div className="mb-3 min-h-[58px] rounded-xl border border-line bg-[#FBFCFB]
                          px-4 py-3 text-2xl tracking-wide break-all">
            {value || <span className="text-base text-line">{t.typeAnswer}</span>}
          </div>
          <Keypad onKey={k => {
            if (k === "⌫") setValue(v => v.slice(0, -1));
            else setValue(v => (v.length < 12 ? v + k : v));
          }} />
          <div className="mt-3">
            <Primary disabled={!value || sent} onClick={() => send(value)}>{t.answer}</Primary>
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Quiet onClick={() => send("?")}>{t.dontKnow}</Quiet>
        <Quiet onClick={() => { setAskedTeacher(true); onAsk(); }}>
          {askedTeacher ? t.asked : t.ask}
        </Quiet>
      </div>
    </Card>
  );
}
