// Очередь ответов. Если связь моргнула, ответ ложится на телефон и уходит сам,
// когда связь вернулась. Ребёнок продолжает решать и ничего не замечает.
import { api } from "./api";

interface Letter { id: string; table: string; row: unknown }

const KEY = "matemica_outbox";

function read(): Letter[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]") as Letter[]; }
  catch { return []; }
}
function write(list: Letter[]): void {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* переполнено */ }
}

export function pending(): number {
  return read().length;
}

export function put(table: string, row: unknown): void {
  const list = read();
  list.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, table, row });
  write(list);
}

let flushing = false;

// Отправляем по одному и по порядку: важно, чтобы ответы легли в том же порядке,
// в каком ребёнок отвечал.
export async function flush(): Promise<number> {
  if (flushing) return read().length;
  flushing = true;
  try {
    let list = read();
    while (list.length) {
      const letter = list[0];
      if (!letter) break;
      try {
        await api.post(letter.table, [letter.row]);
      } catch {
        break;                      // связи всё ещё нет — оставляем очередь как есть
      }
      list = read().filter(x => x.id !== letter.id);
      write(list);
    }
    return list.length;
  } finally {
    flushing = false;
  }
}

// Пробуем отправить: сразу, и потом сами, пока не уйдёт.
export function keepTrying(onChange: (left: number) => void): () => void {
  const tick = () => void flush().then(onChange);
  tick();
  const id = setInterval(tick, 15_000);
  window.addEventListener("online", tick);
  return () => {
    clearInterval(id);
    window.removeEventListener("online", tick);
  };
}
