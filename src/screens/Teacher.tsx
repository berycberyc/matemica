import { useState } from "react";
import { Card, Quiet, Tech } from "../components/Ui";
import { api } from "../lib/api";
import { day } from "../lib/day";
import { Lesson } from "./Lesson";
import { Notes } from "./Notes";
import { Plan } from "./Plan";
import { Students } from "./Students";
import type { Item, User } from "../lib/types";

type TabName = "lesson" | "notes" | "plan" | "people";


export function Teacher({ user, onExit }: { user: User; onExit: () => void }) {
  const [tab, setTab] = useState<TabName>("lesson");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-4xl px-5 py-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex-1 text-sm text-muted">matemica — {user.full_name}</span>
        <Export onError={setError} />
        <Quiet onClick={onExit}>Выйти</Quiet>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <Tab now={tab} me="lesson" set={setTab}>Урок</Tab>
        <Tab now={tab} me="notes" set={setTab}>Заключения</Tab>
        <Tab now={tab} me="plan" set={setTab}>План</Tab>
        <Tab now={tab} me="people" set={setTab}>Ученики</Tab>
      </div>

      {error && <Card className="mb-4"><p>Не вышло.</p><Tech>{error}</Tech></Card>}

      {tab === "lesson" && <Lesson />}
      {tab === "notes" && <Notes />}
      {tab === "plan" && <Plan />}
      {tab === "people" && <Students />}
    </div>
  );
}

function Tab(
  { now, me, set, children }:
  { now: TabName; me: TabName; set: (v: TabName) => void; children: string }
) {
  const on = now === me;
  return (
    <button type="button" onClick={() => set(me)}
      className={`rounded-xl px-4 py-2 text-[15px] transition
        ${on ? "bg-teal text-white" : "bg-white text-muted hover:text-teal"}`}>
      {children}
    </button>
  );
}

function Export({ onError }: { onError: (m: string) => void }) {
  const [label, setLabel] = useState("Выгрузить для разбора");
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setLabel("Собираю…");
    try {
      const [groups, students, topics, deps, tasks, sessions, items, help, states] =
        await Promise.all([
        api.all("groups", "select=*"),
        api.all("users", "role=eq.student&select=id,full_name,login,group_id,lang,note,is_active"),
        api.all("topics", "select=*"),
        api.all("topic_deps", "select=*"),
        api.all("tasks", "select=id,topic_ord,level,answer_type,answer_num,target_seconds,stem_ru"),
        api.all("diag_sessions", "select=*"),
        api.all<Item>("diag_items", "select=*"),
        api.all("help_requests", "select=*"),
        api.all("topic_status", "select=*")
      ]);
      const data = {
        выгружено: new Date().toISOString(),
        группы: groups, ученики: students, темы: topics, зависимости: deps,
        задачи: tasks, заходы: sessions, ответы: items, нажатия_спросить: help,
        состояния_тем: states,
        сводка: {
          учеников: students.length, заходов: sessions.length, ответов: items.length,
          при_учителе: items.filter(i => i.supervised === true).length,
          состояний: states.length
        }
      };
      const url = URL.createObjectURL(
        new Blob([JSON.stringify(data, null, 1)], { type: "application/json" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `matemica_${day()}.json`;
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

type Tab = "today" | "people" | "plan";
