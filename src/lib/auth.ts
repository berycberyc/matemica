import { api } from "./api";
import type { User } from "./types";

const KEY = "matemica_user";

export const store = {
  save(u: User) { localStorage.setItem(KEY, JSON.stringify(u)); },
  load(): User | null {
    try { return JSON.parse(localStorage.getItem(KEY) ?? "null") as User | null; }
    catch { return null; }
  },
  clear() { localStorage.removeItem(KEY); }
};

export type SignInResult =
  | { ok: true; user: User }
  | { ok: false; reason: "empty" | "nouser" | "nopass" };

export async function signIn(login: string, pass: string): Promise<SignInResult> {
  const l = login.trim(), p = pass.trim();
  if (!l || !p) return { ok: false, reason: "empty" };
  const rows = await api.get<User>("users",
    `login=eq.${encodeURIComponent(l)}&is_active=is.true&select=*`);
  const user = rows[0];
  if (!user) return { ok: false, reason: "nouser" };
  if (String(user.password).trim() !== p) return { ok: false, reason: "nopass" };
  return { ok: true, user };
}
