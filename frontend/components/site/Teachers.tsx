import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { enseignants } from "@/lib/data";

export default function Teachers() {
  return (
    <section id="enseignants" className="bg-white py-20 lg:py-30">
      <div className="mx-auto max-w-[1360px] px-2 md:px-7">
        <SectionTitle
          label="Nos enseignants"
          titre="L'équipe enseignante"
          texte="Des enseignants diplômés, formés à la pédagogie du Vovinam et attentifs à chaque pratiquant."
          accent="bg-vovinam"
        />
        <div className="flex flex-wrap gap-5.5">
          {enseignants.map((e, i) => (
            <Reveal
              key={e.nom}
              delay={i * 70}
              className="group flex min-w-[260px] flex-1 flex-col overflow-hidden rounded-card border border-trait bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
            >
              <Photo label="portrait" className="h-65" zoom />
              <div className="flex flex-col gap-2.5 px-6.5 pt-6 pb-7">
                <h3 className="font-display text-xl font-extrabold text-encre">
                  {e.nom}
                </h3>
                <span className="text-[11px] font-bold tracking-[0.14em] text-vovinam uppercase">
                  {e.grade}
                </span>
                <span className="text-[0.95rem] font-semibold text-[#6a7392]">
                  {e.role}
                </span>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-encre-50">
                  {e.texte}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
