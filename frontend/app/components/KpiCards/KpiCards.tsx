import React from "react";
type Kpi = { label: string; valeur: string; alerte?: boolean };

interface KpisCardProps {
  isLoading: boolean;
  kpis: Kpi[];
}

export const KpiCards = ({ isLoading, kpis }: KpisCardProps) => {
  return (
    <div className="flex flex-wrap gap-4.5">
      {isLoading
        ? Array.from({ length: 4 }, (_, index) => (
            <div
              key={`kpi-skeleton-${index}`}
              className={
                "animate-pulse flex min-w-[190px] flex-1 flex-col gap-3 p-5.5 rounded-card border border-trait bg-white shadow-card"
              }
            >
              <div className="h-3 w-28 animate-pulse rounded bg-encre-10" />
              <div className="h-10 w-16 animate-pulse rounded bg-encre-10" />
            </div>
          ))
        : kpis.map((k) => (
            <div
              key={k.label}
              className={
                "flex min-w-[190px] flex-1 flex-col gap-2 p-5.5 rounded-card border border-trait bg-white shadow-card"
              }
            >
              <span className="text-[11px] font-semibold tracking-[0.14em] text-encre-30 uppercase">
                {k.label}
              </span>
              <span
                className={[
                  "font-display text-4xl leading-none font-extrabold tracking-tight",
                  k.alerte ? "text-rouge" : "text-encre",
                ].join(" ")}
              >
                {k.valeur}
              </span>
            </div>
          ))}
    </div>
  );
};
