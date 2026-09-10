"use client";

import { useMemo, useState } from "react";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import { categoriesGalerie, photos } from "@/lib/data";

export default function GalleryGrid() {
  const [query, setQuery] = useState("");
  const [filtre, setFiltre] = useState("Tous");

  const resultats = useMemo(() => {
    const q = query.trim().toLowerCase();
    return photos
      .filter((p) => filtre === "Tous" || p.categorie === filtre)
      .filter(
        (p) =>
          !q ||
          (p.titre + " " + p.categorie + " " + p.date)
            .toLowerCase()
            .includes(q),
      );
  }, [query, filtre]);

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-trait bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center gap-3.5 px-2  md:px-7 py-4">
          <label className="relative flex max-w-[380px] min-w-[240px] flex-1 items-center">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="absolute left-4 text-encre-30"
            >
              <circle
                cx="11"
                cy="11"
                r="6.6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
              />
              <path
                d="m16 16 4.4 4.4"
                stroke="currentColor"
                strokeWidth="1.9"
              />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une photo, un lieu, une date…"
              className="h-12.5 w-full rounded-2xl border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] pr-4 pl-10.5 text-[0.96rem] text-encre outline-none focus:border-vovinam focus:ring-4 focus:ring-vovinam/10"
            />
          </label>

          <div className="mr-auto flex flex-wrap gap-2">
            {categoriesGalerie.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFiltre(c)}
                className={[
                  "cursor-pointer rounded-full border-[1.5px] px-4.5 py-3 text-[0.88rem] font-semibold transition-all duration-200",
                  filtre === c
                    ? "border-vovinam bg-vovinam text-white"
                    : "border-[#e1e7f5] bg-white text-encre-70 hover:border-vovinam hover:text-vovinam",
                ].join(" ")}
              >
                {c}
              </button>
            ))}
          </div>

          <span className="text-[0.88rem] font-semibold text-encre-30 pl-2">
            {resultats.length} photo{resultats.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <section className="bg-white pt-10 pb-20 lg:pb-28">
        <div className="mx-auto max-w-[1360px] px-2 md:px-7">
          <div className="flex flex-wrap gap-5">
            {resultats.map((p, i) => (
              <Reveal
                key={p.id}
                delay={(i % 6) * 70}
                className="group relative h-75 min-w-[300px] flex-1 overflow-hidden rounded-card border border-trait shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
              >
                <Photo
                  label={"photo — " + p.titre}
                  className="absolute inset-0"
                  zoom
                />
                <span className="pointer-events-none absolute top-3.5 left-3.5 rounded-lg bg-white/95 px-3 py-2.5 text-[10px] font-bold tracking-[0.14em] text-encre uppercase shadow-[0_4px_12px_rgb(16_24_40/0.14)]">
                  {p.categorie}
                </span>
                <span className="pointer-events-none absolute bottom-3.5 left-3.5 flex flex-col items-start gap-1.5">
                  <span className="rounded-lg bg-white/95 px-3.5 py-2.5 text-[0.95rem] font-bold text-encre shadow-[0_4px_12px_rgb(16_24_40/0.14)]">
                    {p.titre}
                  </span>
                  <span className="rounded-md bg-white/85 px-2.5 py-1.5 text-[0.78rem] font-medium text-encre-70">
                    {p.date}
                  </span>
                </span>
              </Reveal>
            ))}
          </div>

          {resultats.length === 0 ? (
            <div className="flex flex-col items-center gap-2.5 px-6 py-16 text-center">
              <span className="font-display text-xl font-extrabold text-encre">
                Aucune photo ne correspond
              </span>
              <span className="text-encre-50">
                Essayez un autre mot-clé ou retirez les filtres.
              </span>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFiltre("Tous");
                }}
                className="mt-2 cursor-pointer rounded-full bg-vovinam px-6 py-3.5 text-[0.92rem] font-bold text-white"
              >
                Réinitialiser
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
