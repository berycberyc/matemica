// Движок диагностики. Чистая логика без экранов и без сети —
// поэтому её можно прогнать отдельно и убедиться, что ветвление верное.

const S = {
  user: null, topics: {}, prereq: {}, dependent: {},
  tasks: [], byTopic: {}, session: null, items: [],
  status: {}, pendingSecond: [], descent: [], used: new Set(),
  current: null, shownAt: 0, windowOpen: false, windowCheckedAt: 0
};

const SLOW_FACTOR = 1.5;   // дольше полутора целевых времён — «шатко»

function walk(map, start) {
  const seen = new Set(), stack = [...(map[start] || [])];
  while (stack.length) {
    const x = stack.pop();
    if (!seen.has(x)) { seen.add(x); (map[x] || []).forEach(y => stack.push(y)); }
  }
  return [...seen];
}

// Порядок входа: сверху вниз. Первым спрашиваем то, под чем стоит больше всего тем,
// потому что один верный ответ там закрывает сразу много.
function entryOrder() {
  return Object.keys(S.byTopic).map(Number)
    .sort((a, b) => walk(S.prereq, b).length - walk(S.prereq, a).length || a - b);
}

function applyResult(topic, correct, seconds, target, dontknow) {
  if (correct) {
    const fast = seconds <= target * SLOW_FACTOR;
    S.status[topic] = fast ? "ok" : "shaky";
    S.pendingSecond = S.pendingSecond.filter(t => t !== topic);
    // медленный верный ответ темы под собой НЕ закрывает
    if (fast) walk(S.prereq, topic).forEach(p => { if (!S.status[p]) S.status[p] = "ok_inferred"; });
    return;
  }
  const second = S.pendingSecond.includes(topic);
  if (!second && !dontknow) { S.pendingSecond.push(topic); return; }   // первая ошибка — не приговор
  S.pendingSecond = S.pendingSecond.filter(t => t !== topic);
  S.status[topic] = "fail";
  (S.prereq[topic] || []).forEach(p => { if (!S.status[p] && !S.descent.includes(p)) S.descent.push(p); });
  walk(S.dependent, topic).forEach(d => { if (!S.status[d]) S.status[d] = "early"; });
}

function replay() {
  S.status = {}; S.pendingSecond = []; S.descent = []; S.used = new Set();
  for (const it of S.items) {
    S.used.add(it.task_id);
    const task = S.tasks.find(t => t.id === it.task_id);
    const target = task ? task.target_seconds : 90;
    applyResult(it.topic_ord, it.is_correct === true, it.seconds || 0, target, it.given === "?");
  }
}

function freeTask(topic) {
  const list = S.byTopic[topic] || [];
  return list.find(t => !S.used.has(t.id)) || null;
}

function pickNext() {
  for (const t of S.pendingSecond) { const q = freeTask(t); if (q) return q; }
  for (const t of S.descent) {
    if (!S.status[t] || S.status[t] === "ok_inferred") { const q = freeTask(t); if (q) return q; }
  }
  for (const t of entryOrder()) {
    if (!S.status[t]) { const q = freeTask(t); if (q) return q; }
  }
  return null;
}

async function isWindowOpen() {
  if (Date.now() - S.windowCheckedAt < 60000) return S.windowOpen;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const rows = await API.get("lessons",
      "group_id=eq." + S.user.group_id + "&on_date=eq." + today + "&is_open=is.true&select=id");
    S.windowOpen = rows.length > 0;
  } catch { S.windowOpen = false; }
  S.windowCheckedAt = Date.now();
  return S.windowOpen;
}

async function startSession() {
  const open = await API.get("diag_sessions",
    "student_id=eq." + S.user.id + "&status=eq.in_progress&select=*&order=pass_no.desc&limit=1");
  if (open.length) { S.session = open[0]; }
  else {
    const all = await API.get("diag_sessions", "student_id=eq." + S.user.id + "&select=pass_no");
    const next = all.length ? Math.max(...all.map(r => r.pass_no)) + 1 : 1;
    const made = await API.post("diag_sessions",
      [{ student_id: S.user.id, pass_no: next, supervised: await isWindowOpen() }]);
    S.session = made[0];
  }
  S.items = await API.get("diag_items",
    "session_id=eq." + S.session.id + "&select=*&order=pos.asc");
  replay();
}

// Сравнение ответа. 2/4 и 1/2 — одно и то же число, форма не наказывается.
function toNumber(s) {
  const t = String(s).trim().replace(",", ".").replace(/\s+/g, "");
  if (!t) return null;
  if (t.includes("/")) {
    const [a, b] = t.split("/");
    const x = parseFloat(a), y = parseFloat(b);
    if (!isFinite(x) || !isFinite(y) || y === 0) return null;
    return x / y;
  }
  const v = parseFloat(t);
  return isFinite(v) ? v : null;
}

function judge(task, given) {
  if (given === "?") return { correct: false, code: null };
  if (task.answer_type === "choice") {
    const hit = task.options.find(o => o.body === given);
    return { correct: !!(hit && hit.is_correct), code: hit && !hit.is_correct ? hit.error_code : null };
  }
  const a = toNumber(given), b = task.answer_num === null ? null : Number(task.answer_num);
  if (a === null || b === null) return { correct: false, code: null };
  if (Math.abs(a - b) < 1e-9) return { correct: true, code: null };
  const miss = (task.options || []).find(o => !o.is_correct && Math.abs(toNumber(o.body) - a) < 1e-9);
  return { correct: false, code: miss ? miss.error_code : null };
}


if (typeof module !== 'undefined') module.exports = { S, walk, entryOrder, applyResult, replay, freeTask, pickNext, judge, toNumber, SLOW_FACTOR };
