import type { Lang, Topic } from "../lib/types";

const TEXT = {
  ru: {
    hi: "Здравствуй", start: "Начать", resume: "Продолжить",
    diag: "Диагностика", plan: "Задачи на сегодня", tasks: "задач",
    doneToday: "На сегодня всё", solvedToday: "сегодня решено",
    yesterday: "вчера", streak: "дней подряд", passed: "Пройденные темы",
    again: "Прорешать заново",
    firstTime: "Это не контрольная и оценок не будет. Отвечай как есть — где не знаешь, " +
               "так и скажи. Чем точнее ты покажешь, тем меньше времени мы потратим зря.",
    resumeText: "Ты начинал раньше. Продолжим с того же вопроса.",
    doneAll: "Диагностика пройдена. Спасибо."
  },
  kk: {
    hi: "Сәлем", start: "Бастау", resume: "Жалғастыру",
    diag: "Диагностика", plan: "Бүгінгі есептер", tasks: "есеп",
    doneToday: "Бүгінге бәрі бітті", solvedToday: "бүгін шығарылды",
    yesterday: "кеше", streak: "күн қатарынан", passed: "Өтілген тақырыптар",
    again: "Қайта шығару",
    firstTime: "Бұл бақылау жұмысы емес, баға қойылмайды. Шын жауап бер — білмесең, " +
               "солай деп айт. Неғұрлым дәл көрсетсең, соғұрлым уақытты бос жұмсамаймыз.",
    resumeText: "Бұрын бастағансың. Сол сұрақтан жалғастырамыз.",
    doneAll: "Диагностика аяқталды. Рақмет."
  }
} as const;

export interface HomeData {
  planLeft: number;
  planTopics: Topic[];
  solvedToday: number;
  solvedYesterday: number;
  streak: number;
  passed: Topic[];
  diagStarted: boolean;
  diagDone: boolean;
}

export function Home(
  { name, lang, data, onDiag, onPlan, onTopic }:
  { name: string; lang: Lang; data: HomeData;
    onDiag: () => void; onPlan: () => void; onTopic: (t: Topic) => void }
) {
  const t = TEXT[lang];
  const title = (x: Topic) => (lang === "kk" && x.title_kk ? x.title_kk : x.title_ru);
  const first = name.split(" ").slice(1).join(" ") || name;

  return (
    <div className="mx-auto max-w-xl px-4">
      <p className="text-sm text-muted">{t.hi},</p>
      <h1 className="mt-1 font-read text-[30px] leading-tight">{first}</h1>

      {data.planLeft > 0 && (
        <div className="mt-7 rounded-[20px] bg-teal p-6 text-white">
          <p className="text-[13px] uppercase tracking-[.14em] text-white/60">{t.plan}</p>
          <p className="mt-3 font-read text-[21px] leading-snug">
            {data.planTopics.map(title).join(" · ") || t.plan}
          </p>
          <p className="mt-1 text-[15px] text-white/70">{data.planLeft} {t.tasks}</p>
          <button type="button" onClick={onPlan}
            className="mt-5 w-full rounded-2xl bg-white px-5 py-4 text-[17px] text-teal
                       transition active:scale-[.99]">
            {t.start}
          </button>
        </div>
      )}

      {data.planLeft === 0 && data.solvedToday > 0 && (
        <div className="mt-7 rounded-[20px] bg-white p-6">
          <p className="font-read text-[21px] text-teal">{t.doneToday}</p>
        </div>
      )}

      {!data.diagDone && (
        <div className={`rounded-[20px] p-6 ${data.planLeft > 0 ? "mt-4 bg-white" : "mt-7 bg-teal text-white"}`}>
          <p className={`text-[13px] uppercase tracking-[.14em]
                        ${data.planLeft > 0 ? "text-muted/70" : "text-white/60"}`}>{t.diag}</p>
          <p className={`mt-3 font-read text-[19px] leading-relaxed
                        ${data.planLeft > 0 ? "" : "text-white/90"}`}>
            {data.diagStarted ? t.resumeText : t.firstTime}
          </p>
          <button type="button" onClick={onDiag}
            className={`mt-5 w-full rounded-2xl px-5 py-4 text-[17px] transition active:scale-[.99]
              ${data.planLeft > 0 ? "bg-teal text-white" : "bg-white text-teal"}`}>
            {data.diagStarted ? t.resume : t.start}
          </button>
        </div>
      )}

      {(data.solvedToday > 0 || data.streak > 0) && (
        <p className="mt-6 text-[15px] text-muted">
          {t.solvedToday}: {data.solvedToday}
          {data.solvedYesterday > 0 ? ` · ${t.yesterday}: ${data.solvedYesterday}` : ""}
          {data.streak > 1 ? ` · ${data.streak} ${t.streak}` : ""}
        </p>
      )}

      {data.passed.length > 0 && (
        <div className="mt-6">
          <p className="text-[13px] uppercase tracking-[.14em] text-muted/70">{t.passed}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {data.passed.map(x => (
              <button key={x.ord} type="button" onClick={() => onTopic(x)}
                className="rounded-xl bg-white px-4 py-2.5 text-[15px] transition
                           active:scale-95 active:bg-teal-light">
                {title(x)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
