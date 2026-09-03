// assign.ts — назначение тренировочных задач на вечер.
// Чистые функции: ни сети, ни базы. Прогоняется без браузера, как engine.ts.
// Диагностику не трогает — за неё отвечает engine.ts.

import type { Status } from "./engine";
import type { Dep, Task, Topic } from "./types";

/** Состояние темы у ребёнка. Соответствует таблице topic_status. */
export interface TopicState {
  student_id: number;
  topic_ord: number;
  state: Status | "unknown";
  closed_on: string | null;    // дата перехода в ok — от неё считаются возвраты
}

/** Что ребёнку уже выдавали — строки plan_items. */
export interface GivenRow { student_id: number; task_id: number; on_date: string }

export interface Settings {
  volume: number;            // задач в день на ученика
  returns: number[];         // через сколько дней возвращать закрытую тему
  no_repeat_days: number;    // не давать ту же задачу столько дней
  lesson_share: number;      // какая доля набора отдаётся теме урока
  front_max: number;         // сколько задач подряд на одну тему фронта
}

export const DEFAULTS: Settings = {
  volume: 8,
  returns: [3, 8, 21],
  no_repeat_days: 14,
  lesson_share: 0.5,
  front_max: 4
};

const CLOSED: (Status | "unknown")[] = ["ok", "ok_inferred"];
const DAY = 86_400_000;

function diffDays(a: string, b: string): number {
  return Math.round((Date.parse(a) - Date.parse(b)) / DAY);
}

function title(t: Topic | undefined, lang: "ru" | "kk"): string {
  if (!t) return "";
  return lang === "kk" && t.title_kk ? t.title_kk : t.title_ru;
}

// Этаж по состоянию. fail — нет основы, идём с приёма. partial — верх не взял.
// shaky — знает, но медленно: тот же этаж, лечится скорость, а не понимание.
export function levelFor(s: Status | "unknown"): 1 | 2 | 3 {
  return s === "fail" ? 1 : 2;
}

// Фронт: не «где хуже всего», а «где обрыв, до которого ребёнок дорос» —
// самая нижняя незакрытая тема, под которой всё уже целое.
// Давать проценты тому, у кого провалена доля от числа, — выбросить неделю.
export function front(
  st: Map<number, Status | "unknown">,
  depsOf: Map<number, number[]>
): number[] {
  const out: number[] = [];
  for (const [ord, s] of st) {
    if (s !== "fail" && s !== "partial" && s !== "shaky") continue;
    const under = depsOf.get(ord) ?? [];
    if (under.every(d => CLOSED.includes(st.get(d) ?? "unknown"))) out.push(ord);
  }
  return out.sort((a, b) => a - b);
}

// Возвраты. Тема, закрытая сегодня, обязана вернуться через 3, 8 и 21 день.
// Провал на возврате — не регресс ребёнка, а пойманная пустота: понимания
// под ответом не было, был свежий образец рядом с учителем.
export function dueReturns(rows: TopicState[], today: string, returns: number[]): number[] {
  const out: number[] = [];
  for (const r of rows) {
    if (r.state !== "ok" || !r.closed_on) continue;
    if (returns.includes(diffDays(today, r.closed_on))) out.push(r.topic_ord);
  }
  return out;
}

function pick(
  bank: Task[], ord: number, level: number, seen: Set<number>, used: Set<number>
): Task | null {
  const pool = bank.filter(t => t.topic_ord === ord && t.level === level && !used.has(t.id));
  const fresh = pool.filter(t => !seen.has(t.id));
  const chosen = fresh.length ? fresh : pool;   // свежих нет — повтор, но не пусто
  const t = chosen[0];
  if (!t) return null;
  used.add(t.id);
  return t;
}

export interface PlannedTask {
  task_id: number; topic_ord: number; level: number; reason: string;
}

export interface DayPlan {
  student_id: number;
  date: string;
  tasks: PlannedTask[];
  prediction: string | null;
  gaps: string[];       // куда алгоритм пошёл, а задач там нет
  notes: string[];
}

export function planDay(
  student_id: number,
  statuses: TopicState[],
  topics: Topic[],
  deps: Dep[],
  bank: Task[],
  given: GivenRow[],
  today: string,
  lessonTopic: number | null,
  cfg: Settings = DEFAULTS,
  lang: "ru" | "kk" = "ru"
): DayPlan {
  const byOrd = new Map(topics.map(t => [t.ord, t]));
  const name = (o: number) => `${byOrd.get(o)?.code ?? o} ${title(byOrd.get(o), lang)}`.trim();

  const depsOf = new Map<number, number[]>();
  for (const d of deps) {
    const list = depsOf.get(d.topic_ord) ?? [];
    list.push(d.depends_on);
    depsOf.set(d.topic_ord, list);
  }

  const mine = statuses.filter(s => s.student_id === student_id);
  const st = new Map<number, Status | "unknown">(mine.map(s => [s.topic_ord, s.state]));

  const seen = new Set(
    given.filter(g => g.student_id === student_id &&
                      diffDays(today, g.on_date) <= cfg.no_repeat_days)
         .map(g => g.task_id));
  const used = new Set<number>();
  const out: PlannedTask[] = [];
  const gaps: string[] = [];
  const notes: string[] = [];

  const add = (ord: number, level: number, reason: string): boolean => {
    const t = pick(bank, ord, level, seen, used);
    if (!t) { gaps.push(`${name(ord)} — уровень ${level}`); return false; }
    out.push({ task_id: t.id, topic_ord: ord, level, reason });
    return true;
  };

  // 1. Урок главнее цифр: разобрали проценты — вечером проценты.
  if (lessonTopic !== null) {
    const s = st.get(lessonTopic) ?? "unknown";
    const under = (depsOf.get(lessonTopic) ?? [])
      .filter(d => !CLOSED.includes(st.get(d) ?? "unknown"));
    if (s === "early" || under.length) {
      // Ребёнок сидел на уроке, но взять тему не мог: под ней дыра.
      // Прямую зависимость давать нельзя — она сама может быть выше его этажа.
      const below = new Set<number>();
      const walk = (o: number) => {
        for (const d of depsOf.get(o) ?? []) if (!below.has(d)) { below.add(d); walk(d); }
      };
      walk(lessonTopic);
      const reach = front(st, depsOf).filter(o => below.has(o));
      notes.push(
        `Тему урока ${name(lessonTopic)} не даём: не закрыто ` +
        under.map(name).join(", ") +
        (reach.length
          ? ". Спустились до " + reach.slice(0, 2).map(name).join(", ")
          : ". Дорос только до своего фронта, урок сегодня мимо него."));
      for (const d of reach.slice(0, 2)) add(d, levelFor(st.get(d) ?? "unknown"), "спуск под тему урока");
    } else {
      const n = Math.ceil(cfg.volume * cfg.lesson_share);
      const lvl = s === "ok" || s === "ok_inferred" ? 3 : levelFor(s);
      for (let i = 0; i < n; i++) if (!add(lessonTopic, lvl, "тема урока")) break;
    }
  }

  // 2. Возвраты — раньше нового: проверяют, было ли понимание под ответом.
  for (const ord of dueReturns(mine, today, cfg.returns)) {
    if (out.length >= cfg.volume) break;
    add(ord, 2, "возврат");
  }

  // 3. Фронт — самая нижняя тема, до которой ребёнок дорос.
  let prediction: string | null = null;
  for (const ord of front(st, depsOf)) {
    if (out.length >= cfg.volume) break;
    const lvl = levelFor(st.get(ord) ?? "unknown");
    const before = out.length;
    while (out.length < cfg.volume && out.length - before < cfg.front_max) {
      if (!add(ord, lvl, "фронт")) break;
    }
    if (out.length > before && !prediction) {
      // Предсказание пишется ДО недели, иначе срез ничего не проверяет.
      const above = deps.filter(d => d.depends_on === ord).map(d => d.topic_ord);
      prediction = above.length
        ? `Обрыв в ${name(ord)}. Даём неделю. К пятнице ` +
          `${above.slice(0, 2).map(name).join(", ")} поднимется без отдельных занятий по ним.`
        : `Обрыв в ${name(ord)}. К пятнице уровень 2 берётся в срок.`;
    }
  }

  // 4. Добор поддержкой из закрытых тем — чтобы вечер не был из одних провалов.
  if (out.length < cfg.volume) {
    for (const [ord, s] of st) {
      if (out.length >= cfg.volume) break;
      if (s === "ok") add(ord, 2, "поддержка");
    }
  }

  // Долг не показывается и не копится: невыполненное вчера просто попадает
  // в завтрашний набор теми же темами.
  return { student_id, date: today, tasks: out, prediction, gaps, notes };
}

// Слепые зоны банка: куда спуск упирается, а задач нет.
// Гонять после каждого среза, иначе ребёнок увидит пустой экран.
export function blindSpots(
  statuses: TopicState[], deps: Dep[], bank: Task[], topics: Topic[]
): string[] {
  const has = new Set(bank.map(t => `${t.topic_ord}:${t.level}`));
  const byOrd = new Map(topics.map(t => [t.ord, t]));
  const name = (o: number) => `${byOrd.get(o)?.code ?? o} ${title(byOrd.get(o), "ru")}`.trim();
  const depsOf = new Map<number, number[]>();
  for (const d of deps) {
    const list = depsOf.get(d.topic_ord) ?? [];
    list.push(d.depends_on);
    depsOf.set(d.topic_ord, list);
  }
  const bad = new Set<string>();
  for (const id of new Set(statuses.map(s => s.student_id))) {
    const st = new Map<number, Status | "unknown">(
      statuses.filter(s => s.student_id === id).map(s => [s.topic_ord, s.state]));
    for (const ord of front(st, depsOf)) {
      const lvl = levelFor(st.get(ord) ?? "unknown");
      if (!has.has(`${ord}:${lvl}`)) bad.add(`${name(ord)} — нужен уровень ${lvl}, задач нет`);
    }
    for (const [ord, s] of st) {
      if (s !== "fail") continue;
      for (const d of depsOf.get(ord) ?? []) {
        if (!has.has(`${d}:1`)) bad.add(`${name(d)} — спуск упирается, задач нет`);
      }
    }
  }
  return [...bad].sort();
}

/** Перевод планов в файл, который принимает кабинет преподавателя. */
export function toPlanFile(
  plans: DayPlan[],
  loginOf: Map<number, string>,
  week: string,
  notes: { student_id: number; text: string }[] = []
): unknown {
  const byStudent = new Map<number, Map<string, number[]>>();
  for (const p of plans) {
    const days = byStudent.get(p.student_id) ?? new Map<string, number[]>();
    const list = days.get(p.date) ?? [];
    for (const t of p.tasks) list.push(t.task_id);
    days.set(p.date, list);
    byStudent.set(p.student_id, days);
  }
  return {
    вид: "план",
    неделя: week,
    задачи: [],
    план: [...byStudent.entries()]
      .filter(([id]) => loginOf.has(id))
      .map(([id, days]) => ({
        login: loginOf.get(id),
        дни: [...days.entries()].map(([дата, задачи]) => ({ дата, задачи }))
      })),
    заключения: notes
      .filter(n => loginOf.has(n.student_id))
      .map(n => ({ login: loginOf.get(n.student_id), текст: n.text }))
  };
}
