import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { Card, Primary, Quiet, Tech } from "../components/Ui";
import { parsePlan, type PlanFile, type Preview } from "../lib/plan";
import type { User } from "../lib/types";

interface Row { student_id: number; on_date: string; status: string }

export function Plan() {
  const [logins, setLogins] = useState<Map<string, number>>(new Map());
  const [preview, setPreview] = useState<Preview | null>(null);
  const [file, setFile] = useState<PlanFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [names, setNames] = useState<Map<number, string>>(new Map());
  const [day, setDay] = useState<string>("");
  const input = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const people = await api.all<User>("users", "role=eq.student&select=id,full_name,login,is_active");
      setLogins(new Map(people.filter(r => r.is_active).map(r => [String(r.login), r.id])));
      setNames(new Map(people.map(r => [r.id, r.full_name])));
      const items = await api.all<Row>("plan_items",
        "status=neq.cancelled&select=student_id,on_date,status&order=on_date.asc");
      setRows(items);
      const days = [...new Set(items.map(i => i.on_date))].sort();
      const todayStr = new Date().toISOString().slice(0, 10);
      setDay(days.find(d => d >= todayStr) ?? days[days.length - 1] ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function choose(f: File) {
    setDone(null);
    setError(null);
    try {
      const parsed = parsePlan(JSON.parse(await f.text()), new Set(logins.keys()));
      setPreview(parsed);
      setFile(parsed.file ?? null);
    } catch {
      setError("Файл не читается. Это точно тот, что я прислал?");
      setPreview(null);
    }
  }

  async function write() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      // 1. новые задачи
      const idByKey = new Map<string, number>();
      for (const t of file.задачи) {
        const made = await api.post<{ id: number }>("tasks", [{
          topic_ord: t.topic_ord, level: t.level, answer_type: t.answer_type,
          stem_ru: t.stem_ru, stem_kk: t.stem_kk ?? null,
          answer_num: t.answer_num ?? null, target_seconds: t.target_seconds ?? 90,
          source: "manual"
        }]);
        const id = made[0]?.id;
        if (id === undefined) throw new Error(`не записалась задача ${t.ключ}`);
        idByKey.set(t.ключ, id);
        if (t.answer_type === "choice" && t.варианты?.length) {
          await api.post("options", t.варианты.map((o, i) => ({
            task_id: id, pos: i + 1, body: o.body,
            is_correct: o.is_correct, error_code: o.is_correct ? null : o.error_code
          })));
        }
      }

      // 2. старый план на те же дни убираем, чтобы не задвоился
      const days = preview?.дни ?? [];
      for (const day of days) {
        await api.patch("plan_items", `on_date=eq.${day}&status=eq.pending`,
          { status: "cancelled" });
      }

      // 3. новый план
      let written = 0;
      for (const p of file.план) {
        const sid = logins.get(String(p.login));
        if (sid === undefined) continue;
        const rows: unknown[] = [];
        for (const d of p.дни) {
          d.задачи.forEach((ref, i) => {
            const taskId = typeof ref === "number" ? ref : idByKey.get(ref);
            if (taskId === undefined) return;
            rows.push({ student_id: sid, on_date: d.дата, pos: i + 1,
                        task_id: taskId, status: "pending", assigned_by: "ai" });
          });
        }
        if (rows.length) {
          await api.post("plan_items", rows);
          written += rows.length;
        }
      }
      setDone(`Записано: ${file.задачи.length} задач и ${written} назначений.`);
      await load();
      setPreview(null);
      setFile(null);
      if (input.current) input.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
    setBusy(false);
  }

  const days = [...new Set(rows.map(r => r.on_date))].sort();
  const shown = rows.filter(r => r.on_date === day);
  const byStudent = new Map<number, { всего: number; сделано: number }>();
  for (const r of shown) {
    const cur = byStudent.get(r.student_id) ?? { всего: 0, сделано: 0 };
    cur.всего++;
    if (r.status === "done") cur.сделано++;
    byStudent.set(r.student_id, cur);
  }

  return (
    <>
    <Card>
      <h3 className="text-lg">Загрузить план на неделю</h3>
      <p className="mt-1 text-sm text-muted">
        Файл, который приходит после разбора выгрузки. Перед записью покажу, что в нём.
      </p>

      <input
        ref={input} type="file" accept="application/json,.json"
        onChange={e => { const f = e.target.files?.[0]; if (f) void choose(f); }}
        className="mt-5 block w-full text-sm file:mr-4 file:rounded-xl file:border-0
                   file:bg-teal file:px-5 file:py-3 file:text-white"
      />

      {error && <Tech>{error}</Tech>}
      {done && <p className="mt-4 rounded-xl bg-teal-light px-4 py-3 text-teal">{done}</p>}

      {preview && (
        <div className="mt-5 rounded-2xl bg-paper p-5">
          <p className="text-[15px]">
            Неделя с {preview.неделя}. Дней: {preview.дни.length}.
            Новых задач: {preview.новыхЗадач}. Учеников: {preview.учеников}.
            Всего назначений: {preview.назначений}.
          </p>
          {preview.неизвестныеЛогины.length > 0 && (
            <p className="mt-2 text-sm text-amber">
              Не нашёл в базе: {preview.неизвестныеЛогины.join(", ")} — их пропущу.
            </p>
          )}
          {preview.problems.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm text-red">
              {preview.problems.slice(0, 8).map(p => <li key={p}>— {p}</li>)}
            </ul>
          )}
          <div className="mt-4 flex items-center gap-3">
            <div className="w-56">
              <Primary disabled={!preview.ok || busy} onClick={() => void write()}>
                {busy ? "Записываю…" : "Записать в базу"}
              </Primary>
            </div>
            <Quiet onClick={() => { setPreview(null); setFile(null); }}>Отмена</Quiet>
          </div>
          {!preview.ok && (
            <p className="mt-3 text-sm text-muted">
              Пока есть замечания, записать нельзя. Пришли мне этот текст — поправлю файл.
            </p>
          )}
        </div>
      )}
    </Card>

    <Card className="mt-4">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="flex-1 text-lg">Что назначено</h3>
        {days.map(d => (
          <button key={d} type="button" onClick={() => setDay(d)}
            className={`rounded-xl px-3 py-2 text-sm transition
              ${d === day ? "bg-teal text-white" : "bg-paper text-muted hover:text-teal"}`}>
            {d.slice(8)}.{d.slice(5, 7)}
          </button>
        ))}
      </div>

      {!days.length && <p className="mt-3 text-muted">Плана пока нет.</p>}

      {days.length > 0 && (
        <>
          <p className="mt-3 text-sm text-muted">
            {byStudent.size} учеников, {shown.length} задач на этот день
          </p>
          <div className="mt-3 grid gap-x-8 sm:grid-cols-2">
            {[...byStudent.entries()]
              .sort((a, b) => (names.get(a[0]) ?? "").localeCompare(names.get(b[0]) ?? "", "ru"))
              .map(([id, c]) => (
                <div key={id} className="flex justify-between gap-3 border-b border-paper py-2.5 text-[15px]">
                  <span className="truncate">{names.get(id) ?? id}</span>
                  <span className="whitespace-nowrap text-sm text-muted">
                    {c.сделано} из {c.всего}
                  </span>
                </div>
              ))}
          </div>
        </>
      )}
    </Card>
    </>
  );
}
