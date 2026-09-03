import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { cours } from "@/lib/data";

export default function Courses() {
  return (
    <section id="cours" className="bg-vovinam-050 py-20 lg:py-30">
      <div className="mx-auto max-w-[1360px] px-7">
        <SectionTitle
          label="Nos cours"
          titre="Un cours pour chacun"
          texte="Enfant, adolescent ou adulte, chacun peut découvrir et progresser dans la pratique du Vovinam."
        >
          <Link
            href="/#agenda"
            className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#dce4f7] bg-white px-5 py-3.5 text-sm font-bold text-vovinam transition-colors hover:border-vovinam"
          >
            Voir les horaires →
          </Link>
        </SectionTitle>

        <div className="flex flex-wrap gap-5.5">
          {cours.map((c, i) => (
            <Reveal
              key={c.titre}
              delay={i * 70}
              className="group flex min-w-[280px] flex-1 flex-col overflow-hidden rounded-card border border-[#e8edf8] bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
            >
              <Photo label={"photo — " + c.photo} className="h-42" zoom />
              <div className="flex flex-1 flex-col gap-3 px-6.5 pt-6.5 pb-7.5">
                <Badge variant={c.badge} className="self-start">
                  {c.niveau}
                </Badge>
                <h3 className="font-display text-2xl leading-tight font-extrabold tracking-tight text-encre">{c.titre}</h3>
                <p className="text-[0.98rem] leading-relaxed text-encre-50">{c.texte}</p>
                <div className="mt-1.5 flex flex-col gap-1.5 border-t border-[#f0f3fa] pt-3.5">
                  <span className="text-[0.9rem] font-semibold text-encre-70">{c.horaires}</span>
                  <span className="text-[0.88rem] text-encre-30">{c.lieu}</span>
                </div>
                <Link href="/#agenda" className="mt-auto pt-2 text-sm font-bold text-vovinam">
                  Voir les cours →
                </Link>
              </div>
            </Reveal>
          ))}

          <Reveal
            delay={210}
            className="flex min-w-[280px] flex-1 flex-col justify-between gap-4.5 rounded-card bg-vovinam px-7 pt-7.5 pb-8 text-white transition-all duration-300 hover:-translate-y-1.5"
          >
            <div className="flex flex-col gap-3">
              <Badge variant="stage" className="self-start">
                Tous niveaux
              </Badge>
              <h3 className="font-display text-2xl leading-tight font-extrabold tracking-tight">Débutants</h3>
              <p className="text-[0.98rem] leading-relaxed text-white/85">
                Aucune expérience préalable nécessaire. Le premier cours est gratuit, il suffit d'une tenue de sport.
              </p>
            </div>
            <Link
              href="/contact"
              className="rounded-full bg-jaune px-6 py-4 text-center text-[15px] font-bold text-encre transition-transform hover:-translate-y-0.5"
            >
              Essayer gratuitement
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
