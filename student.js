// Кабинет ученика: экраны, клавиатура, сохранение после каждого ответа.
// Логика ветвления живёт в engine.js.

async function loadCatalog() {
  const [topics, deps, tasks] = await Promise.all([
    API.get("topics", "select=ord,code,title_ru,title_kk"),
    API.get("topic_deps", "select=topic_ord,depends_on"),
    API.get("tasks", "is_active=is.true&select=id,topic_ord,level,answer_type,stem_ru,stem_kk," +
                     "answer_num,target_seconds,options(id,pos,body,is_correct,error_code)")
  ]);
  topics.forEach(t => { S.topics[t.ord] = t; S.prereq[t.ord] = []; S.dependent[t.ord] = []; });
  deps.forEach(d => {
    if (S.prereq[d.topic_ord]) S.prereq[d.topic_ord].push(d.depends_on);
    if (S.dependent[d.depends_on]) S.dependent[d.depends_on].push(d.topic_ord);
  });
  S.tasks = tasks;
  tasks.forEach(t => (S.byTopic[t.topic_ord] = S.byTopic[t.topic_ord] || []).push(t));
  for (const k in S.byTopic) S.byTopic[k].sort((a, b) => a.level - b.level);
}

// ------------------------------------------------------------------ экраны

function screenLogin(msg) {
  const box = el("div", "card login");
  box.appendChild(el("h1", null, "matemica"));
  const l = el("input"); l.type = "tel"; l.inputMode = "numeric"; l.placeholder = T("login");
  l.autocapitalize = "off"; l.autocorrect = "off";
  const p = el("input"); p.type = "password"; p.inputMode = "numeric"; p.placeholder = T("pass");
  p.autocapitalize = "off"; p.autocorrect = "off";
  const eye = el("button", "ghost", "показать код");
  eye.onclick = () => { p.type = p.type === "password" ? "tel" : "password"; };
  const btn = el("button", "primary", T("enter"));
  const err = el("div", "err", msg || "");
  btn.onclick = async () => {
    btn.disabled = true;
    try {
      const r = await signIn(l.value, p.value);
      if (r.error) { err.textContent = T(r.error); btn.disabled = false; return; }
      STORE.save(r.user);
      boot(r.user);
    } catch { err.textContent = T("offline"); btn.disabled = false; }
  };
  p.onkeydown = e => { if (e.key === "Enter") btn.click(); };
  [l, p, eye, btn, err].forEach(x => box.appendChild(x));
  show(box);
  l.focus();
}

function keypad(onKey) {
  const pad = el("div", "pad");
  const keys = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "−", "0", ",", "/", "⌫"];
  keys.forEach(k => {
    const b = el("button", k === "⌫" ? "key wide" : "key", k);
    b.onclick = () => onKey(k);
    pad.appendChild(b);
  });
  return pad;
}

function screenQuestion(task) {
  S.current = task; S.shownAt = performance.now();
  const stem = (LANG === "kk" && task.stem_kk) ? task.stem_kk : task.stem_ru;
  const box = el("div", "card q");
  box.appendChild(el("div", "num", T("question") + " " + (S.items.length + 1)));
  box.appendChild(el("div", "stem", stem));

  let value = "";
  const send = async given => {
    const secs = Math.round((performance.now() - S.shownAt) / 1000);
    await saveAnswer(task, given, secs);
  };

  if (task.answer_type === "choice") {
    const opts = [...task.options].sort((a, b) => a.pos - b.pos);
    opts.forEach(o => {
      const b = el("button", "opt", o.body);
      b.onclick = () => { box.querySelectorAll("button").forEach(x => x.disabled = true); send(o.body); };
      box.appendChild(b);
    });
  } else {
    const field = el("div", "field", "");
    field.dataset.ph = T("typeAnswer");
    box.appendChild(field);
    box.appendChild(keypad(k => {
      if (k === "⌫") value = value.slice(0, -1);
      else if (value.length < 12) value += (k === "−" ? "-" : k);
      field.textContent = value;
    }));
    const ok = el("button", "primary", T("answer"));
    ok.onclick = () => { if (!value) return; ok.disabled = true; send(value); };
    box.appendChild(ok);
  }

  const dk = el("button", "ghost", T("dontknow"));
  dk.onclick = () => { dk.disabled = true; send("?"); };
  box.appendChild(dk);

  const ask = el("button", "ghost", T("ask"));
  ask.onclick = async () => {
    ask.disabled = true; ask.textContent = T("asked");
    try {
      await API.post("help_requests", [{
        student_id: S.user.id, task_id: task.id,
        context: (await isWindowOpen()) ? "lesson" : "home"
      }]);
    } catch { }
  };
  box.appendChild(ask);
  show(box);
}

async function saveAnswer(task, given, seconds) {
  const v = judge(task, given);
  const row = {
    session_id: S.session.id, pos: S.items.length + 1, task_id: task.id,
    topic_ord: task.topic_ord, given: given, is_correct: v.correct,
    error_code: v.code, seconds: seconds, answered_at: new Date().toISOString(),
    supervised: await isWindowOpen()
  };
  try {
    const saved = await API.post("diag_items", [row]);
    S.items.push(saved[0] || row);
  } catch (e) {
    show(errorCard(T("offline"), () => saveAnswer(task, given, seconds)));
    return;
  }
  S.used.add(task.id);
  applyResult(task.topic_ord, task.level, v.correct, seconds, task.target_seconds, given === "?");
  step();
}

function errorCard(msg, retry) {
  const box = el("div", "card");
  box.appendChild(el("div", "stem", msg));
  const b = el("button", "primary", T("next"));
  b.onclick = retry;
  box.appendChild(b);
  return box;
}

async function step() {
  const next = pickNext();
  if (!next) {
    try {
      await API.patch("diag_sessions", "id=eq." + S.session.id,
        { status: "done", finished_at: new Date().toISOString() });
    } catch { }
    const box = el("div", "card");
    box.appendChild(el("div", "stem", T("finished")));
    const out = el("button", "ghost", T("exit"));
    out.onclick = () => { STORE.clear(); location.reload(); };
    box.appendChild(out);
    show(box);
    return;
  }
  screenQuestion(next);
}

async function boot(user) {
  S.user = user;
  setLang(user.lang);
  show(el("div", "card", "…"));
  try {
    await loadCatalog();
    await startSession();
    await step();
  } catch (e) {
    show(errorCard(T("offline"), () => boot(user)));
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const saved = STORE.load();
  if (saved && saved.role === "student") boot(saved);
  else if (saved) location.href = "teacher.html";
  else screenLogin();
});
