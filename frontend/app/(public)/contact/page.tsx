import Image from "next/image";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ContactForm, { MOTIF_ESSAI } from "@/components/ContactForm/ContactForm";
import Reveal from "@/components/Reveal/Reveal";
import type { Metadata } from "next";
import Button from "@/components/Button/Button";
import { carteEmbedUrl, carteUrl } from "@/lib/api/adresses";

export const metadata: Metadata = { title: "Contact — Vovinam Viet Vo Dao" };

const GYMNASE = { lat: 48.9399852, lon: 2.5338027 };

type Info = {
  label: string;
  valeur: string;
  note?: string;
  fond: string;
  icone: string;
};

const infos: Info[] = [
  {
    label: "Adresse",
    valeur:
      "Gymnase Gaston bussière \n134 Rue Gabriel Péri\n93270 Sevran \n Salle Verte\n",
    fond: "bg-vovinam-100",
    icone: "/icons/location.svg",
  },
  {
    label: "Email",
    valeur: "contact@vovinam-association.fr",
    note: "Réponse sous 48 h ouvrées.",
    fond: "bg-[#fffde0]",
    icone: "/icons/email.svg",
  },
  {
    label: "Téléphone",
    valeur: "XX XX XX XX XX",
    fond: "bg-[#ffecec]",
    icone: "/icons/phone.svg",
  },
  {
    label: "Horaires des cours",
    valeur: "Lun. & ven. 19:00 — 22:25\nSam. 14:30 — 16:00\n",
    fond: "bg-vovinam-100",
    icone: "/icons/clock.svg",
  },
];

type SearchParams = { motif?: string | string[] };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { motif } = await searchParams;
  const motifInitial = motif === "essai" ? MOTIF_ESSAI : undefined;

  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden bg-hero-vovinam px-7 pt-42 pb-16">
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
              Une question sur les cours, les inscriptions ou un cours
              d&apos;essai ? Écrivez-nous, nous répondons sous 48 heures.
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
                  <Image src={i.icone} alt="" width={24} height={24} />
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
            <ContactForm motifInitial={motifInitial} />
            <div className="flex min-w-[300px] flex-1 flex-col gap-5">
              <Reveal className="relative min-h-75 overflow-hidden rounded-3xl border border-[#e1e7f5]">
                <iframe
                  src={carteEmbedUrl(GYMNASE.lat, GYMNASE.lon)}
                  title="Plan d'accès au gymnase Gaston Bussière"
                  loading="lazy"
                  className="absolute inset-0 size-full border-0"
                />
                <a
                  href={carteUrl(GYMNASE.lat, GYMNASE.lon)}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute right-3 bottom-3 rounded-full bg-white px-4 py-2 text-sm font-bold text-vovinam shadow-card hover:bg-vovinam-050"
                >
                  Agrandir la carte ↗
                </a>
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
