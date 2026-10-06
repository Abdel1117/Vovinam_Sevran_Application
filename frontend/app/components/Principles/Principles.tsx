import Reveal from "@/components/Reveal/Reveal";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { principes } from "@/lib/data";

export default function Principles() {
  return (
    <section id="principes" className="bg-vovinam py-20 lg:py-30">
      <div className="mx-auto max-w-[1360px] px-2 md:px-7">
        <SectionTitle
          label="Thập Điều Tâm Niệm"
          titre="Les 10 principes du Vovinam"
          texte="Les fondements transmis à chaque pratiquant."
          clair
        />
        <ol className="grid gap-x-14 md:grid-cols-2 md:grid-flow-col md:grid-rows-5">
          {principes.map((p, i) => (
            <li key={p} className="border-t border-white/15">
              <Reveal
                delay={(i % 5) * 60}
                className="flex items-baseline gap-5 py-6"
              >
                <span className="w-12 flex-none font-display text-3xl leading-none font-extrabold text-jaune lg:text-4xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-lg leading-relaxed text-pretty text-white/90">
                  {p}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
