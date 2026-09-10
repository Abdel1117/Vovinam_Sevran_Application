import type { ReactNode } from "react";
import Reveal from "../Reveal/Reveal";

type SectionTitleProps = {
  label: string;
  titre: string;
  texte?: string;
  /** Classe de fond du filet décoratif, ex. bg-jaune */
  accent?: string;
  /** Version claire, pour les sections sur fond bleu. */
  clair?: boolean;
  children?: ReactNode;
};

export default function SectionTitle({
  label,
  titre,
  texte,
  accent = "bg-rouge",
  clair = false,
  children,
}: SectionTitleProps) {
  return (
    <Reveal className="mb-11 flex flex-wrap items-end justify-between gap-5">
      <div className="max-w-2xl">
        <span
          className={[
            "mb-4 inline-flex items-center gap-2.5 text-[11px] font-bold tracking-[0.2em] uppercase",
            clair ? "text-jaune" : "text-vovinam",
          ].join(" ")}
        >
          <span className={["h-0.5 w-6", clair ? "bg-jaune" : accent].join(" ")} />
          {label}
        </span>
        <h2
          className={[
            "font-display text-3xl leading-[1.05] font-extrabold tracking-tight sm:text-4xl lg:text-5xl",
            clair ? "text-white" : "text-encre",
          ].join(" ")}
        >
          {titre}
        </h2>
        {texte ? (
          <p className={["mt-4 text-lg leading-relaxed text-pretty", clair ? "text-white/85" : "text-encre-50"].join(" ")}>
            {texte}
          </p>
        ) : null}
      </div>
      {children}
    </Reveal>
  );
}
