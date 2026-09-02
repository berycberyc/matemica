// Кабинет ученика. Диагностика — тихий замер. Тренировка — то, чем живут пять дней в неделю.
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { dict } from "../lib/i18n";
import { Card, Primary, Quiet, Tech } from "../components/Ui";
import { Home, type HomeData } from "./Home";
import { Question } from "./Question";
import { apply, build, judge, pickNext, replay, type Engine } from "../lib/engine";
import type { Dep, Item, Option, Session, Task, Topic, User } from "../lib/types";

interface PlanRow { id: number; task_id: number; pos: number }
interface AnswerRow { topic_ord: number; created_at: string }

type Phase =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "home" }
  | { kind: "diagnostic"; task: Task }
  | { kind: "practice"; task: Task; left: number; retry: boolean }
  | { kind: "verdict"; correct: boolean; again: Task | null; left: number }
  | { kind: "diagDone" };

const day = (shift = 0) =>
  new Date(Date.now() + shift * 86_400_000).toISOString().slice(0, 10);

export function Student({ user, onExit }: { user: User; onExit: () => void }) {
  const t = dict(user.lang);
  const [phase, setPhase] = useState<Phase>({ kind: "loading" });
  const [home, setHome] = useState<HomeData | null>(null);

  const engine = useRef<Engine | null>(null);
  const session = useRef<Session | null>(null);
  const items = useRef<Item[]>([]);
  const tasks = useRef<Task[]>([]);
  const topics = useRef<Map<number, Topic>>(new Map());
  const queue = useRef<PlanRow[]>([]);
  const extra = useRef<Task[]>([]);
  const shownAt = useRef(0);
  const supervised = useRef(false);

  const load = useCallback(async () => {
    setPhase({ kind: "loading" });
    try {
      const [topicRows, deps, taskRows, options] = await Promise.all([
        api.all<Topic>("topics", "select=ord,code,title_ru,title_kk"),
        api.all<Dep>("topic_deps", "select=topic_ord,depends_on"),
        api.all<Task>("tasks", "is_active=is.true&select=id,topic_ord,level,answer_type," +
                               "stem_ru,stem_kk,answer_num,target_seconds"),
        api.all<Option>("options", "select=id,task_id,pos,body,is_correct,error_code")
      ]);
      if (!topicRows.length) throw new Error("в базе нет тем — не залит 02_topics.sql");
      if (!taskRows.length) throw new Error("в базе нет задач — не залит 07_bank.sql");
      for (const task of taskRows) {
        task.options = options.filter(o => o.task_id === task.id).sort((a, b) => a.pos - b.pos);
      }
      tasks.current = taskRows;
      topics.current = new Map(topicRows.map(x => [x.ord, x]));

      if (user.group_id !== null) {
        const open = await api.get<{ id: number }>("lessons",
          `group_id=eq.${user.group_id}&on_date=eq.${day()}&is_open=is.true&select=id`);
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
      const e = build(topicRows, deps, taskRows);
      replay(e, saved);
      engine.current = e;

      const [planRows, answers] = await Promise.all([
        api.all<PlanRow>("plan_items",
          `student_id=eq.${user.id}&on_date=eq.${day()}&status=eq.pending` +
          `&select=id,task_id,pos&order=pos.asc`),
        api.all<AnswerRow>("answers",
          `student_id=eq.${user.id}&select=topic_ord,created_at&order=created_at.desc`)
      ]);
      queue.current = planRows;

      const byId = new Map(taskRows.map(x => [x.id, x]));
      const planTopics = [...new Set(planRows
        .map(r => byId.get(r.task_id)?.topic_ord)
        .filter((x): x is number => x !== undefined))]
        .map(o => topics.current.get(o))
        .filter((x): x is Topic => x !== undefined);

      const days = [...new Set(answers.map(a => a.created_at.slice(0, 10)))].sort().reverse();
      let streak = 0;
      for (let i = 0; i < days.length; i++) {
        if (days[i] === day(-i) || (i === 0 && days[0] === day(-1))) streak++;
        else break;
      }
      const passed = [...new Set(answers.map(a => a.topic_ord))]
        .map(o => topics.current.get(o))
        .filter((x): x is Topic => x !== undefined)
        .slice(0, 12);

      setHome({
        planLeft: planRows.length,
        planTopics,
        solvedToday: answers.filter(a => a.created_at.slice(0, 10) === day()).length,
        solvedYesterday: answers.filter(a => a.created_at.slice(0, 10) === day(-1)).length,
        streak,
        passed,
        diagStarted: saved.length > 0,
        diagDone: !pickNext(e)
      });
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
      setPhase({ kind: "diagDone" });
      return;
    }
    shownAt.current = performance.now();
    setPhase({ kind: "diagnostic", task: next });
  }

  function nextPractice() {
    const fromExtra = extra.current.shift();
    if (fromExtra) {
      shownAt.current = performance.now();
      setPhase({ kind: "practice", task: fromExtra, left: extra.current.length, retry: false });
      return;
    }
    const row = queue.current[0];
    if (!row) { void load(); return; }
    const task = tasks.current.find(x => x.id === row.task_id);
    if (!task) { queue.current.shift(); nextPractice(); return; }
    shownAt.current = performance.now();
    setPhase({ kind: "practice", task, left: queue.current.length, retry: false });
  }

  function openTopic(topic: Topic) {
    extra.current = tasks.current
      .filter(x => x.topic_ord === topic.ord)
      .sort((a, b) => a.level - b.level)
      .slice(0, 5);
    nextPractice();
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
    nextDiagnostic();
  }

  // Такая же задача, но другая: после ошибки дома даём вторую попытку на том же месте,
  // а не ответ. Ответ выучивается, попытка — нет.
  function similar(task: Task, done: Set<number>): Task | null {
    return tasks.current.find(x =>
      x.topic_ord === task.topic_ord && x.level === task.level &&
      x.id !== task.id && !done.has(x.id)) ?? null;
  }

  async function answerPractice(task: Task, given: string, isRetry: boolean) {
    const seconds = Math.round((performance.now() - shownAt.current) / 1000);
    const verdict = judge(task, given);
    const fromPlan = !isRetry && queue.current[0]?.task_id === task.id;
    try {
      await api.post("answers", [{
        student_id: user.id, task_id: task.id, topic_ord: task.topic_ord,
        source: fromPlan ? (supervised.current ? "lesson" : "home") : "extra",
        given, is_correct: verdict.correct, error_code: verdict.code, seconds
      }]);
      if (fromPlan) {
        const row = queue.current[0];
        if (row) await api.patch("plan_items", `id=eq.${row.id}`, { status: "done" });
      }
    } catch (err) {
      setPhase({ kind: "error", message: err instanceof Error ? err.message : String(err) });
      return;
    }
    if (fromPlan) queue.current.shift();

    if (supervised.current) { nextPractice(); return; }   // на уроке разбирает учитель
    const again = verdict.correct || isRetry
      ? null
      : similar(task, new Set([task.id]));
    setPhase({
      kind: "verdict", correct: verdict.correct, again,
      left: queue.current.length + extra.current.length
    });
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
    <div className="mx-auto max-w-xl px-4 py-5">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex-1 truncate text-sm text-muted">{user.full_name}</span>
        <Quiet onClick={onExit}>{t.exit}</Quiet>
      </div>

      {phase.kind === "loading" && <Card><p className="text-muted">{t.loading}</p></Card>}

      {phase.kind === "error" && (
        <Card>
          <p className="font-read text-lg">{t.offline}</p>
          <Tech>{phase.message}</Tech>
          <div className="mt-4"><Primary onClick={() => void load()}>{t.retry}</Primary></div>
        </Card>
      )}

      {phase.kind === "home" && home && (
        <Home name={user.full_name} lang={user.lang} data={home}
              onDiag={nextDiagnostic} onPlan={nextPractice} onTopic={openTopic} />
      )}

      {phase.kind === "diagDone" && (
        <Card>
          <p className="font-read text-lg leading-relaxed">{t.finished}</p>
          <div className="mt-5"><Primary onClick={() => void load()}>{t.done}</Primary></div>
        </Card>
      )}

      {phase.kind === "diagnostic" && (
        <Question key={`d${phase.task.id}`} task={phase.task} lang={user.lang}
          onAnswer={g => void answerDiagnostic(phase.task, g)} />
      )}

      {phase.kind === "practice" && (
        <Question key={`p${phase.task.id}`} task={phase.task} lang={user.lang}
          left={phase.left} onAsk={() => void askTeacher(phase.task)}
          onAnswer={g => void answerPractice(phase.task, g, phase.retry)} />
      )}

      {phase.kind === "verdict" && (
        <Card>
          <p className={`font-read text-2xl ${phase.correct ? "text-teal" : "text-red"}`}>
            {phase.correct ? t.right : t.wrong}
          </p>
          {phase.again && (
            <p className="mt-2 text-[15px] text-muted">{t.tryAgain}</p>
          )}
          {!phase.correct && !phase.again && (
            <p className="mt-2 text-[15px] text-muted">{t.atLesson}</p>
          )}
          <div className="mt-5">
            {phase.again ? (
              <Primary onClick={() => {
                const again = phase.again;
                if (!again) return;
                shownAt.current = performance.now();
                setPhase({ kind: "practice", task: again, left: phase.left, retry: true });
              }}>{t.oneMore}</Primary>
            ) : (
              <Primary onClick={() => (phase.left ? nextPractice() : void load())}>
                {phase.left ? t.next : t.done}
              </Primary>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
