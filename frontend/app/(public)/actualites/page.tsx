import Link from "next/link";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Badge from "@/components/Badge/Badge";
import Photo from "@/components/Photo/Photo";
import Reveal from "@/components/Reveal/Reveal";
import type { Metadata } from "next";
import { actualites } from "@/lib/data";

export const metadata: Metadata = { title: "Actualités — Vovinam Viet Vo Dao" };

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden bg-hero-vovinam px-7 pt-40 pb-16">
          <div className="absolute inset-x-0 top-0 flex h-1">
            <span className="flex-1 bg-vovinam" />
            <span className="w-30 bg-jaune" />
            <span className="w-15 bg-rouge" />
          </div>
          <div className="mx-auto max-w-[1360px]">
            <span className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-white/15 px-4 py-2.5 text-xs font-semibold tracking-[0.16em] text-white uppercase">
              <span className="size-1.5 rounded-full bg-jaune" />
              Actualités
            </span>
            <h1 className="font-display text-4xl leading-[1.02] font-extrabold tracking-[-0.03em] text-balance text-white lg:text-6xl">
              LA VIE DU CLUB,
              <br />
              <span className="text-jaune">AU FIL DES SAISONS.</span>
            </h1>
          </div>
        </section>

        <section className="bg-white py-16 lg:py-24">
          <div className="mx-auto flex max-w-[1360px] flex-wrap gap-6 px-2 md:px-7">
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
                  <h2 className="font-display text-xl leading-snug font-extrabold text-encre">
                    {a.titre}
                  </h2>
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
        </section>
      </main>
      <Footer />
    </>
  );
}
