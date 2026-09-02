// Своя клавиатура. Системную не зовём: на телефоне ребёнка казахская раскладка,
// минуса в цифровом режиме часто нет, а автозамена портит ввод.
const KEYS = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "−", "0", ",", "/", "⌫"];

export function Keypad({ onKey }: { onKey: (k: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {KEYS.map(k => (
        <button key={k} type="button" onClick={() => onKey(k)}
          className={"rounded-2xl bg-white py-5 font-read text-[26px] text-ink " +
            "shadow-[0_1px_2px_rgba(20,48,46,.08)] transition active:scale-95 " +
            "active:bg-teal-light " + (k === "⌫" ? "col-span-3 py-4 text-[20px]" : "")}>
          {k}
        </button>
      ))}
    </div>
  );
}
