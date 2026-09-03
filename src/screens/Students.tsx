import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { Card, Primary, Quiet, Tech } from "../components/Ui";
import type { Group, Lang, User } from "../lib/types";

// Пароль цифровой: у ребёнка открывается цифровая клавиатура,
// раскладку переключать не надо, регистра нет.
function newCode(taken: Set<string>): string {
  for (let i = 0; i < 500; i++) {
    const c = String(1000 + Math.floor(Math.random() * 9000));
    if (!taken.has(c) && new Set(c).size > 1) return c;
  }
  return String(Date.now()).slice(-4);
}

interface Draft {
  full_name: string; login: string; group_id: number | null; lang: Lang; note: string;
}

const EMPTY: Draft = { full_name: "", login: "", group_id: null, lang: "kk", note: "" };

export function Students() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [people, setPeople] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [shownCode, setShownCode] = useState<{ id: number; code: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const [g, u] = await Promise.all([
        api.all<Group>("groups", "select=id,name&order=name.asc"),
        api.all<User>("users", "role=eq.student&select=*")
      ]);
      setGroups(g);
      setPeople(u.sort((a, b) => a.full_name.localeCompare(b.full_name, "ru")));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const taken = useMemo(() => new Set(people.map(p => String(p.password))), [people]);
  const logins = useMemo(() => new Set(people.map(p => String(p.login))), [people]);

  const shown = people.filter(p =>
    !search.trim() ||
    p.full_name.toLowerCase().includes(search.toLowerCase()) ||
    String(p.login).includes(search.trim()));

  async function create(d: Draft) {
    const code = newCode(taken);
    await api.post("users", [{
      role: "student", full_name: d.full_name.trim(), login: d.login.trim(),
      password: code, lang: d.lang, group_id: d.group_id, grade: 6,
      note: d.note.trim() || null
    }]);
    setAdding(false);
    await load();
    alert(`${d.full_name}\nвход ${d.login}\nкод ${code}`);
  }

  async function save(u: User, d: Draft, active: boolean) {
    await api.patch("users", `id=eq.${u.id}`, {
      full_name: d.full_name.trim(), group_id: d.group_id, lang: d.lang,
      note: d.note.trim() || null, is_active: active
    });
    setEditing(null);
    await load();
  }

  async function moveTo(u: User, groupId: number) {
    await api.patch("users", `id=eq.${u.id}`, { group_id: groupId });
    await load();
  }

  async function resetCode(u: User) {
    const code = newCode(taken);
    await api.patch("users", `id=eq.${u.id}`, { password: code });
    setShownCode({ id: u.id, code });
    await load();
  }

  return (
    <div>
      {error && <Card className="mb-4"><p>Не вышло.</p><Tech>{error}</Tech></Card>}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Имя или номер"
          className="flex-1 rounded-xl bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-teal"
        />
        <div className="w-52">
          <Primary onClick={() => { setAdding(true); setEditing(null); }}>Добавить ученика</Primary>
        </div>
      </div>

      {adding && (
        <Card className="mb-4">
          <h3 className="mb-4 text-lg">Новый ученик</h3>
          <Form
            draft={EMPTY} groups={groups} withLogin
            loginTaken={logins}
            onCancel={() => setAdding(false)}
            onSave={d => void create(d)}
          />
        </Card>
      )}

      <Card>
        <p className="mb-3 text-sm text-muted">{shown.length} из {people.length}</p>
        {shown.map(p => (
          <div key={p.id} className="border-b border-paper py-3 last:border-0">
            {editing?.id === p.id ? (
              <Form
                draft={{
                  full_name: p.full_name, login: String(p.login), group_id: p.group_id,
                  lang: p.lang, note: p.note ?? ""
                }}
                groups={groups} active={p.is_active} code={String(p.password)}
                onCancel={() => setEditing(null)}
                onSave={(d, active) => void save(p, d, active ?? true)}
                onResetCode={() => void resetCode(p)}
              />
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <span className={`flex-1 ${p.is_active ? "" : "text-muted line-through"}`}>
                  {p.full_name}
                </span>
                <select
                  value={p.group_id ?? ""}
                  onChange={e => void moveTo(p, Number(e.target.value))}
                  className="rounded-lg bg-paper px-2 py-1.5 text-sm outline-none
                             focus:ring-2 focus:ring-teal">
                  {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
                <span className="text-sm text-muted">
                  {p.lang === "kk" ? "каз" : "рус"} · {p.login}
                </span>
                {shownCode?.id === p.id && (
                  <span className="rounded-lg bg-teal-light px-2 py-1 font-mono text-teal">
                    новый код {shownCode.code}
                  </span>
                )}
                <Quiet onClick={() => { setEditing(p); setAdding(false); }}>Изменить</Quiet>
              </div>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}

function Form(
  { draft, groups, withLogin = false, active, code, loginTaken, onSave, onCancel, onResetCode }:
  {
    draft: Draft; groups: Group[]; withLogin?: boolean; active?: boolean;
    code?: string; loginTaken?: Set<string>;
    onSave: (d: Draft, active?: boolean) => void;
    onCancel: () => void;
    onResetCode?: () => void;
  }
) {
  const [d, setD] = useState<Draft>(draft);
  const [on, setOn] = useState(active ?? true);
  const [problem, setProblem] = useState<string | null>(null);

  function submit() {
    if (!d.full_name.trim()) { setProblem("Впиши фамилию и имя."); return; }
    if (withLogin) {
      if (!/^\d{4,8}$/.test(d.login.trim())) { setProblem("Номер — от четырёх до восьми цифр."); return; }
      if (loginTaken?.has(d.login.trim())) { setProblem("Такой номер уже занят."); return; }
    }
    if (d.group_id === null) { setProblem("Выбери группу."); return; }
    setProblem(null);
    onSave(d, on);
  }

  const field = "w-full rounded-xl bg-paper px-4 py-3 outline-none focus:ring-2 focus:ring-teal";

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <input className={field} placeholder="Фамилия и имя" value={d.full_name}
        onChange={e => setD({ ...d, full_name: e.target.value })} />

      {withLogin ? (
        <input className={field} placeholder="Номер для входа" inputMode="numeric" value={d.login}
          onChange={e => setD({ ...d, login: e.target.value })} />
      ) : (
        <div className="flex flex-wrap items-center gap-3 px-1 text-sm text-muted">
          <span>
            вход <b className="font-mono text-[16px] text-ink">{d.login}</b>
            {code && <> · код <b className="font-mono text-[16px] text-ink">{code}</b></>}
          </span>
          {onResetCode && <Quiet onClick={onResetCode}>Выдать новый код</Quiet>}
        </div>
      )}

      <select className={field} value={d.group_id ?? ""}
        onChange={e => setD({ ...d, group_id: e.target.value ? Number(e.target.value) : null })}>
        <option value="">Группа</option>
        {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
      </select>

      <select className={field} value={d.lang}
        onChange={e => setD({ ...d, lang: e.target.value === "kk" ? "kk" : "ru" })}>
        <option value="kk">Казахский</option>
        <option value="ru">Русский</option>
      </select>

      <input className={`${field} sm:col-span-2`} placeholder="Заметка: схватывает, тихий и так далее"
        value={d.note} onChange={e => setD({ ...d, note: e.target.value })} />

      {active !== undefined && (
        <label className="flex items-center gap-2 px-1 text-sm sm:col-span-2">
          <input type="checkbox" checked={on} onChange={e => setOn(e.target.checked)} />
          Занимается сейчас (сняв галочку, закроешь вход, но история останется)
        </label>
      )}

      {problem && <p className="text-sm text-red sm:col-span-2">{problem}</p>}

      <div className="flex gap-3 sm:col-span-2">
        <div className="w-40"><Primary onClick={submit}>Сохранить</Primary></div>
        <Quiet onClick={onCancel}>Отмена</Quiet>
      </div>
    </div>
  );
}
