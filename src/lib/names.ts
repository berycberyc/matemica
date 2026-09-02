// На уроке нужно узнавать человека, а не читать строку.
// Показываем имя. Если имя совпало у двоих — добавляем первую букву фамилии.

export function shortNames(people: { id: number; full_name: string }[]): Map<number, string> {
  const parts = new Map<number, { first: string; last: string }>();
  for (const p of people) {
    const words = p.full_name.trim().split(/\s+/);
    const last = words[0] ?? "";
    const first = words.slice(1).join(" ") || last;
    parts.set(p.id, { first, last });
  }
  const count = new Map<string, number>();
  for (const v of parts.values()) count.set(v.first, (count.get(v.first) ?? 0) + 1);

  const out = new Map<number, string>();
  for (const [id, v] of parts) {
    const many = (count.get(v.first) ?? 0) > 1;
    out.set(id, many && v.last ? `${v.first} ${v.last[0]}.` : v.first);
  }
  return out;
}
