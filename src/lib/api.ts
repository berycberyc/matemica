import { SUPABASE_KEY, SUPABASE_URL } from "./config";

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers ?? {})
    }
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${text.slice(0, 300)}`);
  return (text ? JSON.parse(text) : []) as T;
}

export const api = {
  get<T>(table: string, query = ""): Promise<T[]> {
    return call<T[]>(table + (query ? `?${query}` : ""));
  },
  // Supabase отдаёт максимум 1000 строк за раз — тянем частями
  async all<T>(table: string, query = ""): Promise<T[]> {
    const step = 1000;
    let from = 0;
    let out: T[] = [];
    for (;;) {
      const part = await call<T[]>(`${table}?${query ? query + "&" : ""}limit=${step}&offset=${from}`);
      out = out.concat(part);
      if (part.length < step) return out;
      from += step;
    }
  },
  post<T>(table: string, rows: unknown[]): Promise<T[]> {
    return call<T[]>(table, { method: "POST", body: JSON.stringify(rows) });
  },
  patch<T>(table: string, query: string, body: unknown): Promise<T[]> {
    return call<T[]>(`${table}?${query}`, { method: "PATCH", body: JSON.stringify(body) });
  },
  // Запись «поверх»: если строка на эту пару уже есть — обновляется.
  upsert<T>(table: string, onConflict: string, rows: unknown[]): Promise<T[]> {
    return call<T[]>(`${table}?on_conflict=${onConflict}`, {
      method: "POST",
      body: JSON.stringify(rows),
      headers: { Prefer: "resolution=merge-duplicates,return=representation" }
    });
  },
  del(table: string, query: string): Promise<unknown[]> {
    return call<unknown[]>(`${table}?${query}`, { method: "DELETE" });
  }
};
