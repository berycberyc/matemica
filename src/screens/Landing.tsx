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

const PRINCIPLES: [string, string][] = [
  ["Directed Graph of Knowledge Architecture",
   "The curriculum is represented not as a linear sequence but as a strictly hierarchical " +
   "directed acyclic graph. Each construct is formally bound to the prerequisite " +
   "constructs upon which it depends."],
  ["Adaptive Recursive Testing",
   "The assessment algorithm operates recursively. Upon a correct response, the testing " +
   "trajectory advances toward higher conceptual complexity. When an error occurs, the " +
   "trajectory shifts downward toward foundational mechanics."],
  ["Filtering of Dependent Concepts",
   "If a gap is detected in a core prerequisite, evaluation of higher-level dependent " +
   "topics is suspended. These topics are categorized as premature rather than unknown, " +
   "preventing misdiagnosis and optimizing instructional time."],
  ["Differentiated Distractor Analysis",
   "Every incorrect answer option models a specific, named cognitive error — misapplying " +
   "the order of operations, averaging rates incorrectly. This provides precise data to " +
   "structure subsequent targeted remediation."],
  ["Procedural Fluency and Response Latency",
   "Response speed is an integral metric alongside accuracy. A correct answer delivered " +
   "with excessive latency indicates that the student is re-deriving the method rather " +
   "than demonstrating mastery, signalling an unstable foundation below."]
];

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

  const field = "mt-1 w-full rounded-xl bg-paper px-4 py-3 text-lg outline-none " +
                "focus:ring-2 focus:ring-teal";

  return (
    <div className="mx-auto grid max-w-5xl gap-14 px-6 py-12 md:grid-cols-[1.15fr_1fr] md:py-20">
      <div>
        <div className="flex items-center gap-3">
          <img src="/icon-192.png" alt="" width={40} height={40} className="rounded-[11px]" />
          <span className="text-[17px] tracking-wide text-teal">matemica</span>
        </div>

        <h1 className="mt-6 font-read text-[30px] leading-[1.25] md:text-[36px]">
          A Graph-Based Hierarchical Model for Mathematical Knowledge Diagnostics
        </h1>

        <h2 className="mt-9 text-[13px] uppercase tracking-[.16em] text-muted/70">
          Abstract and conceptual foundation
        </h2>
        <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-muted">
          A primary challenge in mathematical assessment is distinguishing between the point
          of origin of a cognitive deficiency and its surface-level manifestation. A student's
          errors in compound percentages or algebraic equations rarely stem from an inability
          to grasp those specific topics; rather, they arise from unaddressed gaps in
          foundational prerequisites, such as calculating parts of a number or mastering the
          order of operations.
        </p>
        <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-muted">
          This diagnostic framework bypasses superficial symptoms to isolate and identify the
          underlying structural dysfunction within a student's knowledge base.
        </p>

        <MapFigure />

        <h2 className="mt-12 border-t border-line pt-8 text-[13px] uppercase
                       tracking-[.16em] text-muted/70">
          Key principles of the diagnostic algorithm
        </h2>
        <div className="mt-5 space-y-6">
          {PRINCIPLES.map(([title, body]) => (
            <div key={title}>
              <h3 className="text-[17px] leading-snug">{title}</h3>
              <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 border-t border-line pt-8 text-[13px] uppercase
                       tracking-[.16em] text-muted/70">
          Methodological provenance
        </h2>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
          The measurement principles applied here — adaptive testing, distractor analysis,
          and response latency as an indicator of cognitive fluency — are anchored in the
          methodological framework of educational measurement advanced by the National
          Institute for Educational Measurement (
          <a href="https://www.cito.nl" target="_blank" rel="noopener noreferrer"
             className="text-teal underline underline-offset-2">Cito</a>, Netherlands).
          The instrument itself, including the dependency graph, the item bank and the
          descent procedure, was constructed independently for this practice and is not
          affiliated with, endorsed by, or validated by that institute.
        </p>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
          Psychometric characterisation of the item bank — difficulty and discrimination
          indices, and empirical calibration of the latency threshold — is pending the
          accumulation of sufficient response data. Until that point the instrument is to
          be regarded as a diagnostic aid to instruction rather than a calibrated
          measurement scale.
        </p>

        <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-muted">
          Designed as an institutional tool to enhance teaching practice and diagnostic
          precision, providing educators with actionable data to structure effective
          learning trajectories.
        </p>
      </div>

      <div className="md:pt-16">
        <div className="rounded-[20px] bg-white p-7 shadow-[0_1px_2px_rgba(20,48,46,.06)]
                        md:sticky md:top-8">
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
            value={login} onChange={e => setLogin(e.target.value)} className={field}
          />

          <label className="mt-4 block text-sm text-muted" htmlFor="code">Code</label>
          <input
            id="code" inputMode={teacherMode ? "text" : "numeric"}
            type={show ? "text" : "password"} autoComplete="off" autoCapitalize="off"
            value={pass} onChange={e => setPass(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") void submit(); }} className={field}
          />
          <button type="button" onClick={() => setShow(v => !v)}
            className="mt-2 text-sm text-muted underline-offset-2 hover:underline">
            {show ? "Hide code" : "Show code"}
          </button>

          <button type="button" onClick={() => void submit()} disabled={busy}
            className="mt-6 w-full rounded-2xl bg-teal px-4 py-4 text-[17px] text-white
                       transition active:scale-[.99] active:bg-teal-dark disabled:opacity-50">
            {busy ? "…" : "Sign in"}
          </button>

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
