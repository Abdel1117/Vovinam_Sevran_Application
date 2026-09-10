import Link from "next/link";
import Badge from "@/components/Badge/Badge";
import Photo from "@/components/Photo/Photo";
import Reveal from "@/components/Reveal/Reveal";
import SectionTitle from "@/components/SectionTitle/SectionTitle";

export default function Featured() {
  return (
    <section id="actu" className="bg-white py-20 lg:py-30">
      <div className="mx-auto max-w-[1360px] px-2 md:px-7">
        <SectionTitle
          label="À la une"
          titre="Les rendez-vous du club"
          texte="Les dernières nouvelles et les prochains rendez-vous de l'association."
        >
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#dce4f7] px-5 py-3.5 text-sm font-bold text-vovinam transition-colors hover:border-vovinam hover:bg-vovinam-050"
          >
            Tout voir →
          </Link>
        </SectionTitle>

        <div className="flex flex-wrap gap-6">
          <Reveal className="group flex min-w-[320px] flex-[2_1_560px] flex-col overflow-hidden rounded-card border border-trait bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover">
            <div className="relative">
              <Photo
                label="photo — stage national"
                className="h-[300px] lg:h-[330px]"
                zoom
              />
              <Badge variant="stage" className="absolute top-4.5 left-4.5">
                Stage
              </Badge>
            </div>
            <div className="flex flex-1 flex-col gap-3.5 px-8 pt-7 pb-8">
              <span className="text-xs font-semibold tracking-[0.12em] text-encre-30 uppercase">
                14 septembre 2026
              </span>
              <h3 className="font-display text-2xl leading-tight font-extrabold tracking-tight text-encre lg:text-3xl">
                Prochain stage régional
              </h3>
              <p className="text-[1.02rem] leading-relaxed text-pretty text-encre-50">
                Une journée complète de travail technique encadrée par les
                enseignants de la région, ouverte à toutes les ceintures.
              </p>
              <Link
                href="/actualites"
                className="mt-1.5 text-sm font-bold text-vovinam"
              >
                En savoir plus →
              </Link>
            </div>
          </Reveal>

          <div className="flex min-w-[300px] flex-1 flex-col gap-6">
            <Reveal
              delay={80}
              className="flex flex-1 flex-col gap-3 rounded-card border border-trait bg-white p-6.5 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
            >
              <Badge variant="actualite" className="self-start">
                Actualité
              </Badge>
              <span className="text-xs font-semibold tracking-[0.12em] text-encre-30 uppercase">
                02 septembre 2026
              </span>
              <h3 className="font-display text-xl leading-snug font-extrabold text-encre">
                Nouvelle saison, inscriptions ouvertes
              </h3>
              <p className="text-[0.98rem] leading-relaxed text-encre-50">
                Les créneaux enfants, ados et adultes reprennent. Places
                limitées par groupe.
              </p>
              <Link
                href="/actualites/nouvelle-saison"
                className="mt-auto text-sm font-bold text-vovinam"
              >
                Lire l'article →
              </Link>
            </Reveal>

            <Reveal
              delay={140}
              className="flex flex-1 flex-col gap-3 rounded-card border border-trait bg-white p-6.5 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
            >
              <Badge variant="competition" className="self-start">
                Compétition
              </Badge>
              <span className="text-xs font-semibold tracking-[0.12em] text-encre-30 uppercase">
                28 septembre 2026
              </span>
              <h3 className="font-display text-xl leading-snug font-extrabold text-encre">
                Open de Paris — Song Luyen
              </h3>
              <p className="text-[0.98rem] leading-relaxed text-encre-50">
                Nos compétiteurs engagés sur les tableaux techniques et combat.
              </p>
              <Link
                href="/actualites/resultats-open-de-paris"
                className="mt-auto text-sm font-bold text-vovinam"
              >
                En savoir plus →
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
