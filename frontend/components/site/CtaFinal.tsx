import Button from "@/components/ui/Button";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";

export default function CtaFinal() {
  return (
    <section id="essai" className="bg-vovinam-050 py-16 lg:py-28">
      <div className="mx-auto max-w-[1360px] px-2 md:px-7">
        <Reveal className="flex flex-wrap overflow-hidden rounded-[28px] bg-vovinam shadow-[0_30px_70px_rgb(24_81_217/0.28)]">
          <div className="flex min-w-[320px] flex-[1_1_420px] flex-col justify-center gap-5 p-10 lg:p-16">
            <span className="inline-flex items-center gap-2.5 text-[11px] font-bold tracking-[0.2em] text-jaune uppercase">
              <span className="h-0.5 w-6 bg-jaune" />
              Cours d'essai
            </span>
            <h2 className="font-display text-4xl leading-[1.03] font-extrabold tracking-[-0.03em] text-white lg:text-6xl">
              Envie d'essayer ?
            </h2>
            <p className="max-w-[480px] text-lg leading-relaxed text-pretty text-white/85">
              Venez découvrir le Vovinam lors d'un premier cours et rencontrez
              notre équipe.
            </p>
            <div className="mt-2 flex flex-wrap gap-3.5">
              <Button href="/contact" variant="jaune">
                Réserver mon cours d'essai
              </Button>
              <Button href="/contact" variant="blanc">
                Nous contacter
              </Button>
            </div>
          </div>
          <div className="relative min-h-75 flex-[1_1_320px]">
            <Photo
              label="photo — accueil des débutants"
              className="absolute inset-0"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
