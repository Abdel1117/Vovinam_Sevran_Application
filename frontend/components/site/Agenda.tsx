import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { evenements } from "@/lib/data";

export default function Agenda() {
  return (
    <section id="agenda" className="bg-vovinam-050 py-20 lg:py-30">
      <div className="mx-auto max-w-[1360px] px-2 md:px-7">
        <SectionTitle
          label="Agenda"
          titre="Prochains événements"
          accent="bg-jaune"
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#dce4f7] bg-white px-5 py-3.5 text-sm font-bold text-vovinam transition-colors hover:border-vovinam"
          >
            Ajouter au calendrier
          </Link>
        </SectionTitle>

        <div className="flex flex-col gap-4">
          {evenements.map((e, i) => (
            <Reveal
              key={e.titre}
              delay={i * 60}
              className="flex flex-wrap items-center gap-5 rounded-3xl border border-[#e8edf8] bg-white px-6.5 py-5.5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgb(16_24_40/0.12)] lg:gap-9"
            >
              <div className="flex size-23 flex-none flex-col items-center justify-center rounded-2xl bg-vovinam text-white">
                <span className="font-display text-3xl leading-none font-extrabold tracking-tight">
                  {e.jour}
                </span>
                <span className="text-[11px] font-bold tracking-[0.18em]">
                  {e.mois}
                </span>
              </div>
              <div className="flex min-w-[240px] flex-1 flex-col gap-2">
                <Badge variant={e.badge} className="self-start">
                  {e.type}
                </Badge>
                <h3 className="font-display text-xl leading-snug font-extrabold tracking-tight text-encre">
                  {e.titre}
                </h3>
                <span className="text-[0.95rem] text-[#6a7392]">{e.lieu}</span>
              </div>
              <span className="flex-none text-[0.98rem] font-semibold text-encre-70">
                {e.horaire}
              </span>
              <Link
                href="/contact"
                className="flex-none rounded-full bg-vovinam px-6 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                Détails
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
