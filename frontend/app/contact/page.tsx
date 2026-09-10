import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import ContactForm from "@/components/site/ContactForm";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import type { Metadata } from "next";
import Button from "@/components/ui/Button";

export const metadata: Metadata = { title: "Contact — Vovinam Viet Vo Dao" };

type Info = { label: string; valeur: string; note?: string; fond: string };

const infos: Info[] = [
  {
    label: "Adresse",
    valeur: "Gymnase Jean-Moulin\n12 rue des Sports\n94400 Sevran",
    fond: "bg-vovinam-100",
  },
  {
    label: "Email",
    valeur: "contact@vovinam-association.fr",
    note: "Réponse sous 48 h ouvrées.",
    fond: "bg-[#fffde0]",
  },
  {
    label: "Téléphone",
    valeur: "01 00 00 00 00",
    fond: "bg-[#ffecec]",
  },
  {
    label: "Horaires des cours",
    valeur: "Lun. & ven. 19:00 — 22:25\nSam. 14:30 — 16:00\n",
    fond: "bg-vovinam-100",
  },
];

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden bg-hero-vovinam px-7 pt-42 pb-16">
          <div className="absolute inset-x-0 top-0 flex h-1">
            <span className="flex-1 bg-vovinam" />
            <span className="w-30 bg-jaune" />
            <span className="w-15 bg-rouge" />
          </div>
          <div className="mx-auto flex max-w-[1360px] flex-col gap-5">
            <span className="inline-flex self-start items-center gap-2.5 rounded-full border border-white/30 bg-white/15 px-4 py-2.5 text-xs font-semibold tracking-[0.16em] text-white uppercase">
              <span className="size-1.5 rounded-full bg-jaune" />
              Contact
            </span>
            <h1 className="max-w-[760px] font-display text-4xl leading-[1.02] font-extrabold tracking-[-0.03em] text-balance text-white lg:text-6xl">
              NOUS ÉCRIRE,
              <br />
              <span className="text-jaune">NOUS RENCONTRER.</span>
            </h1>
            <p className="max-w-[560px] text-lg leading-relaxed text-pretty text-white/85">
              Une question sur les cours, les inscriptions ou un cours d'essai ?
              Écrivez-nous, nous répondons sous 48 heures.
            </p>
          </div>
        </section>

        <section className="bg-white px-2 md:px-7 py-16">
          <div className="mx-auto flex max-w-[1360px] flex-wrap gap-5">
            {infos.map((i) => (
              <Reveal
                key={i.label}
                className="flex min-w-[240px] flex-1 flex-col gap-2.5 rounded-3xl border border-trait bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <span
                  className={[
                    "mb-1.5 flex size-10.5 items-center justify-center rounded-xl",
                    i.fond,
                  ].join(" ")}
                >
                  <span className="size-4 rounded bg-vovinam" />
                </span>
                <span className="text-[11px] font-bold tracking-[0.16em] text-encre-30 uppercase">
                  {i.label}
                </span>
                <span className="text-[1.02rem] leading-relaxed font-semibold whitespace-pre-line text-encre">
                  {i.valeur}
                </span>
                {i.note ? (
                  <span className="text-[0.92rem] text-[#6a7392]">
                    {i.note}
                  </span>
                ) : null}
              </Reveal>
            ))}
          </div>
        </section>

        <section
          id="formulaire"
          className="bg-vovinam-050 px-2 md:px-7 py-16 lg:py-28"
        >
          <div className="mx-auto flex max-w-[1360px] flex-wrap items-start gap-8 lg:gap-14">
            <ContactForm />
            <div className="flex min-w-[300px] flex-1 flex-col gap-5">
              <Reveal className="relative min-h-75 overflow-hidden rounded-3xl border border-[#e1e7f5]">
                <Photo
                  label="carte — accès au gymnase"
                  className="absolute inset-0"
                />
              </Reveal>
              <Reveal className="flex flex-col gap-3.5 rounded-3xl bg-vovinam p-8 text-white">
                <span className="inline-flex items-center gap-2.5 text-[11px] font-bold tracking-[0.2em] text-jaune uppercase">
                  <span className="h-0.5 w-6 bg-jaune" />
                  Premier contact
                </span>
                <h3 className="font-display text-2xl leading-tight font-extrabold tracking-tight">
                  Venir voir un cours
                </h3>
                <p className="leading-relaxed text-white/85">
                  Vous pouvez aussi passer directement au gymnase pendant un
                  créneau : une tenue de sport suffit, le premier cours est
                  offert.
                </p>
                <Button
                  href="/#cours"
                  variant="jaune"
                  className="mt-1.5 self-start"
                >
                  Voir les horaires
                </Button>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
