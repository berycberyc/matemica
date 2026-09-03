import { useState } from "react";
import { store } from "./lib/auth";
import { NewVersion } from "./components/NewVersion";
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

  return (
    <>
      <div className="mx-auto max-w-4xl px-4"><NewVersion /></div>
      {!user ? <Landing onSignedIn={setUser} />
        : user.role === "student" ? <Student user={user} onExit={exit} />
        : <Teacher user={user} onExit={exit} />}
    </>
  );
}
