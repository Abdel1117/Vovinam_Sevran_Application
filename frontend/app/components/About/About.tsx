import Button from "@/components/Button/Button";
import Photo from "@/components/Photo/Photo";
import Reveal from "@/components/Reveal/Reveal";

type Mini = { titre: string; texte: string; couleur: string };

const minis: Mini[] = [
  {
    titre: "Technique",
    texte: "Mains nues, armes, quyen et combat.",
    couleur: "bg-vovinam",
  },
  {
    titre: "Discipline",
    texte: "Régularité, rigueur et progression.",
    couleur: "bg-jaune",
  },
  {
    titre: "Philosophie",
    texte: "Respect, humilité, transmission.",
    couleur: "bg-rouge",
  },
];

export default function About() {
  return (
    <section id="vovinam" className="bg-vovinam-050 py-20 lg:py-30">
      <div className="mx-auto flex max-w-[1360px] flex-wrap items-center gap-8 px-2 md:px-7 lg:gap-18">
        <Reveal className="min-w-[320px] flex-1">
          <div className="relative overflow-hidden rounded-3xl">
            <Photo
              label="photo — travail technique à deux"
              className="h-[380px] lg:h-[520px]"
            />
            <span className="absolute bottom-0 left-0 h-2 w-16 bg-jaune" />
            <span className="absolute bottom-0 left-16 h-2 w-6.5 bg-rouge" />
          </div>
        </Reveal>

        <Reveal
          delay={100}
          className="flex min-w-[320px] flex-1 flex-col gap-5"
        >
          <span className="inline-flex items-center gap-2.5 text-[11px] font-bold tracking-[0.2em] text-vovinam uppercase">
            <span className="h-0.5 w-6 bg-vovinam" />
            Découvrir
          </span>
          <h2 className="font-display text-3xl leading-[1.05] font-extrabold tracking-[-0.025em] text-encre sm:text-4xl lg:text-5xl">
            Le Vovinam Viet Vo Dao
          </h2>
          <p className="text-lg leading-[1.7] text-pretty text-[#4c5674]">
            Né au Vietnam, le Vovinam Viet Vo Dao réunit dans une même
            discipline le travail des techniques à mains nues, des armes
            traditionnelles et du combat. La pratique associe l'exigence du
            geste, la souplesse du corps et le respect du partenaire.
          </p>
          <p className="text-lg leading-[1.7] text-pretty text-[#4c5674]">
            Au-delà de la technique, la progression suit une philosophie de
            transmission : apprendre, comprendre, puis rendre.
          </p>
          <div className="mt-1.5 flex flex-wrap gap-3.5">
            {minis.map((m) => (
              <div
                key={m.titre}
                className="min-w-[150px] flex-1 rounded-2xl border border-[#e5ebf8] bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgb(16_24_40/0.1)]"
              >
                <span
                  className={[
                    "mb-3.5 block size-6.5 rounded-lg",
                    m.couleur,
                  ].join(" ")}
                />
                <h4 className="mb-1.5 font-display text-base font-bold text-encre">
                  {m.titre}
                </h4>
                <p className="text-[0.92rem] leading-relaxed text-[#6a7392]">
                  {m.texte}
                </p>
              </div>
            ))}
          </div>
          <Button href="/actualites" variant="bleu" className="mt-3 self-start">
            Découvrir le Vovinam
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
