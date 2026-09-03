import { useState } from "react";
import { signIn, store } from "../lib/auth";
import { MapFigure } from "../components/MapFigure";
import type { User } from "../lib/types";

const ERRORS: Record<string, string> = {
  empty: "Fill in both fields.",
  nouser: "No such number.",
  nopass: "That code doesn't match.",
  offline: "Connection failed. Try again."
};

export function Landing({ onSignedIn }: { onSignedIn: (u: User) => void }) {
  const [login, setLogin] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [teacherMode, setTeacherMode] = useState(false);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const r = await signIn(login, pass);
      if (!r.ok) { setError(ERRORS[r.reason] ?? "Sign in failed."); setBusy(false); return; }
      store.save(r.user);
      onSignedIn(r.user);
    } catch {
      setError(ERRORS.offline ?? null);
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-14 px-6 py-14 md:grid-cols-[1.15fr_1fr] md:py-24">
      <div>
        <div className="flex items-center gap-3">
          <img src="/icon-192.png" alt="" width={40} height={40}
               className="rounded-[11px]" />
          <span className="text-[17px] tracking-wide text-teal">matemica</span>
        </div>
        <h1 className="mt-4 font-read text-[34px] leading-[1.25] md:text-[42px]">
          A gap in mathematics is rarely where the mistake appears.
        </h1>
        <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted">
          Percentages fail because parts of a number failed two years earlier. Equations fail
          because of the order of operations. This system looks for the break itself, not the
          symptom above it.
        </p>

        <MapFigure />

        <div className="mt-12 space-y-6 border-t border-line pt-8">
          <Section
            title="Seventy-eight topics, ninety-six dependencies"
            body="Every topic knows what it stands on. The map is a graph, not a list, so a wrong
                  answer has somewhere to lead."
          />
          <Section
            title="The next question depends on the last answer"
            body="Answer well and the questions climb until they stop being easy. Miss, and the
                  check descends toward the foundation. No two students take the same path."
          />
          <Section
            title="Topics above a break are never asked"
            body="They are marked too early rather than unknown. Those are different states, and
                  confusing them wastes a term of teaching."
          />
          <Section
            title="Every wrong option carries a named error"
            body="Not incorrect, but took the average of two speeds. That is what makes a plan
                  possible afterwards."
          />
          <Section
            title="Speed is part of the measurement"
            body="An answer that is correct but slow does not close the topics beneath it.
                  A student who re-derives the method every time is standing on something thin."
          />
        </div>

        <p className="mt-12 border-t border-line pt-8 text-[14px] leading-relaxed text-muted">
          Built for one teacher's practice, and shaped by it. Nothing here is a claim
          about results; it is a description of how the diagnostic works.
        </p>
      </div>

      <div className="md:pt-16">
        <div className="rounded-[20px] bg-white p-7 shadow-[0_1px_2px_rgba(20,48,46,.06)]">
          <h2 className="text-lg">Sign in</h2>
          <p className="mt-1 text-sm text-muted">
            {teacherMode ? "Letters and digits." : "Digits only, both fields."}
          </p>

          <label className="mt-6 block text-sm text-muted" htmlFor="login">
            {teacherMode ? "Login" : "Number"}
          </label>
          <input
            id="login" inputMode={teacherMode ? "text" : "numeric"}
            autoComplete="off" autoCapitalize="off"
            value={login} onChange={e => setLogin(e.target.value)}
            className="mt-1 w-full rounded-xl bg-paper px-4 py-3 text-lg outline-none
                       focus:ring-2 focus:ring-teal"
          />

          <label className="mt-4 block text-sm text-muted" htmlFor="code">Code</label>
          <input
            id="code" inputMode={teacherMode ? "text" : "numeric"}
            type={show ? "text" : "password"} autoComplete="off" autoCapitalize="off"
            value={pass} onChange={e => setPass(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") void submit(); }}
            className="mt-1 w-full rounded-xl bg-paper px-4 py-3 text-lg outline-none
                       focus:ring-2 focus:ring-teal"
          />
          <button
            type="button" onClick={() => setShow(v => !v)}
            className="mt-2 text-sm text-muted underline-offset-2 hover:underline"
          >{show ? "Hide code" : "Show code"}</button>

          <button
            type="button" onClick={() => void submit()} disabled={busy}
            className="mt-6 w-full rounded-2xl bg-teal px-4 py-4 text-[17px] text-white
                       transition active:scale-[.99] active:bg-teal-dark disabled:opacity-50"
          >{busy ? "…" : "Sign in"}</button>

          {error && <p className="mt-3 text-sm text-red">{error}</p>}

          <button type="button" onClick={() => setTeacherMode(v => !v)}
            className="mt-5 block text-sm text-muted underline-offset-2 hover:underline">
            {teacherMode ? "I'm a student" : "I'm a teacher"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-[17px]">{title}</h3>
      <p className="mt-1 max-w-xl text-[15px] leading-relaxed text-muted">{body}</p>
    </div>
  );
}
