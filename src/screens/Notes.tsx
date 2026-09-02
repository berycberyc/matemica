// Заключения по детям. Отдельно от урока: на уроке в экран смотрит не только преподаватель.
import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import { Card, Tech } from "../components/Ui";
import type { Group, User } from "../lib/types";

interface Note { id: number; student_id: number; week_start: string; body: string }

export function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [people, setPeople] = useState<Map<number, User>>(new Map());
  const [groups, setGroups] = useState<Map<number, string>>(new Map());
  const [week, setWeek] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [n, u, g] = await Promise.all([
        api.all<Note>("ai_notes", "select=*&order=week_start.desc"),
        api.all<User>("users", "role=eq.student&select=id,full_name,group_id"),
        api.all<Group>("groups", "select=id,name")
      ]);
      setNotes(n);
      setPeople(new Map(u.map(x => [x.id, x])));
      setGroups(new Map(g.map(x => [x.id, x.name])));
      setWeek(n[0]?.week_start ?? "");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  if (error) return <Card><p>Не вышло.</p><Tech>{error}</Tech></Card>;

  const weeks = [...new Set(notes.map(n => n.week_start))].sort().reverse();
  const shown = notes.filter(n => n.week_start === week);

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="flex-1 text-lg">Заключения</h3>
        {weeks.map(w => (
          <button key={w} type="button" onClick={() => setWeek(w)}
            className={`rounded-xl px-3 py-2 text-sm transition
              ${w === week ? "bg-teal text-white" : "bg-paper text-muted hover:text-teal"}`}>
            неделя с {w.slice(8)}.{w.slice(5, 7)}
          </button>
        ))}
      </div>

      {!notes.length && (
        <p className="mt-4 text-muted">
          Пока пусто. Заключения приходят вместе с планом на неделю.
        </p>
      )}

      <div className="mt-4 space-y-4">
        {shown
          .sort((a, b) => (people.get(a.student_id)?.full_name ?? "")
            .localeCompare(people.get(b.student_id)?.full_name ?? "", "ru"))
          .map(n => {
            const p = people.get(n.student_id);
            return (
              <div key={n.id} className="border-b border-paper pb-4 last:border-0">
                <p className="text-[15px]">
                  {p?.full_name ?? n.student_id}
                  <span className="ml-2 text-sm text-muted">
                    {groups.get(p?.group_id ?? -1) ?? ""}
                  </span>
                </p>
                <p className="mt-1 font-read text-[17px] leading-relaxed">{n.body}</p>
              </div>
            );
          })}
      </div>
    </Card>
  );
}
