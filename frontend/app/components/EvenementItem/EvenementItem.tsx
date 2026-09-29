"use client";

import { useId, useState } from "react";
import Badge from "@/components/Badge/Badge";
import Reveal from "@/components/Reveal/Reveal";
import { typesEvenement } from "@/lib/data";
import {
  dateLongue,
  horaire,
  icsUrl,
  pastilleDate,
  type EvenementPublic,
} from "@/lib/api/evenements";
import { carteEmbedUrl, carteUrl, itineraireUrl } from "@/lib/api/adresses";

type EvenementItemProps = {
  evenement: EvenementPublic;
  delay?: number;
};

export default function EvenementItem({
  evenement: e,
  delay = 0,
}: EvenementItemProps) {
  const [ouvert, setOuvert] = useState(false);
  const idDetails = useId();
  const { jour, mois } = pastilleDate(e);
  const type = typesEvenement[e.type];
  const aDesDetails = Boolean(e.description || e.adresse);
  const aUnePosition = e.latitude !== null && e.longitude !== null;

  return (
    <Reveal
      delay={delay}
      className="flex flex-col rounded-3xl border border-[#e8edf8] bg-white px-6.5 py-5.5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgb(16_24_40/0.12)]"
    >
      <div className="flex flex-wrap items-center gap-5 lg:gap-9">
        <div
          className="flex size-23 flex-none flex-col items-center justify-center rounded-2xl bg-vovinam text-white"
          aria-label={dateLongue(e)}
          title={dateLongue(e)}
        >
          <span
            className={[
              "font-display leading-none font-extrabold tracking-tight",
              jour.length > 2 ? "text-xl" : "text-3xl",
            ].join(" ")}
          >
            {jour}
          </span>
          <span className="mt-1 text-[11px] font-bold tracking-[0.18em]">
            {mois}
          </span>
        </div>
        <div className="flex min-w-[240px] flex-1 flex-col gap-2">
          <Badge variant={type.badge} className="self-start">
            {type.label}
          </Badge>
          <h3 className="font-display text-xl leading-snug font-extrabold tracking-tight text-encre">
            {e.titre}
          </h3>
          {e.lieu ? (
            <span className="text-[0.95rem] text-[#6a7392]">{e.lieu}</span>
          ) : null}
        </div>
        <span className="flex-none text-[0.98rem] font-semibold text-encre-70">
          {horaire(e)}
        </span>
        <div className="flex flex-none items-center gap-2.5">
          <a
            href={icsUrl(e.id)}
            download
            title="Ajouter à mon calendrier"
            aria-label={`Ajouter « ${e.titre} » à mon calendrier`}
            className="flex size-12 items-center justify-center rounded-full border-[1.5px] border-[#dce4f7] bg-white text-vovinam transition-colors hover:border-vovinam"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">
              <rect
                x="3.5"
                y="5"
                width="17"
                height="15.5"
                rx="3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M3.5 10h17M8 3v4M16 3v4M12 12.5v5M9.5 15h5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </a>
          {aDesDetails ? (
            <button
              type="button"
              onClick={() => setOuvert((o) => !o)}
              aria-expanded={ouvert}
              aria-controls={idDetails}
              className="cursor-pointer rounded-full bg-vovinam px-6 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              {ouvert ? "Masquer" : "Détails"}
            </button>
          ) : null}
        </div>
      </div>
      {aDesDetails ? (
        <div
          id={idDetails}
          hidden={!ouvert}
          className="mt-5 flex flex-wrap gap-6 border-t border-[#eff3fb] pt-4.5"
        >
          <div className="flex min-w-[260px] flex-[1.4_1_360px] flex-col gap-3">
            <p className="text-[0.84rem] font-semibold tracking-[0.08em] text-encre-30 uppercase">
              {dateLongue(e)} · {horaire(e)}
            </p>
            {e.description ? (
              <p className="max-w-[760px] text-[1rem] leading-relaxed whitespace-pre-line text-encre-70">
                {e.description}
              </p>
            ) : null}
            {e.adresse ? (
              <div className="flex flex-col gap-3">
                <p className="flex items-start gap-2 text-[0.96rem] text-encre">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="mt-0.5 flex-none text-vovinam"
                  >
                    <path
                      d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <circle cx="12" cy="10" r="2.4" fill="currentColor" />
                  </svg>
                  <span>
                    {e.lieu ? (
                      <span className="font-semibold">{e.lieu} — </span>
                    ) : null}
                    {e.adresse}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2.5">
                  <a
                    href={itineraireUrl(e.adresse)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full bg-vovinam px-5 py-3 text-[0.88rem] font-bold text-white transition-transform hover:-translate-y-0.5"
                  >
                    Itinéraire
                  </a>
                  {aUnePosition ? (
                    <a
                      href={carteUrl(e.latitude!, e.longitude!)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full border-[1.5px] border-[#dce4f7] bg-white px-5 py-3 text-[0.88rem] font-bold text-vovinam transition-colors hover:border-vovinam"
                    >
                      Agrandir la carte
                    </a>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
          {/* La carte n'est chargée qu'à l'ouverture des détails. */}
          {ouvert && aUnePosition ? (
            <iframe
              title={`Carte — ${e.lieu ?? e.adresse}`}
              src={carteEmbedUrl(e.latitude!, e.longitude!)}
              loading="lazy"
              className="h-56 min-w-[260px] flex-[1_1_320px] rounded-2xl border border-trait"
            />
          ) : null}
        </div>
      ) : null}
    </Reveal>
  );
}
