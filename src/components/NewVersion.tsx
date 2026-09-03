import { useEffect, useState } from "react";

// Браузер держит старые файлы у себя и не всегда замечает, что вышла новая версия.
// Поэтому спрашиваем сами и предлагаем обновиться — без Ctrl+Shift+R.
export function NewVersion() {
  const [есть, setЕсть] = useState(false);

  useEffect(() => {
    let жив = true;
    const проверить = async () => {
      try {
        const r = await fetch("/version.json?" + Date.now(), { cache: "no-store" });
        const v = (await r.json()) as { build?: string };
        if (жив && v.build && v.build !== __BUILD__) setЕсть(true);
      } catch { /* нет связи — не беда */ }
    };
    void проверить();
    const id = setInterval(проверить, 5 * 60_000);
    return () => { жив = false; clearInterval(id); };
  }, []);

  if (!есть) return null;
  return (
    <div className="sticky top-0 z-10 mb-3 flex items-center gap-3 rounded-2xl
                    bg-teal px-5 py-3 text-white">
      <span className="flex-1 text-[15px]">Вышла новая версия</span>
      <button type="button" onClick={() => location.reload()}
        className="rounded-xl bg-white px-4 py-2 text-sm text-teal">Обновить</button>
    </div>
  );
}
