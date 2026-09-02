// День считаем по местному времени, а не по всемирному.
// Иначе после семи вечера сайт уже живёт завтрашним днём, а до пяти утра — вчерашним.
export function day(shift = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + shift);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
