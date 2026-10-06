import type { ReactNode } from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { infosLegales } from "@/lib/data";

type LegalPageProps = {
  label: string;
  titre: string;
  children: ReactNode;
};

/** Mise en page des pages légales : en-tête bleu puis colonne de lecture. */
export default function LegalPage({ label, titre, children }: LegalPageProps) {
  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden bg-hero-vovinam px-7 pt-42 pb-16">
          <div className="mx-auto flex max-w-[1360px] flex-col gap-5">
            <span className="inline-flex items-center gap-2.5 self-start rounded-full border border-white/30 bg-white/15 px-4 py-2.5 text-xs font-semibold tracking-[0.16em] text-white uppercase">
              <span className="size-1.5 rounded-full bg-jaune" />
              {label}
            </span>
            <h1 className="max-w-[760px] font-display text-4xl leading-[1.02] font-extrabold tracking-[-0.03em] text-balance text-white lg:text-6xl">
              {titre}
            </h1>
          </div>
        </section>

        <section className="bg-white px-4 py-16 md:px-7 lg:py-24">
          <article className="mx-auto flex max-w-[760px] flex-col gap-4 text-[1.02rem] leading-[1.75] text-[#4c5674] [&_a]:font-semibold [&_a]:text-vovinam [&_a]:underline-offset-4 hover:[&_a]:underline [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:tracking-tight [&_h2]:text-encre [&_li]:pl-1 [&_strong]:text-encre [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6">
            <p className="text-sm text-encre-30">
              Dernière mise à jour : {infosLegales.dateMiseAJour}
            </p>
            {children}
          </article>
        </section>
      </main>
      <Footer />
    </>
  );
}
