import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { actualites } from "@/lib/data";

export default function News() {
  return (
    <section id="articles" className="bg-white py-20 lg:py-30">
      <div className="mx-auto max-w-[1360px] px-2 md:px-7">
        <SectionTitle
          label="Actualités du club"
          titre="Dernières actualités"
          accent="bg-vovinam"
        />
        <div className="flex flex-wrap gap-6">
          {actualites.map((a, i) => (
            <Reveal
              key={a.slug}
              delay={i * 70}
              className="group flex min-w-[300px] flex-1 flex-col overflow-hidden rounded-card border border-trait bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
            >
              <div className="relative">
                <Photo label={"photo — " + a.photo} className="h-52" zoom />
                <Badge variant={a.badge} className="absolute top-4 left-4">
                  {a.categorie}
                </Badge>
              </div>
              <div className="flex flex-1 flex-col gap-2.5 px-6.5 pt-6 pb-7">
                <span className="text-xs font-semibold tracking-[0.12em] text-encre-30 uppercase">
                  {a.date}
                </span>
                <h3 className="font-display text-xl leading-snug font-extrabold text-encre">
                  {a.titre}
                </h3>
                <p className="text-[0.96rem] leading-relaxed text-encre-50">
                  {a.chapo}
                </p>
                <Link
                  href={"/actualites/" + a.slug}
                  className="mt-auto pt-2.5 text-sm font-bold text-vovinam"
                >
                  Lire l'article →
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-11 flex justify-center">
          <Link
            href="/actualites"
            className="rounded-full border-[1.5px] border-[#dce4f7] px-7 py-4.5 text-[15px] font-bold text-vovinam transition-colors hover:border-vovinam hover:bg-vovinam-050"
          >
            Voir toutes les actualités
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
