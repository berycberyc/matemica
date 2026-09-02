import type { Lang } from "../lib/types";

const TEXT = {
  ru: {
    hi: "Здравствуй", start: "Начать", resume: "Продолжить",
    title: "Диагностика", solved: "решено задач", topics: "тем пройдено",
    firstTime: "Это не контрольная и оценок не будет. Отвечай как есть — где не знаешь, " +
               "так и скажи. Чем точнее ты покажешь, тем меньше времени мы потратим зря.",
    again: "Ты начинал раньше. Продолжим с того же вопроса.",
    doneAll: "Диагностика пройдена. Спасибо."
  },
  kk: {
    hi: "Сәлем", start: "Бастау", resume: "Жалғастыру",
    title: "Диагностика", solved: "есеп шығарылды", topics: "тақырып өтілді",
    firstTime: "Бұл бақылау жұмысы емес, баға қойылмайды. Шын жауап бер — білмесең, " +
               "солай деп айт. Неғұрлым дәл көрсетсең, соғұрлым уақытты бос жұмсамаймыз.",
    again: "Бұрын бастағансың. Сол сұрақтан жалғастырамыз.",
    doneAll: "Диагностика аяқталды. Рақмет."
  }
} as const;

export function Home(
  { name, lang, answered, topics, done, onStart }:
  { name: string; lang: Lang; answered: number; topics: number; done: boolean; onStart: () => void }
) {
  const t = TEXT[lang];
  const first = answered === 0;
  return (
    <div className="mx-auto max-w-xl px-4">
      <p className="text-sm text-muted">{t.hi},</p>
      <h1 className="mt-1 font-read text-[30px] leading-tight">{name.split(" ").slice(1).join(" ") || name}</h1>

      <div className="mt-7 rounded-[20px] bg-teal p-6 text-white">
        <p className="text-[13px] uppercase tracking-[.14em] text-white/60">{t.title}</p>
        <p className="mt-3 font-read text-[19px] leading-relaxed text-white/90">
          {done ? t.doneAll : first ? t.firstTime : t.again}
        </p>
        {!done && (
          <button type="button" onClick={onStart}
            className="mt-6 w-full rounded-2xl bg-white px-5 py-4 text-[17px] text-teal
                       transition active:scale-[.99]">
            {first ? t.start : t.resume}
          </button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Stat value={answered} label={t.solved} />
        <Stat value={topics} label={t.topics} />
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-[20px] bg-white p-5">
      <p className="font-read text-[30px] leading-none text-teal">{value}</p>
      <p className="mt-2 text-sm text-muted">{label}</p>
    </div>
  );
}

