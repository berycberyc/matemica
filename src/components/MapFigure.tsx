// Картина знания одного ученика: узлы — темы, линии — на чём тема стоит.
// Это иллюстрация устройства, а не чьи-то результаты, и так и подписано.

const N = {
  fractions:  { x: 150, y: 252, label: "Fractions",        state: "closed" },
  order:      { x: 390, y: 252, label: "Order of ops",     state: "closed" },
  decimals:   { x:  80, y: 176, label: "Decimals",         state: "closed" },
  negatives:  { x: 300, y: 176, label: "Negatives",        state: "slow" },
  part:       { x: 500, y: 176, label: "Part of a number", state: "break" },
  percent:    { x: 420, y: 100, label: "Percentages",      state: "early" },
  expr:       { x: 180, y: 100, label: "Expressions",      state: "closed" },
  compound:   { x: 520, y:  30, label: "Compound %",       state: "early" },
  equations:  { x: 130, y:  30, label: "Equations",        state: "early" }
} as const;

type Key = keyof typeof N;

const EDGES: [Key, Key][] = [
  ["decimals", "fractions"], ["negatives", "order"],
  ["part", "fractions"], ["part", "order"],
  ["percent", "part"], ["percent", "decimals"],
  ["expr", "order"], ["expr", "negatives"],
  ["equations", "expr"], ["equations", "fractions"],
  ["compound", "percent"]
];

const COLOR: Record<string, string> = {
  closed: "#1F6F6B", slow: "#8A5A09", break: "#A8342C", early: "#C3CEC9"
};

const LEGEND: [string, string][] = [
  ["closed", "Closed — and everything beneath it with it"],
  ["slow", "Correct, but slow"],
  ["break", "The break"],
  ["early", "Not asked: it stands on the break"]
];

export function MapFigure() {
  return (
    <figure className="mt-10">
      <svg viewBox="0 0 600 290" className="w-full" role="img"
           aria-label="A student's topic map after one diagnostic pass">
        {EDGES.map(([a, b]) => (
          <line key={`${a}-${b}`} x1={N[a].x} y1={N[a].y} x2={N[b].x} y2={N[b].y}
                stroke={N[a].state === "early" ? "#E3E9E6" : "#CBD6D2"} strokeWidth="2" />
        ))}
        {(Object.keys(N) as Key[]).map(k => {
          const n = N[k];
          const c = COLOR[n.state] ?? "#C3CEC9";
          return (
            <g key={k}>
              <circle cx={n.x} cy={n.y} r="10" fill={c} />
              <text x={n.x} y={n.y - 18} textAnchor="middle"
                    fontSize="13" fill={n.state === "early" ? "#8FA09B" : "#14302E"}>
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>

      <figcaption className="mt-4 grid gap-2 sm:grid-cols-2">
        {LEGEND.map(([k, text]) => (
          <span key={k} className="flex items-start gap-2.5 text-[14px] text-muted">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: COLOR[k] }} />
            {text}
          </span>
        ))}
      </figcaption>

      <p className="mt-5 text-[13px] leading-relaxed text-muted/80">
        An illustration of how the map is read, not a record of anyone's results.
        Percentages here were never asked: they stand on a topic that had already
        broken, and asking them would have measured nothing.
      </p>
    </figure>
  );
}
