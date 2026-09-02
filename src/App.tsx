import { useState } from "react";
import { store } from "./lib/auth";
import { Landing } from "./screens/Landing";
import { Student } from "./screens/Student";
import { Teacher } from "./screens/Teacher";
import type { User } from "./lib/types";

export function App() {
  const [user, setUser] = useState<User | null>(() => store.load());

  function exit() {
    store.clear();
    setUser(null);
  }

  if (!user) return <Landing onSignedIn={setUser} />;
  if (user.role === "student") return <Student user={user} onExit={exit} />;
  return <Teacher user={user} onExit={exit} />;
}
