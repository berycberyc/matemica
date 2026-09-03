// Картина знания одного ученика: узлы — темы, линии — на чём тема стоит.
// Строго по этажам: внизу фундамент, выше то, что на нём держится.

interface Node { x: number; y: number; label: string; side: "left" | "right"; state: string }

const LEFT = 180, RIGHT = 380;

const NODES: Node[] = [
  { x: LEFT,  y: 262, label: "Order of operations", side: "left",  state: "closed" },
  { x: LEFT,  y: 188, label: "Negative numbers",    side: "left",  state: "slow" },
  { x: LEFT,  y: 114, label: "Expressions",         side: "left",  state: "closed" },
  { x: LEFT,  y:  40, label: "Equations",           side: "left",  state: "early" },
  { x: RIGHT, y: 262, label: "Fractions",           side: "right", state: "closed" },
  { x: RIGHT, y: 188, label: "Part of a number",    side: "right", state: "break" },
  { x: RIGHT, y: 114, label: "Percentages",         side: "right", state: "early" },
  { x: RIGHT, y:  40, label: "Compound percent",    side: "right", state: "early" }
];

const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3],      // левый столб
  [4, 5], [5, 6], [6, 7],      // правый столб
  [4, 2]                        // связь через блоки
];

const COLOR: Record<string, string> = {
  closed: "#1F6F6B", slow: "#8A5A09", break: "#A8342C", early: "#C7D2CE"
};

const LEGEND: [string, string][] = [
  ["closed", "Closed"],
  ["slow", "Correct, but slow"],
  ["break", "The break"],
  ["early", "Premature — stands on the break"]
];

export function MapFigure() {
  const dim = (i: number) => NODES[i]?.state === "early";
  return (
    <figure className="mt-10">
      <svg viewBox="0 0 560 300" className="w-full" role="img"
           aria-label="A student's topic map: closed topics, one break, and the topics suspended above it">
        {EDGES.map(([a, b]) => {
          const A = NODES[a], B = NODES[b];
          if (!A || !B) return null;
          return (
            <line key={`${a}-${b}`} x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                  stroke={dim(a) || dim(b) ? "#E4EAE7" : "#C3D0CB"} strokeWidth="2" />
          );
        })}
        {NODES.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="9" fill={COLOR[n.state] ?? "#C7D2CE"} />
            <text
              x={n.side === "left" ? n.x - 20 : n.x + 20}
              y={n.y + 5}
              textAnchor={n.side === "left" ? "end" : "start"}
              fontSize="14"
              fill={n.state === "early" ? "#93A29E" : "#14302E"}
            >{n.label}</text>
          </g>
        ))}
      </svg>

      <figcaption className="mt-5 flex flex-wrap gap-x-7 gap-y-2">
        {LEGEND.map(([k, text]) => (
          <span key={k} className="flex items-center gap-2 text-[14px] text-muted">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLOR[k] }} />
            {text}
          </span>
        ))}
      </figcaption>

      <p className="mt-5 text-[13px] leading-relaxed text-muted/80">
        An illustration of how the map is read, not a record of results. Percentages and
        everything above them were never asked: they stand on a topic already known to
        have broken, and asking them would have measured nothing.
      </p>
    </figure>
  );
}
