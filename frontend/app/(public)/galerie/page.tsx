import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid/GalleryGrid";

export const metadata: Metadata = { title: "Galerie — Vovinam Viet Vo Dao" };

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
          <div className="mx-auto flex max-w-[1360px] flex-col gap-4">
            <span className="inline-flex self-start items-center gap-2.5 rounded-full border border-white/30 bg-white/15 px-4 py-2.5 text-xs font-semibold tracking-[0.16em] text-white uppercase">
              <span className="size-1.5 rounded-full bg-jaune" />
              Galerie
            </span>
            <h1 className="font-display text-4xl leading-[1.02] font-extrabold tracking-[-0.03em] text-balance text-white lg:text-6xl">
              LA VIE DU CLUB
              <br />
              <span className="text-jaune">EN IMAGES.</span>
            </h1>
            <p className="max-w-[560px] text-lg leading-relaxed text-pretty text-white/85">
              Entraînements, stages, compétitions et moments partagés au dojo.
            </p>
          </div>
        </section>
        <GalleryGrid />
      </main>
      <Footer />
    </>
  );
}
