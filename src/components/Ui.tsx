import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[20px] bg-white p-6 shadow-[0_1px_2px_rgba(20,48,46,.06)] ${className}`}>{children}</div>;
}

export function Primary(
  { children, onClick, disabled }:
  { children: ReactNode; onClick?: () => void; disabled?: boolean }
) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className="w-full rounded-2xl bg-teal px-5 py-4 text-[17px] text-white
                 transition active:scale-[.99] active:bg-teal-dark disabled:opacity-40">
      {children}
    </button>
  );
}

export function Quiet(
  { children, onClick, danger = false }:
  { children: ReactNode; onClick?: () => void; danger?: boolean }
) {
  return (
    <button type="button" onClick={onClick}
      className={`rounded-xl px-4 py-2.5 text-sm transition
        ${danger ? "bg-red/10 text-red" : "bg-teal-light/60 text-teal hover:bg-teal-light"}`}>
      {children}
    </button>
  );
}

export function Tech({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 rounded-xl bg-[#FFF6E6] px-3 py-2 font-mono text-[13px]
                  leading-snug text-amber break-words">{children}</p>
  );
}
