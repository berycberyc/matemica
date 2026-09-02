// Связь с базой, вход, переводы. Ничего про экраны здесь нет.

const API = {
  async call(path, opts = {}) {
    const r = await fetch(CFG.url + "/rest/v1/" + path, {
      ...opts,
      headers: {
        apikey: CFG.key,
        Authorization: "Bearer " + CFG.key,
        "Content-Type": "application/json",
        Prefer: opts.prefer || "return=representation",
        ...(opts.headers || {})
      }
    });
    const text = await r.text();
    if (!r.ok) throw new Error(r.status + " " + text);
    return text ? JSON.parse(text) : [];
  },
  get(t, q = "") { return API.call(t + (q ? "?" + q : "")); },
  post(t, rows) { return API.call(t, { method: "POST", body: JSON.stringify(rows) }); },
  patch(t, q, body) { return API.call(t + "?" + q, { method: "PATCH", body: JSON.stringify(body) }); }
};

const STORE = {
  save(u) { localStorage.setItem("mtm_user", JSON.stringify(u)); },
  load() { try { return JSON.parse(localStorage.getItem("mtm_user")); } catch { return null; } },
  clear() { localStorage.removeItem("mtm_user"); }
};

// Вход. Пробелы по краям срезаются: скопированный из сообщения код проходит.
async function signIn(login, pass) {
  const l = String(login).trim(), p = String(pass).trim();
  if (!l || !p) return { error: "empty" };
  const rows = await API.get("users",
    "login=eq." + encodeURIComponent(l) + "&is_active=is.true&select=*");
  if (!rows.length) return { error: "nouser" };
  if (String(rows[0].password).trim() !== p) return { error: "nopass" };
  return { user: rows[0] };
}

const TXT = {
  ru: {
    signin: "Вход", login: "Номер", pass: "Код", enter: "Войти",
    nouser: "Такого номера нет. Проверь цифры.",
    nopass: "Код не подходит. Проверь цифры.",
    empty: "Заполни оба поля.",
    offline: "Нет связи с интернетом. Ответы сохранены, попробуй ещё раз.",
    answer: "Ответить", dontknow: "Не знаю", next: "Дальше",
    question: "Вопрос", done: "Готово", ask: "Спросить у учителя",
    asked: "Учитель увидит",
    finished: "Диагностика пройдена. Спасибо — теперь я знаю, чем тебе помочь.",
    resume: "Продолжаем с того же места.",
    typeAnswer: "Введи ответ",
    exit: "Выйти", sure: "Точно выйти?", hi: "Здравствуй"
  },
  kk: {
    signin: "Кіру", login: "Нөмір", pass: "Код", enter: "Кіру",
    nouser: "Мұндай нөмір жоқ. Сандарды тексер.",
    nopass: "Код сәйкес келмейді. Сандарды тексер.",
    empty: "Екі жолды да толтыр.",
    offline: "Интернет байланысы жоқ. Жауаптар сақталды, қайта көр.",
    answer: "Жауап беру", dontknow: "Білмеймін", next: "Әрі қарай",
    question: "Сұрақ", done: "Дайын", ask: "Мұғалімнен сұрау",
    asked: "Мұғалім көреді",
    finished: "Диагностика аяқталды. Рақмет — енді саған қалай көмектесерімді білемін.",
    resume: "Сол жерден жалғастырамыз.",
    typeAnswer: "Жауабыңды жаз",
    exit: "Шығу", sure: "Шынымен шығасың ба?", hi: "Сәлем"
  }
};

let LANG = "ru";
function T(k) { return (TXT[LANG] && TXT[LANG][k]) || TXT.ru[k] || k; }
function setLang(l) { LANG = TXT[l] ? l : "ru"; }

function el(tag, cls, txt) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (txt !== undefined) e.textContent = txt;
  return e;
}
function show(node) {
  const root = document.getElementById("app");
  root.textContent = "";
  root.appendChild(node);
}
