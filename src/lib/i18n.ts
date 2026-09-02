import type { Lang } from "./types";

const RU = {
  answer: "Ответить", dontKnow: "Не знаю", question: "Вопрос",
  ask: "Спросить у учителя", asked: "Учитель увидит",
  typeAnswer: "Введи ответ", exit: "Выйти", sure: "Точно выйти?",
  finished: "Диагностика пройдена. Спасибо — теперь я знаю, чем тебе помочь.",
  offline: "Нет связи. Ответ не потерян, попробуй ещё раз.", retry: "Ещё раз",
  loading: "Секунду…"
};

const KK: typeof RU = {
  answer: "Жауап беру", dontKnow: "Білмеймін", question: "Сұрақ",
  ask: "Мұғалімнен сұрау", asked: "Мұғалім көреді",
  typeAnswer: "Жауабыңды жаз", exit: "Шығу", sure: "Шынымен шығасың ба?",
  finished: "Диагностика аяқталды. Рақмет — енді саған қалай көмектесерімді білемін.",
  offline: "Байланыс жоқ. Жауап жоғалған жоқ, қайта көр.", retry: "Қайталау",
  loading: "Бір сәт…"
};

export type Dict = typeof RU;
export function dict(lang: Lang): Dict { return lang === "kk" ? KK : RU; }
