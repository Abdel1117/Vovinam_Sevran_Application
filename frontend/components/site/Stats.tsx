"use client";

import { useEffect, useRef, useState } from "react";
import { statistiques } from "@/lib/data";

function Compteur({ valeur, suffixe }: { valeur: number; suffixe: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [n, setN] = useState(0);
  const lance = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const demarre = () => {
      if (lance.current) return;
      lance.current = true;
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / 1100);
        setN(Math.round(valeur * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const check = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) demarre();
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    const secours = setTimeout(demarre, 2000);
    return () => {
      window.removeEventListener("scroll", check);
      clearTimeout(secours);
    };
  }, [valeur]);

  return (
    <span
      ref={ref}
      className="block font-display text-5xl leading-none font-extrabold tracking-[-0.035em] text-white lg:text-7xl"
    >
      {n}
      {suffixe}
    </span>
  );
}

export default function Stats() {
  return (
    <section
      id="stats"
      className="relative overflow-hidden bg-vovinam py-20 lg:py-28"
    >
      <span className="absolute -top-15 -right-15 size-70 rounded-full border-2 border-white/10" />
      <span className="absolute -bottom-22 -left-10 size-55 rounded-full border-2 border-white/10" />
      <div className="relative mx-auto max-w-[1360px] px-2 md:px-7">
        <div className="mb-11 max-w-2xl">
          <span className="mb-4 inline-flex items-center gap-2.5 text-[11px] font-bold tracking-[0.2em] text-jaune uppercase">
            <span className="h-0.5 w-6 bg-jaune" />
            L'association en chiffres
          </span>
          <h2 className="font-display text-3xl leading-[1.05] font-extrabold tracking-[-0.025em] text-white sm:text-4xl lg:text-5xl">
            Une communauté qui grandit
          </h2>
        </div>
        <div className="flex flex-wrap gap-5">
          {statistiques.map((s) => (
            <div
              key={s.label}
              className="min-w-[220px] flex-1 rounded-3xl border border-white/20 bg-white/10 px-7 py-8 backdrop-blur-sm"
            >
              <Compteur valeur={s.valeur} suffixe={s.suffixe} />
              <span className="my-4 block h-[3px] w-9.5 bg-jaune" />
              <span className="text-[1.02rem] font-semibold text-white/85">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
