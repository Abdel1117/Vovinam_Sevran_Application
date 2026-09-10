import Link from "next/link";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";

type Tuile = { label: string; cat: string; classe: string };

const tuiles: Tuile[] = [
  {
    label: "entraînement collectif",
    cat: "Entraînement",
    classe: "flex-[2_1_520px] h-[320px] lg:h-[400px]",
  },
  { label: "groupe", cat: "Groupe", classe: "flex-[1_1_260px] h-[190px]" },
  {
    label: "compétition",
    cat: "Compétition",
    classe: "flex-[1_1_260px] h-[190px]",
  },
  { label: "stage", cat: "Stage", classe: "flex-[1_1_240px] h-[240px]" },
  {
    label: "démonstration",
    cat: "Démonstration",
    classe: "flex-[1_1_240px] h-[240px]",
  },
  {
    label: "événement associatif",
    cat: "Événement",
    classe: "flex-[2_1_380px] h-[240px]",
  },
];

export default function GalleryTeaser() {
  return (
    <section id="galerie" className="bg-white py-20 lg:py-30">
      <div className="mx-auto max-w-[1360px] px-2 md:px-7">
        <SectionTitle label="Galerie" titre="La vie du club">
          <Link
            href="/galerie"
            className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#dce4f7] px-5 py-3.5 text-sm font-bold text-vovinam transition-colors hover:border-vovinam hover:bg-vovinam-050"
          >
            Découvrir la galerie →
          </Link>
        </SectionTitle>
        <div className="flex flex-wrap gap-4.5">
          {tuiles.map((t, i) => (
            <Reveal
              key={t.label}
              delay={i * 60}
              className={["group min-w-[240px]", t.classe].join(" ")}
            >
              <Link
                href="/galerie"
                className="relative flex size-full items-end overflow-hidden rounded-card border border-trait p-4.5 transition-transform duration-300 hover:scale-[1.01]"
              >
                <Photo
                  label={"photo — " + t.label}
                  className="absolute inset-0"
                  zoom
                />
                <span className="relative rounded-lg bg-white/95 px-3.5 py-2.5 text-[11px] font-bold tracking-[0.14em] text-encre uppercase shadow-[0_4px_12px_rgb(16_24_40/0.14)]">
                  {t.cat}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
