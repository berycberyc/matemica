// Движок диагностики. Чистая логика: ни экранов, ни сети.
//
// Внутри темы три этажа: 1 — приём, 2 — стандартная задача, 3 — нужна идея.
// Начинаем со второго. Верно и быстро — поднимаем выше.
// Ошибся — опускаем на этаж ниже. Провалил первый — уходим вниз по зависимостям.

import type { Item, Task, Topic, Dep } from "./types";

export type Status = "ok" | "ok_inferred" | "shaky" | "partial" | "fail" | "early";

export const SLOW_FACTOR = 1.5;
export const START_LEVEL = 2;

export interface Engine {
  prereq: Map<number, number[]>;
  dependent: Map<number, number[]>;
  byTopic: Map<number, Task[]>;
  tasks: Map<number, Task>;
  status: Map<number, Status>;
  nextLevel: Map<number, number>;
  cameDown: Set<number>;
  focus: number[];
  descent: number[];
  used: Set<number>;
}

export function build(topics: Topic[], deps: Dep[], tasks: Task[]): Engine {
  const e: Engine = {
    prereq: new Map(), dependent: new Map(), byTopic: new Map(), tasks: new Map(),
    status: new Map(), nextLevel: new Map(), cameDown: new Set(),
    focus: [], descent: [], used: new Set()
  };
  for (const t of topics) { e.prereq.set(t.ord, []); e.dependent.set(t.ord, []); }
  for (const d of deps) {
    e.prereq.get(d.topic_ord)?.push(d.depends_on);
    e.dependent.get(d.depends_on)?.push(d.topic_ord);
  }
  for (const task of tasks) {
    e.tasks.set(task.id, task);
    const list = e.byTopic.get(task.topic_ord) ?? [];
    list.push(task);
    e.byTopic.set(task.topic_ord, list);
  }
  for (const list of e.byTopic.values()) list.sort((a, b) => a.level - b.level);
  return e;
}

function walk(map: Map<number, number[]>, start: number): number[] {
  const seen = new Set<number>();
  const stack = [...(map.get(start) ?? [])];
  while (stack.length) {
    const x = stack.pop();
    if (x === undefined || seen.has(x)) continue;
    seen.add(x);
    for (const y of map.get(x) ?? []) stack.push(y);
  }
  return [...seen];
}

// Порядок входа: сверху вниз. Первой спрашиваем тему, под которой стоит больше всего
// других — один верный ответ там закрывает сразу много.
export function entryOrder(e: Engine): number[] {
  return [...e.byTopic.keys()].sort(
    (a, b) => walk(e.prereq, b).length - walk(e.prereq, a).length || a - b
  );
}

export function apply(
  e: Engine, topic: number, level: number,
  correct: boolean, seconds: number, target: number, dontKnow: boolean
): void {
  e.focus = e.focus.filter(t => t !== topic);
  const fast = seconds <= target * SLOW_FACTOR;

  if (correct && !dontKnow) {
    if (!fast) { e.status.set(topic, "shaky"); return; }   // медленный верный низ не закрывает
    if (e.cameDown.has(topic)) {
      e.status.set(topic, "partial");
      inferBelow(e, topic);
      return;
    }
    if (level >= 3) { e.status.set(topic, "ok"); inferBelow(e, topic); return; }
    e.nextLevel.set(topic, level + 1);
    e.focus.push(topic);
    return;
  }

  if (level > 1) {                                          // не вышло наверху — проверим низ
    e.nextLevel.set(topic, level - 1);
    e.cameDown.add(topic);
    e.focus.push(topic);
    return;
  }

  e.status.set(topic, "fail");                              // не вышло и внизу — спуск
  for (const p of e.prereq.get(topic) ?? []) {
    if (!e.status.has(p) && !e.descent.includes(p)) {
      e.descent.push(p);
      e.nextLevel.set(p, 1);
    }
  }
  for (const d of walk(e.dependent, topic)) {
    if (!e.status.has(d)) e.status.set(d, "early");
  }
}

function inferBelow(e: Engine, topic: number): void {
  for (const p of walk(e.prereq, topic)) {
    if (!e.status.has(p)) e.status.set(p, "ok_inferred");
  }
}

export function replay(e: Engine, items: Item[]): void {
  e.status.clear(); e.nextLevel.clear(); e.cameDown.clear();
  e.focus = []; e.descent = []; e.used.clear();
  for (const it of items) {
    e.used.add(it.task_id);
    const task = e.tasks.get(it.task_id);
    apply(e, it.topic_ord, task?.level ?? START_LEVEL, it.is_correct === true,
          it.seconds ?? 0, task?.target_seconds ?? 90, it.given === "?");
  }
}

function freeTask(e: Engine, topic: number, level: number): Task | null {
  const list = (e.byTopic.get(topic) ?? []).filter(t => !e.used.has(t.id));
  return list.find(t => t.level === level) ?? null;
}

export function pickNext(e: Engine): Task | null {
  for (let i = e.focus.length - 1; i >= 0; i--) {
    const t = e.focus[i];
    if (t === undefined) continue;
    const q = freeTask(e, t, e.nextLevel.get(t) ?? START_LEVEL);
    if (q) return q;
  }
  for (const t of e.descent) {
    const st = e.status.get(t);
    if (!st || st === "ok_inferred") {
      const q = freeTask(e, t, e.nextLevel.get(t) ?? 1);
      if (q) return q;
    }
  }
  for (const t of entryOrder(e)) {
    if (!e.status.has(t) && !e.cameDown.has(t)) {
      const q = freeTask(e, t, e.nextLevel.get(t) ?? START_LEVEL);
      if (q) return q;
    }
  }
  return null;
}

// Сверка ответа. 2/4 и 1/2 — одно и то же число, форма не наказывается.
export function toNumber(raw: string): number | null {
  const t = raw.trim().replace(",", ".").replace(/\s+/g, "").replace(/−/g, "-");
  if (!t) return null;
  if (t.includes("/")) {
    const [a, b] = t.split("/");
    const x = Number(a), y = Number(b);
    if (!isFinite(x) || !isFinite(y) || y === 0) return null;
    return x / y;
  }
  const v = Number(t);
  return isFinite(v) ? v : null;
}

export interface Verdict { correct: boolean; code: string | null }

export function judge(task: Task, given: string): Verdict {
  if (given === "?") return { correct: false, code: null };
  if (task.answer_type === "choice") {
    const hit = task.options.find(o => o.body === given);
    return { correct: hit?.is_correct === true, code: hit && !hit.is_correct ? hit.error_code : null };
  }
  const a = toNumber(given);
  const b = task.answer_num === null ? null : Number(task.answer_num);
  if (a === null || b === null) return { correct: false, code: null };
  if (Math.abs(a - b) < 1e-6) return { correct: true, code: null };
  const miss = task.options.find(o => {
    const v = toNumber(o.body);
    return !o.is_correct && v !== null && Math.abs(v - a) < 1e-6;
  });
  return { correct: false, code: miss?.error_code ?? null };
}
