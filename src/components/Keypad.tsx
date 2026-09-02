// Своя клавиатура. Системную не зовём: на телефоне ребёнка казахская раскладка,
// минуса в цифровом режиме часто нет, а автозамена портит ввод.
const KEYS = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "−", "0", ",", "/", "⌫"];

export function Keypad({ onKey }: { onKey: (k: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {KEYS.map(k => (
        <button
          key={k}
          type="button"
          onClick={() => onKey(k)}
          className={
            "rounded-xl border border-line bg-white py-4 text-2xl text-ink " +
            "active:bg-teal-light active:border-teal transition-colors " +
            (k === "⌫" ? "col-span-3 text-xl" : "")
          }
        >{k}</button>
      ))}
    </div>
  );
}
