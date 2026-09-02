import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import { Card, Primary, Quiet, Tech } from "../components/Ui";
import type { Group, Item, Lesson, Session, User } from "../lib/types";

const WINDOW_HOURS = 2;
const today = () => new Date().toISOString().slice(0, 10);

interface Board {
  groups: Group[]; lessons: Lesson[]; students: User[];
  answered: Map<number, number>; asked: Set<number>;
}

export function Teacher({ user, onExit }: { user: User; onExit: () => void }) {
  const [board, setBoard] = useState<Board | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const stale = await api.get<Lesson>("lessons", "is_open=is.true&select=id,started_at");
      const limit = Date.now() - WINDOW_HOURS * 3600_000;
      for (const l of stale) {
        if (new Date(l.started_at).getTime() < limit) {
          await api.patch("lessons", `id=eq.${l.id}`,
            { is_open: false, ended_at: new Date().toISOString() });
        }
      }
      const [groups, lessons, students, sessions, rows, help] = await Promise.all([
        api.all<Group>("groups", "is_active=is.true&select=id,name&order=name.asc"),
        api.all<Lesson>("lessons", `on_date=eq.${today()}&select=*`),
        api.all<User>("users", "role=eq.student&is_active=is.true&select=*"),
        api.all<Session>("diag_sessions", "select=id,student_id"),
        api.all<Pick<Item, "session_id">>("diag_items", "select=session_id"),
        api.all<{ student_id: number }>("help_requests", "resolved_at=is.null&select=student_id")
      ]);
      const owner = new Map(sessions.map(s => [s.id, s.student_id]));
      const answered = new Map<number, number>();
      for (const r of rows) {
        const sid = owner.get(r.session_id);
        if (sid !== undefined) answered.set(sid, (answered.get(sid) ?? 0) + 1);
      }
      setBoard({ groups, lessons, students, answered, asked: new Set(help.map(h => h.student_id)) });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  useEffect(() => {
    void load();
    const id = setInterval(() => void load(), 20_000);
    return () => clearInterval(id);
  }, [load]);

  async function toggle(group: Group, lesson: Lesson | undefined) {
    setSaving(true);
    try {
      if (lesson && lesson.is_open) {
        await api.patch("lessons", `id=eq.${lesson.id}`,
          { is_open: false, ended_at: new Date().toISOString() });
      } else if (lesson) {
        await api.patch("lessons", `id=eq.${lesson.id}`,
          { is_open: true, started_at: new Date().toISOString(), ended_at: null });
      } else {
        await api.post("lessons", [{ group_id: group.id, on_date: today(), is_open: true }]);
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
    setSaving(false);
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex-1 text-sm text-muted">matemica — {user.full_name}</span>
        <Export onError={setError} />
        <Quiet onClick={onExit}>Выйти</Quiet>
      </div>

      {error && <Card className="mb-4"><p>Не вышло.</p><Tech>{error}</Tech></Card>}
      {!board && !error && <Card><p className="text-muted">Секунду…</p></Card>}

      {board?.groups.map(g => {
        const lesson = board.lessons.find(l => l.group_id === g.id);
        const open = lesson?.is_open === true;
        const left = lesson
          ? Math.max(0, Math.round(
              (new Date(lesson.started_at).getTime() + WINDOW_HOURS * 3600_000 - Date.now()) / 60_000))
          : 0;
        const list = board.students
          .filter(s => s.group_id === g.id)
          .sort((a, b) => a.full_name.localeCompare(b.full_name, "ru"));
        return (
          <Card key={g.id} className={`mb-4 ${open ? "border-teal border-2" : ""}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl">Группа {g.name}</h2>
              <div className="w-56">
                <Primary disabled={saving} onClick={() => void toggle(g, lesson)}>
                  {open ? "Закончить диагностику" : "Начать диагностику"}
                </Primary>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted">
              {open
                ? `Окно открыто, ответы помечаются «при учителе». Закроется само через ${left} мин.`
                : "Окно закрыто. Ответы будут помечены «дома»."}
            </p>
            <div className="mt-4 grid gap-x-8 sm:grid-cols-2">
              {list.map(s => {
                const n = board.answered.get(s.id) ?? 0;
                return (
                  <div key={s.id}
                    className={`flex justify-between gap-3 border-b border-line/60 py-2 text-[15px]
                                ${board.asked.has(s.id) ? "bg-[#FFF6E6]" : ""}`}>
                    <span className="truncate">{s.full_name}</span>
                    <span className="whitespace-nowrap text-sm text-muted">
                      {board.asked.has(s.id) && <span className="mr-2 text-amber">спрашивает</span>}
                      {n ? `${n} отв.` : "не начал"}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function Export({ onError }: { onError: (m: string) => void }) {
  const [label, setLabel] = useState("Выгрузить для разбора");
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setLabel("Собираю…");
    try {
      const [groups, students, topics, deps, tasks, sessions, items, help] = await Promise.all([
        api.all("groups", "select=*"),
        api.all("users", "role=eq.student&select=id,full_name,login,group_id,lang,note,is_active"),
        api.all("topics", "select=*"),
        api.all("topic_deps", "select=*"),
        api.all("tasks", "select=id,topic_ord,level,answer_type,answer_num,target_seconds,stem_ru"),
        api.all("diag_sessions", "select=*"),
        api.all<Item>("diag_items", "select=*"),
        api.all("help_requests", "select=*")
      ]);
      const data = {
        выгружено: new Date().toISOString(),
        группы: groups, ученики: students, темы: topics, зависимости: deps,
        задачи: tasks, заходы: sessions, ответы: items, нажатия_спросить: help,
        сводка: {
          учеников: students.length, заходов: sessions.length, ответов: items.length,
          при_учителе: items.filter(i => i.supervised === true).length
        }
      };
      const url = URL.createObjectURL(
        new Blob([JSON.stringify(data, null, 1)], { type: "application/json" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `matemica_${today()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setLabel(`Готово: ${items.length} ответов`);
      setTimeout(() => setLabel("Выгрузить для разбора"), 4000);
    } catch (err) {
      onError(err instanceof Error ? err.message : String(err));
      setLabel("Выгрузить для разбора");
    }
    setBusy(false);
  }

  return <Quiet onClick={() => { if (!busy) void run(); }}>{label}</Quiet>;
}
