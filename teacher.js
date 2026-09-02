// Кабинет преподавателя. Окно диагностики и живая картина по группам.

const T2 = { user: null, groups: [], timer: null };
const WINDOW_HOURS = 2;

function today() { return new Date().toISOString().slice(0, 10); }

async function closeStale() {
  const rows = await API.get("lessons", "is_open=is.true&select=id,started_at");
  const limit = Date.now() - WINDOW_HOURS * 3600 * 1000;
  for (const r of rows) {
    if (new Date(r.started_at).getTime() < limit) {
      await API.patch("lessons", "id=eq." + r.id, { is_open: false, ended_at: new Date().toISOString() });
    }
  }
}

async function loadBoard() {
  const [groups, lessons, students, items, help] = await Promise.all([
    API.get("groups", "is_active=is.true&select=id,name&order=name.asc"),
    API.get("lessons", "on_date=eq." + today() + "&select=id,group_id,is_open,started_at"),
    API.get("users", "role=eq.student&is_active=is.true&select=id,full_name,group_id,lang"),
    API.get("diag_sessions", "select=id,student_id"),
    API.get("help_requests", "resolved_at=is.null&select=student_id,created_at")
  ]);
  const owner = {};
  items.forEach(s2 => { owner[s2.id] = s2.student_id; });
  const counts = await API.get("diag_items", "select=session_id");
  const answered = {};
  counts.forEach(c => {
    const sid = owner[c.session_id];
    if (sid) answered[sid] = (answered[sid] || 0) + 1;
  });
  const asked = {};
  help.forEach(h => asked[h.student_id] = (asked[h.student_id] || 0) + 1);
  return { groups, lessons, students, answered, asked };
}

async function toggleWindow(group, lesson) {
  if (lesson && lesson.is_open) {
    await API.patch("lessons", "id=eq." + lesson.id,
      { is_open: false, ended_at: new Date().toISOString() });
  } else if (lesson) {
    await API.patch("lessons", "id=eq." + lesson.id,
      { is_open: true, started_at: new Date().toISOString(), ended_at: null });
  } else {
    await API.post("lessons", [{ group_id: group.id, on_date: today(), is_open: true }]);
  }
  render();
}

function leftMinutes(lesson) {
  const end = new Date(lesson.started_at).getTime() + WINDOW_HOURS * 3600 * 1000;
  return Math.max(0, Math.round((end - Date.now()) / 60000));
}

async function render() {
  let data;
  try { await closeStale(); data = await loadBoard(); }
  catch (e) { show(el("div", "card", "Нет связи с базой. " + e.message)); return; }

  const wrap = el("div", "board");
  const top = el("div", "topbar");
  top.appendChild(el("div", "who", "matemica — " + T2.user.full_name));
  const out = el("button", "ghost", "Выйти");
  out.onclick = () => { STORE.clear(); location.href = "index.html"; };
  top.appendChild(out);
  wrap.appendChild(top);

  data.groups.forEach(g => {
    const lesson = data.lessons.find(l => l.group_id === g.id);
    const open = !!(lesson && lesson.is_open);
    const card = el("div", "card group" + (open ? " open" : ""));
    const head = el("div", "ghead");
    head.appendChild(el("h2", null, "Группа " + g.name));
    const btn = el("button", open ? "danger" : "primary",
      open ? "Закончить диагностику" : "Начать диагностику");
    btn.onclick = () => { btn.disabled = true; toggleWindow(g, lesson); };
    head.appendChild(btn);
    card.appendChild(head);
    card.appendChild(el("div", "hint", open
      ? "Окно открыто, ответы помечаются «при учителе». Закроется само через " +
        leftMinutes(lesson) + " мин."
      : "Окно закрыто. Ответы будут помечены «дома»."));

    const list = el("div", "students");
    data.students.filter(s => s.group_id === g.id)
      .sort((a, b) => a.full_name.localeCompare(b.full_name, "ru"))
      .forEach(s => {
        const n = data.answered[s.id] || 0;
        const row = el("div", "srow" + (data.asked[s.id] ? " asked" : ""));
        row.appendChild(el("span", "sname", s.full_name));
        row.appendChild(el("span", "scount", n ? n + " отв." : "не начал"));
        if (data.asked[s.id]) row.appendChild(el("span", "flag", "спрашивает"));
        list.appendChild(row);
      });
    card.appendChild(list);
    wrap.appendChild(card);
  });
  show(wrap);
}

function loginScreen(msg) {
  const box = el("div", "card login");
  box.appendChild(el("h1", null, "matemica"));
  const l = el("input"); l.placeholder = "Логин"; l.autocapitalize = "off";
  const p = el("input"); p.type = "password"; p.placeholder = "Пароль";
  const b = el("button", "primary", "Войти");
  const err = el("div", "err", msg || "");
  b.onclick = async () => {
    b.disabled = true;
    try {
      const r = await signIn(l.value, p.value);
      if (r.error || (r.user.role !== "owner" && r.user.role !== "teacher")) {
        err.textContent = "Не подходит"; b.disabled = false; return;
      }
      STORE.save(r.user); T2.user = r.user; start();
    } catch { err.textContent = "Нет связи"; b.disabled = false; }
  };
  p.onkeydown = e => { if (e.key === "Enter") b.click(); };
  [l, p, b, err].forEach(x => box.appendChild(x));
  show(box);
}

function start() {
  render();
  if (T2.timer) clearInterval(T2.timer);
  T2.timer = setInterval(render, 20000);
}

window.addEventListener("DOMContentLoaded", () => {
  const saved = STORE.load();
  if (saved && (saved.role === "owner" || saved.role === "teacher")) { T2.user = saved; start(); }
  else loginScreen();
});
