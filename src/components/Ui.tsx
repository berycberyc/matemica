import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-line bg-white p-6 ${className}`}>{children}</div>
  );
}

export function Primary(
  { children, onClick, disabled }:
  { children: ReactNode; onClick?: () => void; disabled?: boolean }
) {
  return (
    <button
      type="button" onClick={onClick} disabled={disabled}
      className="w-full rounded-xl bg-teal px-4 py-4 text-white transition-colors
                 active:bg-teal-dark disabled:opacity-50"
    >{children}</button>
  );
}

export function Quiet(
  { children, onClick, danger = false }:
  { children: ReactNode; onClick?: () => void; danger?: boolean }
) {
  return (
    <button
      type="button" onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-sm transition-colors
        ${danger ? "border-red text-red" : "border-line text-muted hover:border-teal hover:text-teal"}`}
    >{children}</button>
  );
}

export function Tech({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 rounded-xl bg-[#FFF6E6] px-3 py-2 font-mono text-[13px] leading-snug
                  text-amber break-words">{children}</p>
  );
}
