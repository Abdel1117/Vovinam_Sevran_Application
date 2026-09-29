import Photo from "@/components/Photo/Photo";
import Reveal from "@/components/Reveal/Reveal";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { listEnseignants } from "@/lib/api/enseignants";

export default async function Teachers() {
  const enseignants = await listEnseignants().catch(() => []);
  if (enseignants.length === 0) return null;

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
              key={e.id}
              delay={i * 70}
              className="group flex min-w-[260px] flex-1 flex-col overflow-hidden rounded-card border border-trait bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
            >
              {e.photo ? (
                <div className="h-100 overflow-hidden bg-[repeating-linear-gradient(135deg,#e9eeff_0_12px,#dce5ff_12px_24px)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={e.photo}
                    alt={`Portrait de ${e.nom}`}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover  transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ) : (
                <Photo label="portrait" className="h-65" zoom />
              )}
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
                {e.texte ? (
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-encre-50">
                    {e.texte}
                  </p>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
