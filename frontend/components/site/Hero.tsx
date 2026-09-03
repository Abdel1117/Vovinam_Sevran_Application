import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

const infos: string[] = ["Cours enfants & adultes", "Débutants bienvenus", "Cours d'essai disponible"];

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-[min(94vh,900px)] items-end overflow-hidden bg-hero-vovinam">
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="px-6 text-center font-mono text-xs tracking-[0.14em] text-white/30 uppercase">
          photo hero — démonstration / entraînement en mouvement
        </span>
      </div>
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#09183e]/55 to-[#071436]/90" />
      <div className="absolute inset-x-0 top-0 flex h-1">
        <span className="flex-1 bg-vovinam" />
        <span className="w-30 bg-jaune" />
        <span className="w-15 bg-rouge" />
      </div>

      <div className="relative z-2 mx-auto w-full max-w-[1360px] px-7 pt-38 pb-15">
        <div className="flex max-w-[840px] flex-col gap-6">
          <Reveal className="flex">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-white/15 px-4 py-2.5 text-xs font-semibold tracking-[0.16em] text-white uppercase backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-jaune" />
              Vovinam Viet Vo Dao
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display text-5xl leading-[0.98] font-extrabold tracking-[-0.025em] text-balance text-white sm:text-6xl lg:text-[5.4rem]">
              PLUS QU'UN ART MARTIAL.
              <br />
              <span className="text-jaune">UNE VOIE.</span>
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="max-w-[620px] text-lg leading-relaxed text-pretty text-white/85 lg:text-xl">
              Discipline, respect, maîtrise et dépassement de soi. Découvrez le Vovinam Viet Vo Dao au sein d'une association
              ouverte à tous.
            </p>
          </Reveal>
          <Reveal delay={200} className="mt-1.5 flex flex-wrap gap-3.5">
            <Button href="/contact" variant="jaune">
              Faire un cours d'essai
            </Button>
            <Button href="#vovinam" variant="contourClair">
              Découvrir le Vovinam
            </Button>
          </Reveal>
          <Reveal delay={260} className="mt-4 flex flex-wrap gap-3">
            {infos.map((i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-[13px] font-semibold text-white"
              >
                <span className="size-1.5 rounded-sm bg-jaune" />
                {i}
              </span>
            ))}
          </Reveal>
        </div>

        <div className="mt-13 flex justify-center">
          <span className="flex animate-bounce flex-col items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-white/70 uppercase">
            Défiler
            <span className="h-6 w-px bg-linear-to-b from-white/70 to-transparent" />
          </span>
        </div>
      </div>
    </section>
  );
}
