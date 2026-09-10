"use client";

import { useMemo, useState } from "react";
import Topbar from "@/components/admin/Topbar";
import { useMenu } from "@/components/admin/menu-context";
import { adherents, type Adherent } from "@/lib/data";

const categories = ["Tous", "Enfants", "Adolescents", "Adultes"];
const carte = "rounded-card border border-trait bg-white shadow-card";

type Kpi = { label: string; valeur: string; alerte?: boolean };

const kpis: Kpi[] = [
  { label: "Licenciés", valeur: "128" },
  { label: "Cotisations à jour", valeur: "112" },
  { label: "En attente de paiement", valeur: "11" },
  { label: "Certificat médical manquant", valeur: "5", alerte: true },
];

function initiales(m: Pick<Adherent, "nom" | "prenom">): string {
  return (m.prenom[0] + m.nom[0]).toUpperCase();
}

export default function Page() {
  const { ouvrir } = useMenu();
  const [query, setQuery] = useState("");
  const [categorie, setCategorie] = useState("Tous");
  const [selection, setSelection] = useState(0);

  const lignes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return adherents
      .map((m, i) => ({ ...m, index: i }))
      .filter((m) => categorie === "Tous" || m.categorie === categorie)
      .filter(
        (m) =>
          !q ||
          (m.nom + " " + m.prenom + " " + m.licence).toLowerCase().includes(q),
      );
  }, [query, categorie]);

  const sel = adherents[selection];

  return (
    <>
      <Topbar
        surtitre="Administration"
        titre="Adhérents"
        onMenu={ouvrir}
        actions={
          <>
            <button
              type="button"
              className="hidden h-11.5 cursor-pointer items-center rounded-xl border-[1.5px] border-[#e1e7f5] bg-white px-4.5 text-[0.92rem] font-bold text-encre-70 hover:border-vovinam sm:inline-flex"
            >
              Exporter CSV
            </button>
            <button
              type="button"
              className="inline-flex h-11.5 cursor-pointer items-center gap-2 rounded-xl bg-vovinam px-5 text-[0.92rem] font-bold text-white transition-all hover:-translate-y-0.5"
            >
              + Nouvel adhérent
            </button>
          </>
        }
      />

      <div className="flex flex-col gap-5 p-2 lg:p-8">
        <div className="flex flex-wrap gap-4.5">
          {kpis.map((k) => (
            <div
              key={k.label}
              className={[
                "flex min-w-[190px] flex-1 flex-col gap-2 p-5.5",
                carte,
              ].join(" ")}
            >
              <span className="text-[11px] font-semibold tracking-[0.14em] text-encre-30 uppercase">
                {k.label}
              </span>
              <span
                className={[
                  "font-display text-4xl leading-none font-extrabold tracking-tight",
                  k.alerte ? "text-rouge" : "text-encre",
                ].join(" ")}
              >
                {k.valeur}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-start gap-5">
          <section
            className={[
              "min-w-[320px] flex-[2.2_1_620px] overflow-hidden",
              carte,
            ].join(" ")}
          >
            <div className="flex flex-wrap items-center gap-3 border-b border-[#f1f4fb] px-5.5 py-5">
              <label className="relative flex min-w-[240px] flex-1 items-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="absolute left-3.5 text-encre-30"
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
                  placeholder="Nom, prénom ou n° de licence…"
                  className="h-11.5 w-full rounded-field border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] pr-4 pl-10 text-[0.95rem] text-encre outline-none focus:border-vovinam focus:ring-4 focus:ring-vovinam/10"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategorie(c)}
                    className={[
                      "cursor-pointer rounded-full border-[1.5px] px-4 py-3 text-[0.86rem] font-semibold transition-all",
                      categorie === c
                        ? "border-vovinam bg-vovinam text-white"
                        : "border-[#e1e7f5] bg-white text-encre-70",
                    ].join(" ")}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden items-center gap-3.5 border-b border-[#eff3fb] bg-[#fafbff] px-5.5 py-3.5 md:flex">
              <span className="flex-[2_1_200px] text-[10px] font-bold tracking-[0.14em] text-encre-30 uppercase">
                Adhérent
              </span>
              <span className="flex-[1_1_120px] text-[10px] font-bold tracking-[0.14em] text-encre-30 uppercase">
                N° licence
              </span>
              <span className="flex-[1_1_130px] text-[10px] font-bold tracking-[0.14em] text-encre-30 uppercase">
                Grade
              </span>
              <span className="w-27 flex-none text-[10px] font-bold tracking-[0.14em] text-encre-30 uppercase">
                Cotisation
              </span>
            </div>

            {lignes.map((m) => {
              const attente = m.statut !== "À jour";
              return (
                <button
                  key={m.licence}
                  type="button"
                  onClick={() => setSelection(m.index)}
                  className={[
                    "flex w-full flex-wrap items-center gap-3.5 border-b border-[#f5f7fc] px-5.5 py-4 text-left transition-colors last:border-0",
                    m.index === selection
                      ? "bg-vovinam-050"
                      : "bg-white hover:bg-[#f8faff]",
                  ].join(" ")}
                >
                  <span className="flex min-w-0 flex-[2_1_200px] items-center gap-3">
                    <span className="flex size-10 flex-none items-center justify-center rounded-xl bg-[#e9eeff] font-display text-[0.8rem] font-extrabold text-vovinam">
                      {initiales(m)}
                    </span>
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="text-[0.96rem] leading-tight font-bold text-encre">
                        {m.nom.toUpperCase()} {m.prenom}
                      </span>
                      <span className="text-[0.82rem] text-encre-30">
                        {m.categorie} · {m.naissance}
                      </span>
                    </span>
                  </span>
                  <span className="flex-[1_1_120px] font-mono text-[0.9rem] text-encre-70">
                    {m.licence}
                  </span>
                  <span className="flex flex-[1_1_130px] items-center gap-2.5">
                    <span
                      className="h-2 w-5.5 flex-none rounded-sm border border-encre/10"
                      style={{ background: m.couleur }}
                    />
                    <span className="text-[0.88rem] font-semibold text-encre-70">
                      {m.grade}
                    </span>
                  </span>
                  <span className="w-27 flex-none">
                    <span
                      className={[
                        "inline-flex rounded-md px-3 py-2 text-[0.78rem] font-bold tracking-wide uppercase",
                        attente
                          ? "bg-[#fff6da] text-[#8a6a00]"
                          : "bg-[#e9f8ee] text-[#0e7a3c]",
                      ].join(" ")}
                    >
                      {m.statut}
                    </span>
                  </span>
                </button>
              );
            })}

            <div className="flex flex-wrap items-center gap-3 px-5.5 py-4.5">
              <span className="mr-auto text-[0.88rem] text-encre-30">
                {lignes.length} adhérent{lignes.length > 1 ? "s" : ""} affiché
                {lignes.length > 1 ? "s" : ""} sur {adherents.length}
              </span>
              <button
                type="button"
                className="cursor-pointer rounded-lg border border-[#e7ecf7] bg-[#f6f8fe] px-4 py-2.5 text-[0.86rem] font-semibold text-encre-70"
              >
                Précédent
              </button>
              <button
                type="button"
                className="cursor-pointer rounded-lg border border-[#e7ecf7] bg-[#f6f8fe] px-4 py-2.5 text-[0.86rem] font-semibold text-encre-70"
              >
                Suivant
              </button>
            </div>
          </section>

          <aside
            className={[
              "min-w-[300px] flex-1 overflow-hidden lg:sticky lg:top-24",
              carte,
            ].join(" ")}
          >
            <div className="flex items-center gap-3.5 bg-vovinam px-6 pt-6 pb-5 text-white">
              <span className="flex size-13 flex-none items-center justify-center rounded-2xl border border-white/25 bg-white/15 font-display text-base font-extrabold text-jaune">
                {initiales(sel)}
              </span>
              <span className="flex min-w-0 flex-col gap-1.5">
                <span className="font-display text-lg leading-tight font-extrabold tracking-tight">
                  {sel.nom.toUpperCase()} {sel.prenom}
                </span>
                <span className="text-[0.84rem] font-medium text-white/80">
                  Licence {sel.licence}
                </span>
              </span>
            </div>

            <div className="flex flex-col gap-4 px-6 py-5.5">
              <div className="flex flex-wrap gap-3">
                {[
                  ["Nom", sel.nom],
                  ["Prénom", sel.prenom],
                  ["Date de naissance", sel.naissance],
                  ["Catégorie", sel.categorie],
                ].map(([k, v]) => (
                  <span
                    key={k}
                    className="flex min-w-[130px] flex-1 flex-col gap-1.5"
                  >
                    <span className="text-[10px] font-bold tracking-[0.14em] text-encre-30 uppercase">
                      {k}
                    </span>
                    <span className="text-[0.96rem] leading-snug font-semibold text-encre">
                      {v}
                    </span>
                  </span>
                ))}
              </div>
              <span className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold tracking-[0.14em] text-encre-30 uppercase">
                  Grade
                </span>
                <span className="text-[0.96rem] leading-snug font-semibold text-encre">
                  {sel.grade} — obtenu le {sel.dateGrade}
                </span>
              </span>
              <span className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold tracking-[0.14em] text-encre-30 uppercase">
                  Contact
                </span>
                <span className="text-[0.94rem] leading-relaxed text-encre-70">
                  {sel.email}
                  <br />
                  {sel.telephone}
                </span>
              </span>
              <span className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold tracking-[0.14em] text-encre-30 uppercase">
                  Adresse
                </span>
                <span className="text-[0.94rem] leading-relaxed text-encre-70">
                  {sel.adresse}
                </span>
              </span>
              <div className="flex flex-wrap gap-2.5 border-t border-[#f1f4fb] pt-3">
                {[
                  "Cotisation : " + sel.statut,
                  "Certificat : " + sel.certificat,
                  "Assurance : " + sel.assurance,
                ].map((t) => (
                  <span
                    key={t}
                    className="rounded-lg bg-[#f4f7fe] px-3 py-2.5 text-[0.78rem] font-bold tracking-wide text-encre-70 uppercase"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-1 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  className="min-w-[130px] flex-1 cursor-pointer rounded-xl bg-vovinam px-4.5 py-4 text-[0.9rem] font-bold text-white transition-transform hover:-translate-y-0.5"
                >
                  Modifier la fiche
                </button>
                <button
                  type="button"
                  className="min-w-[130px] flex-1 cursor-pointer rounded-xl border-[1.5px] border-[#e1e7f5] bg-white px-4.5 py-4 text-[0.9rem] font-bold text-encre-70 hover:border-vovinam"
                >
                  Envoyer un email
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
