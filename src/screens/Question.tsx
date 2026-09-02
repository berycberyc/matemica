import { useState } from "react";
import { Card, Primary, Quiet } from "../components/Ui";
import { Keypad } from "../components/Keypad";
import { dict } from "../lib/i18n";
import type { Lang, Task } from "../lib/types";

export function Question(
  { task, lang, number, left, onAnswer, onAsk }:
  { task: Task; lang: Lang; number: number; left?: number;
    onAnswer: (given: string) => void; onAsk: () => void }
) {
  const t = dict(lang);
  const [value, setValue] = useState("");
  const [sent, setSent] = useState(false);
  const [asked, setAsked] = useState(false);
  const stem = lang === "kk" && task.stem_kk ? task.stem_kk : task.stem_ru;

  function send(given: string) {
    if (sent) return;
    setSent(true);
    onAnswer(given);
  }

  return (
    <Card className="p-7">
      <p className="text-[13px] uppercase tracking-[.14em] text-muted/70">
        {t.question} {number}{left !== undefined ? ` · ${t.left} ${left}` : ""}
      </p>
      <p className="mt-3 font-read text-[21px] leading-[1.55]">{stem}</p>

      {task.answer_type === "choice" ? (
        <div className="mt-5 space-y-2">
          {task.options.map(o => (
            <button key={o.id} type="button" disabled={sent} onClick={() => send(o.body)}
              className="w-full rounded-2xl bg-paper py-4 font-read text-[22px]
                         transition active:scale-[.99] active:bg-teal-light disabled:opacity-40">
              {o.body}
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <div className="mb-4 min-h-[62px] rounded-2xl bg-paper px-5 py-4
                          font-read text-[26px] tracking-wide break-all">
            {value || <span className="text-base text-line">{t.typeAnswer}</span>}
          </div>
          <Keypad onKey={k => {
            if (k === "⌫") setValue(v => v.slice(0, -1));
            else setValue(v => (v.length < 12 ? v + k : v));
          }} />
          <div className="mt-3">
            <Primary disabled={!value || sent} onClick={() => send(value)}>{t.answer}</Primary>
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-2">
        <Quiet onClick={() => send("?")}>{t.dontKnow}</Quiet>
        <Quiet onClick={() => { setAsked(true); onAsk(); }}>{asked ? t.asked : t.ask}</Quiet>
      </div>
    </Card>
  );
}
