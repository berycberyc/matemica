// Движок диагностики. Чистая логика: ни экранов, ни сети —
// поэтому её можно прогнать отдельно и убедиться, что ветвление верное.
//
// Внутри темы три этажа: 1 — приём, 2 — стандартная задача, 3 — нужна идея.
// Начинаем со второго. Ответил быстро и верно — поднимаем на третий.
// Ошибся — опускаем на первый. Провалил первый — уходим вниз по зависимостям.

const S = {
  user: null, topics: {}, prereq: {}, dependent: {},
  tasks: [], byTopic: {}, session: null, items: [],
  status: {}, nextLevel: {}, cameDown: {}, focus: [], descent: [], used: new Set(),
  current: null, shownAt: 0, windowOpen: false, windowCheckedAt: 0
};

const SLOW_FACTOR = 1.5;    // дольше полутора целевых времён — «шатко»
const START_LEVEL = 2;      // с какого этажа начинаем незнакомую тему

function walk(map, start) {
  const seen = new Set(), stack = [...(map[start] || [])];
  while (stack.length) {
    const x = stack.pop();
    if (!seen.has(x)) { seen.add(x); (map[x] || []).forEach(y => stack.push(y)); }
  }
  return [...seen];
}

// Порядок входа: сверху вниз. Первой спрашиваем тему, под которой стоит больше всего
// других, потому что один верный ответ там закрывает сразу много.
function entryOrder() {
  return Object.keys(S.byTopic).map(Number)
    .sort((a, b) => walk(S.prereq, b).length - walk(S.prereq, a).length || a - b);
}

function inferBelow(topic) {
  walk(S.prereq, topic).forEach(p => { if (!S.status[p]) S.status[p] = "ok_inferred"; });
}

function markEarlyAbove(topic) {
  walk(S.dependent, topic).forEach(d => { if (!S.status[d]) S.status[d] = "early"; });
}

function applyResult(topic, level, correct, seconds, target, dontknow) {
  S.focus = S.focus.filter(t => t !== topic);
  const fast = seconds <= target * SLOW_FACTOR;

  if (correct && !dontknow) {
    if (!fast) { S.status[topic] = "shaky"; return; }
    if (S.cameDown[topic]) { S.status[topic] = "partial"; inferBelow(topic); return; }
    if (level >= 3) { S.status[topic] = "ok"; inferBelow(topic); return; }
    S.nextLevel[topic] = level + 1;
    S.focus.push(topic);
    return;
  }

  if (level > 1) {
    S.nextLevel[topic] = level - 1;
    S.cameDown[topic] = true;
    S.focus.push(topic);
    return;
  }

  S.status[topic] = "fail";
  (S.prereq[topic] || []).forEach(p => {
    if (!S.status[p] && !S.descent.includes(p)) { S.descent.push(p); S.nextLevel[p] = 1; }
  });
  markEarlyAbove(topic);
}

function replay() {
  S.status = {}; S.nextLevel = {}; S.cameDown = {}; S.focus = []; S.descent = []; S.used = new Set();
  for (const it of S.items) {
    S.used.add(it.task_id);
    const task = S.tasks.find(t => t.id === it.task_id);
    applyResult(it.topic_ord, task ? task.level : 2, it.is_correct === true,
                it.seconds || 0, task ? task.target_seconds : 90, it.given === "?");
  }
}

function freeTask(topic, level) {
  const list = (S.byTopic[topic] || []).filter(t => !S.used.has(t.id));
  if (!list.length) return null;
  return list.find(t => t.level === level) || null;
}

function pickNext() {
  for (let i = S.focus.length - 1; i >= 0; i--) {
    const t = S.focus[i], q = freeTask(t, S.nextLevel[t]);
    if (q) return q;
  }
  for (const t of S.descent) {
    if (!S.status[t] || S.status[t] === "ok_inferred") {
      const q = freeTask(t, S.nextLevel[t] || 1);
      if (q) return q;
    }
  }
  for (const t of entryOrder()) {
    if (!S.status[t] && !S.cameDown[t]) {
      const q = freeTask(t, S.nextLevel[t] || START_LEVEL);
      if (q) return q;
    }
  }
  return null;
}

// Сверка ответа. 2/4 и 1/2 — одно и то же число, форма не наказывается.
function toNumber(s) {
  const t = String(s).trim().replace(",", ".").replace(/\s+/g, "");
  if (!t) return null;
  if (t.includes("/")) {
    const p = t.split("/");
    const x = parseFloat(p[0]), y = parseFloat(p[1]);
    if (!isFinite(x) || !isFinite(y) || y === 0) return null;
    return x / y;
  }
  const v = parseFloat(t);
  return isFinite(v) ? v : null;
}

function judge(task, given) {
  if (given === "?") return { correct: false, code: null };
  if (task.answer_type === "choice") {
    const hit = (task.options || []).find(o => o.body === given);
    return { correct: !!(hit && hit.is_correct), code: hit && !hit.is_correct ? hit.error_code : null };
  }
  const a = toNumber(given), b = task.answer_num === null ? null : Number(task.answer_num);
  if (a === null || b === null) return { correct: false, code: null };
  if (Math.abs(a - b) < 1e-6) return { correct: true, code: null };
  const miss = (task.options || []).find(function (o) {
    const v = toNumber(o.body);
    return !o.is_correct && v !== null && Math.abs(v - a) < 1e-6;
  });
  return { correct: false, code: miss ? miss.error_code : null };
}

if (typeof module !== "undefined") module.exports =
  { S, walk, entryOrder, applyResult, replay, freeTask, pickNext, judge, toNumber, SLOW_FACTOR, START_LEVEL };
