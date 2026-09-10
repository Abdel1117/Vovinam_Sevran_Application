"use client";

import Link from "next/link";
import Topbar from "@/components/admin/Topbar";
import { useMenu } from "@/components/admin/menu-context";
import { evenements } from "@/lib/data";

type Kpi = {
  label: string;
  valeur: string;
  note?: string;
  badge?: string;
  ton?: "vert";
  bleu?: boolean;
};

type Publication = {
  titre: string;
  meta: string;
  cat: string;
  catClass: string;
  statut: string;
  point: string;
  statutClass: string;
};

const kpis: Kpi[] = [
  {
    label: "Adhérents actifs",
    valeur: "128",
    note: "+ 12 depuis la rentrée",
    ton: "vert",
  },
  { label: "Cours d'essai à traiter", valeur: "7", badge: "À rappeler" },
  {
    label: "Événements à venir",
    valeur: "4",
    note: "Prochain : stage régional, 14 sep.",
  },
  {
    label: "Brouillons",
    valeur: "3",
    note: "Articles en attente de publication.",
    bleu: true,
  },
];

const publications: Publication[] = [
  {
    titre: "Nouvelle saison, nouvelles inscriptions",
    meta: "Publié le 02 sep. 2026 — Minh Trân",
    cat: "Association",
    catClass: "bg-vovinam text-white",
    statut: "En ligne",
    point: "bg-[#0e7a3c]",
    statutClass: "text-[#0e7a3c]",
  },
  {
    titre: "Retour sur notre dernier stage",
    meta: "Publié le 21 août 2026 — Claire Nguyen",
    cat: "Stage",
    catClass: "bg-jaune text-encre",
    statut: "En ligne",
    point: "bg-[#0e7a3c]",
    statutClass: "text-[#0e7a3c]",
  },
  {
    titre: "Résultats de l'Open de Paris",
    meta: "Brouillon — Karim Belhadj",
    cat: "Compétition",
    catClass: "bg-rouge text-white",
    statut: "Brouillon",
    point: "bg-[#e0b400]",
    statutClass: "text-[#8a6a00]",
  },
  {
    titre: "Passage de grades — session d'octobre",
    meta: "Programmé pour le 05 oct. 2026",
    cat: "Vie du club",
    catClass: "bg-vovinam-100 text-vovinam",
    statut: "Planifié",
    point: "bg-encre-30",
    statutClass: "text-encre-70",
  },
];

const repartition: {
  label: string;
  n: number;
  pct: number;
  couleur: string;
}[] = [
  { label: "Enfants", n: 42, pct: 33, couleur: "bg-vovinam" },
  { label: "Adolescents", n: 31, pct: 24, couleur: "bg-vovinam" },
  { label: "Adultes", n: 48, pct: 38, couleur: "bg-vovinam" },
  { label: "Encadrants", n: 7, pct: 6, couleur: "bg-jaune" },
];

const demandes: { nom: string; meta: string; tel: string }[] = [
  {
    nom: "Lucas Mercier",
    meta: "Adultes · reçu le 27 août",
    tel: "06 12 00 00 00",
  },
  {
    nom: "Sarah Benali",
    meta: "Enfants (8 ans) · reçu le 26 août",
    tel: "06 34 00 00 00",
  },
  {
    nom: "Thomas Nguyen",
    meta: "Adolescents · reçu le 24 août",
    tel: "07 55 00 00 00",
  },
];

const carte = "rounded-card border border-trait bg-white shadow-card";

export default function Page() {
  const { ouvrir } = useMenu();

  return (
    <>
      <Topbar
        surtitre="Administration"
        titre="Tableau de bord"
        onMenu={ouvrir}
        actions={
          <Link
            href="/admin/articles/nouveau"
            className="inline-flex h-11.5 items-center gap-2 rounded-xl bg-vovinam px-5 text-[0.92rem] font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgb(24_81_217/0.28)]"
          >
            + Nouvelle publication
          </Link>
        }
      />

      <div className="flex flex-col gap-5.5 p-2 lg:p-8">
        <div className="flex flex-wrap gap-4.5">
          {kpis.map((k) => (
            <div
              key={k.label}
              className={[
                "flex min-w-[210px] flex-1 flex-col gap-2.5 rounded-3xl p-6",
                k.bleu ? "bg-vovinam text-white" : carte,
              ].join(" ")}
            >
              <span
                className={[
                  "text-[11px] font-semibold tracking-[0.14em] uppercase",
                  k.bleu ? "text-jaune" : "text-encre-30",
                ].join(" ")}
              >
                {k.label}
              </span>
              <span className="font-display text-4xl leading-none font-extrabold tracking-tight">
                {k.valeur}
              </span>
              {k.badge ? (
                <span className="self-start rounded-md bg-jaune px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] text-encre uppercase">
                  {k.badge}
                </span>
              ) : null}
              {k.note ? (
                <span
                  className={[
                    "text-[0.86rem] leading-snug",
                    k.ton === "vert"
                      ? "font-semibold text-[#0e7a3c]"
                      : k.bleu
                        ? "text-white/80"
                        : "text-[#6a7392]",
                  ].join(" ")}
                >
                  {k.note}
                </span>
              ) : null}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-start gap-5">
          <section
            className={[
              "min-w-[320px] flex-[2_1_560px] overflow-hidden",
              carte,
            ].join(" ")}
          >
            <div className="flex flex-wrap items-center gap-3 border-b border-[#f1f4fb] px-6 py-5.5">
              <h2 className="mr-auto font-display text-lg font-extrabold text-encre">
                Publications récentes
              </h2>
              <Link
                href="/admin/articles/nouveau"
                className="text-[0.86rem] font-bold text-vovinam"
              >
                Tout gérer →
              </Link>
            </div>
            {publications.map((p) => (
              <div
                key={p.titre}
                className="flex flex-wrap items-center gap-3.5 border-b border-[#f5f7fc] px-6 py-4.5 last:border-0"
              >
                <span className="flex min-w-[220px] flex-1 flex-col gap-1.5">
                  <span className="text-[0.98rem] leading-snug font-bold text-encre">
                    {p.titre}
                  </span>
                  <span className="text-[0.84rem] text-encre-30">{p.meta}</span>
                </span>
                <span
                  className={[
                    "rounded-md px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] uppercase",
                    p.catClass,
                  ].join(" ")}
                >
                  {p.cat}
                </span>
                <span
                  className={[
                    "inline-flex items-center gap-2 text-[0.84rem] font-semibold",
                    p.statutClass,
                  ].join(" ")}
                >
                  <span
                    className={["size-1.5 rounded-full", p.point].join(" ")}
                  />
                  {p.statut}
                </span>
                <button
                  type="button"
                  className="cursor-pointer rounded-lg border border-[#e7ecf7] bg-[#f6f8fe] px-3.5 py-2.5 text-[0.84rem] font-semibold text-encre-70 hover:bg-vovinam-100"
                >
                  Modifier
                </button>
              </div>
            ))}
          </section>

          <div className="flex min-w-[300px] flex-1 flex-col gap-5">
            <section className={["overflow-hidden", carte].join(" ")}>
              <div className="border-b border-[#f1f4fb] px-5.5 py-5">
                <h2 className="font-display text-lg font-extrabold text-encre">
                  Prochains événements
                </h2>
              </div>
              {evenements.slice(0, 3).map((e) => (
                <div
                  key={e.titre}
                  className="flex items-center gap-3.5 border-b border-[#f5f7fc] px-5.5 py-4 last:border-0"
                >
                  <span className="flex size-13 flex-none flex-col items-center justify-center rounded-xl bg-vovinam text-white">
                    <span className="font-display text-lg leading-none font-extrabold">
                      {e.jour}
                    </span>
                    <span className="text-[9px] font-bold tracking-[0.16em]">
                      {e.mois}
                    </span>
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="text-[0.95rem] leading-snug font-bold text-encre">
                      {e.titre}
                    </span>
                    <span className="text-[0.83rem] text-encre-30">
                      {e.horaire}
                    </span>
                  </span>
                </div>
              ))}
            </section>

            <section className={["p-5.5", carte].join(" ")}>
              <h2 className="mb-4 font-display text-lg font-extrabold text-encre">
                Répartition des adhérents
              </h2>
              <div className="flex flex-col gap-4">
                {repartition.map((r) => (
                  <div key={r.label} className="flex flex-col gap-2">
                    <span className="flex justify-between text-[0.88rem] font-semibold text-encre-70">
                      <span>{r.label}</span>
                      <span>{r.n}</span>
                    </span>
                    <span className="block h-2.5 overflow-hidden rounded-full bg-vovinam-100">
                      <span
                        className={[
                          "block h-full rounded-full",
                          r.couleur,
                        ].join(" ")}
                        style={{ width: r.pct + "%" }}
                      />
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <section className={["overflow-hidden", carte].join(" ")}>
          <div className="flex flex-wrap items-center gap-3 border-b border-[#f1f4fb] px-6 py-5.5">
            <h2 className="mr-auto font-display text-lg font-extrabold text-encre">
              Demandes de cours d'essai
            </h2>
            <span className="rounded-md bg-jaune px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] text-encre uppercase">
              7 en attente
            </span>
          </div>
          {demandes.map((d) => (
            <div
              key={d.nom}
              className="flex flex-wrap items-center gap-3.5 border-b border-[#f5f7fc] px-6 py-4.5 last:border-0"
            >
              <span className="flex size-10 flex-none items-center justify-center rounded-xl bg-[#e9eeff] font-display text-[0.82rem] font-extrabold text-vovinam">
                {d.nom
                  .split(" ")
                  .map((m) => m[0])
                  .join("")}
              </span>
              <span className="flex min-w-[200px] flex-1 flex-col gap-1">
                <span className="text-[0.96rem] leading-snug font-bold text-encre">
                  {d.nom}
                </span>
                <span className="text-[0.84rem] text-encre-30">{d.meta}</span>
              </span>
              <span className="text-[0.88rem] text-encre-70">{d.tel}</span>
              <button
                type="button"
                className="cursor-pointer rounded-lg bg-vovinam px-4 py-2.5 text-[0.84rem] font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                Contacter
              </button>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
