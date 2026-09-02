// Кабинет ученика: диагностика и задачи на сегодня.
// Логика ветвления живёт в engine.ts.
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { dict } from "../lib/i18n";
import { Card, Primary, Quiet, Tech } from "../components/Ui";
import { Home } from "./Home";
import { Question } from "./Question";
import { apply, build, judge, pickNext, replay, type Engine } from "../lib/engine";
import type { Dep, Item, Option, Session, Task, Topic, User } from "../lib/types";

interface PlanRow { id: number; task_id: number; pos: number }

type Phase =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "home" }
  | { kind: "diagnostic"; task: Task }
  | { kind: "practice"; task: Task; left: number }
  | { kind: "feedback"; correct: boolean; left: number }
  | { kind: "done" };

const todayStr = () => new Date().toISOString().slice(0, 10);

export function Student({ user, onExit }: { user: User; onExit: () => void }) {
  const t = dict(user.lang);
  const [phase, setPhase] = useState<Phase>({ kind: "loading" });
  const [answered, setAnswered] = useState(0);
  const [topicsSeen, setTopicsSeen] = useState(0);
  const [diagDone, setDiagDone] = useState(false);
  const [plan, setPlan] = useState<PlanRow[]>([]);
  const [planDone, setPlanDone] = useState(0);

  const engine = useRef<Engine | null>(null);
  const session = useRef<Session | null>(null);
  const items = useRef<Item[]>([]);
  const tasks = useRef<Map<number, Task>>(new Map());
  const queue = useRef<PlanRow[]>([]);
  const shownAt = useRef(0);
  const supervised = useRef(false);

  const load = useCallback(async () => {
    setPhase({ kind: "loading" });
    try {
      const [topics, deps, taskRows, options] = await Promise.all([
        api.all<Topic>("topics", "select=ord,code,title_ru,title_kk"),
        api.all<Dep>("topic_deps", "select=topic_ord,depends_on"),
        api.all<Task>("tasks", "is_active=is.true&select=id,topic_ord,level,answer_type," +
                               "stem_ru,stem_kk,answer_num,target_seconds"),
        api.all<Option>("options", "select=id,task_id,pos,body,is_correct,error_code")
      ]);
      if (!topics.length) throw new Error("в базе нет тем — не залит 02_topics.sql");
      if (!taskRows.length) throw new Error("в базе нет задач — не залит 07_bank.sql");
      for (const task of taskRows) {
        task.options = options.filter(o => o.task_id === task.id).sort((a, b) => a.pos - b.pos);
        tasks.current.set(task.id, task);
      }

      if (user.group_id !== null) {
        const open = await api.get<{ id: number }>("lessons",
          `group_id=eq.${user.group_id}&on_date=eq.${todayStr()}&is_open=is.true&select=id`);
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
      const e = build(topics, deps, taskRows);
      replay(e, saved);
      engine.current = e;

      const planRows = await api.all<PlanRow & { status: string }>("plan_items",
        `student_id=eq.${user.id}&on_date=eq.${todayStr()}` +
        `&status=eq.pending&select=id,task_id,pos&order=pos.asc`);
      queue.current = planRows;

      setPlan(planRows);
      setPlanDone(0);
      setAnswered(saved.length);
      setTopicsSeen(new Set(saved.map(i => i.topic_ord)).size);
      setDiagDone(!pickNext(e));
      setPhase({ kind: "home" });
    } catch (err) {
      setPhase({ kind: "error", message: err instanceof Error ? err.message : String(err) });
    }
  }, [user]);

  useEffect(() => { void load(); }, [load]);

  function nextDiagnostic() {
    const e = engine.current;
    if (!e) return;
    const next = pickNext(e);
    if (!next) {
      const s = session.current;
      if (s) {
        void api.patch("diag_sessions", `id=eq.${s.id}`,
          { status: "done", finished_at: new Date().toISOString() }).catch(() => undefined);
      }
      setDiagDone(true);
      setPhase({ kind: "done" });
      return;
    }
    shownAt.current = performance.now();
    setPhase({ kind: "diagnostic", task: next });
  }

  function nextPractice() {
    const row = queue.current[0];
    if (!row) { setPhase({ kind: "home" }); return; }
    const task = tasks.current.get(row.task_id);
    if (!task) { queue.current.shift(); nextPractice(); return; }
    shownAt.current = performance.now();
    setPhase({ kind: "practice", task, left: queue.current.length });
  }

  async function answerDiagnostic(task: Task, given: string) {
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
    setAnswered(items.current.length);
    setTopicsSeen(new Set(items.current.map(i => i.topic_ord)).size);
    nextDiagnostic();
  }

  async function answerPractice(task: Task, given: string) {
    const row = queue.current[0];
    if (!row) return;
    const seconds = Math.round((performance.now() - shownAt.current) / 1000);
    const verdict = judge(task, given);
    try {
      await api.post("answers", [{
        student_id: user.id, task_id: task.id, topic_ord: task.topic_ord,
        source: supervised.current ? "lesson" : "home", given,
        is_correct: verdict.correct, error_code: verdict.code, seconds
      }]);
      await api.patch("plan_items", `id=eq.${row.id}`, { status: "done" });
    } catch (err) {
      setPhase({ kind: "error", message: err instanceof Error ? err.message : String(err) });
      return;
    }
    queue.current.shift();
    setPlanDone(n => n + 1);
    setPlan([...queue.current]);
    // дома ребёнок один — ему нужна обратная связь. На уроке разбирает учитель.
    if (supervised.current) nextPractice();
    else setPhase({ kind: "feedback", correct: verdict.correct, left: queue.current.length });
  }

  async function askTeacher(task: Task) {
    try {
      await api.post("help_requests", [{
        student_id: user.id, task_id: task.id,
        context: supervised.current ? "lesson" : "home"
      }]);
    } catch { /* не критично */ }
  }

  const bar = (
    <div className="mb-3 flex items-center gap-3">
      <span className="flex-1 truncate text-sm text-muted">{user.full_name}</span>
      <Quiet onClick={onExit}>{t.exit}</Quiet>
    </div>
  );

  return (
    <div className="mx-auto max-w-xl px-4 py-5">
      {bar}

      {phase.kind === "loading" && <Card><p className="text-muted">{t.loading}</p></Card>}

      {phase.kind === "error" && (
        <Card>
          <p className="font-read text-lg">{t.offline}</p>
          <Tech>{phase.message}</Tech>
          <div className="mt-4"><Primary onClick={() => void load()}>{t.retry}</Primary></div>
        </Card>
      )}

      {phase.kind === "home" && (
        <Home
          name={user.full_name} lang={user.lang} answered={answered} topics={topicsSeen}
          done={diagDone} onStart={nextDiagnostic}
          planLeft={plan.length} planDone={planDone} onPlan={nextPractice}
        />
      )}

      {phase.kind === "done" && (
        <Card><p className="font-read text-lg leading-relaxed">{t.finished}</p></Card>
      )}

      {phase.kind === "diagnostic" && (
        <Question
          key={`d${phase.task.id}`} task={phase.task} lang={user.lang} number={answered + 1}
          onAnswer={g => void answerDiagnostic(phase.task, g)}
          onAsk={() => void askTeacher(phase.task)}
        />
      )}

      {phase.kind === "practice" && (
        <Question
          key={`p${phase.task.id}`} task={phase.task} lang={user.lang}
          number={planDone + 1} left={phase.left}
          onAnswer={g => void answerPractice(phase.task, g)}
          onAsk={() => void askTeacher(phase.task)}
        />
      )}

      {phase.kind === "feedback" && (
        <Card>
          <p className={`font-read text-2xl ${phase.correct ? "text-teal" : "text-red"}`}>
            {phase.correct ? t.right : t.wrong}
          </p>
          <div className="mt-5">
            <Primary onClick={() => (phase.left ? nextPractice() : setPhase({ kind: "home" }))}>
              {phase.left ? t.next : t.done}
            </Primary>
          </div>
        </Card>
      )}
    </div>
  );
}
