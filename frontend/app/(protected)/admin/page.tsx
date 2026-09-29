"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Topbar from "@/components/Topbar/Topbar";
import Badge from "@/components/Badge/Badge";
import { useMenu } from "@/components/AdminShell/menu-context";
import { useAuth } from "@/context/AuthContext";
import { categorieBadge, coursEssai } from "@/lib/data";
import {
  horaire,
  listEvenementsAVenir,
  parseDateIso,
  pastilleDate,
  type EvenementPublic,
} from "@/lib/api/evenements";
import {
  formatDateArticle,
  listArticles,
  type ArticlePublic,
} from "@/lib/api/articles";
import { listDemandes, type DemandeEssai } from "@/lib/api/demandesEssai";
import {
  getDashboardStats,
  type DashboardStats,
  type TypeAdherentStat,
} from "@/lib/api/dashboard";

type Kpi = {
  label: string;
  valeur: string;
  href: string;
  note?: string;
  badge?: string;
  ton?: "vert";
};

const libellesRepartition: Record<TypeAdherentStat, string> = {
  enfant: "Enfants",
  adolescent: "Adolescents",
  adulte: "Adultes",
  encadrant: "Encadrants",
};

const carte = "rounded-card border border-trait bg-white shadow-card";

function kpisDepuis(stats: DashboardStats | null): Kpi[] {
  const valeur = (n: number | undefined) => (n === undefined ? "…" : String(n));
  const prochain = stats?.prochain_evenement;
  return [
    {
      label: "Adhérents actifs",
      valeur: valeur(stats?.adherents_actifs),
      href: "/admin/adherents",
      note: stats
        ? `+ ${stats.adherents_nouveaux_saison} depuis la rentrée`
        : undefined,
      ton: "vert",
    },
    {
      label: "Cours d'essai à traiter",
      valeur: valeur(stats?.demandes_a_traiter),
      href: "/admin/cours-essai",
      badge: stats && stats.demandes_a_traiter > 0 ? "À rappeler" : undefined,
      note:
        stats && stats.demandes_a_traiter === 0
          ? "Tout est à jour."
          : undefined,
    },
    {
      label: "Événements à venir",
      valeur: valeur(stats?.evenements_a_venir),
      href: "/admin/agenda",
      note: prochain
        ? `Prochain : ${prochain.titre}, ${format(parseDateIso(prochain.date_debut), "d MMM", { locale: fr })}`
        : stats
          ? "Aucun événement prévu."
          : undefined,
    },
  ];
}

export default function Page() {
  const { open } = useMenu();
  const { authorizedFetch } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [erreurStats, setErreurStats] = useState(false);
  const [evenements, setEvenements] = useState<EvenementPublic[] | null>(null);
  const [articles, setArticles] = useState<ArticlePublic[] | null>(null);
  const [demandes, setDemandes] = useState<DemandeEssai[] | null>(null);

  useEffect(() => {
    getDashboardStats(authorizedFetch)
      .then(setStats)
      .catch(() => setErreurStats(true));
    listEvenementsAVenir(3)
      .then(setEvenements)
      .catch(() => setEvenements([]));
    listArticles()
      .then((a) => setArticles(a.slice(0, 4)))
      .catch(() => setArticles([]));
    listDemandes(authorizedFetch, { statut: "a_traiter", limit: 5 })
      .then(setDemandes)
      .catch(() => setDemandes([]));
  }, [authorizedFetch]);

  const kpis = kpisDepuis(stats);
  const totalActifs = stats?.adherents_actifs ?? 0;

  return (
    <>
      <Topbar
        surtitre="Administration"
        titre="Tableau de bord"
        onMenu={open}
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
        {erreurStats ? (
          <div className="rounded-xl border border-[#f3d9d9] bg-white px-5 py-3.5 text-[0.9rem] font-semibold text-rouge">
            Impossible de charger les statistiques.
          </div>
        ) : null}
        <div className="flex flex-wrap gap-4.5">
          {kpis.map((k) => (
            <Link
              key={k.label}
              href={k.href}
              className={[
                "flex min-w-[210px] flex-1 flex-col gap-2.5 rounded-3xl p-6 transition-all hover:-translate-y-0.5 hover:shadow-card-hover",
                carte,
              ].join(" ")}
            >
              <span className="text-[11px] font-semibold tracking-[0.14em] text-encre-30 uppercase">
                {k.label}
              </span>
              <span className="font-display text-4xl leading-none font-extrabold tracking-tight text-encre">
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
                      : "text-[#6a7392]",
                  ].join(" ")}
                >
                  {k.note}
                </span>
              ) : null}
            </Link>
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
                href="/admin/articles"
                className="text-[0.86rem] font-bold text-vovinam"
              >
                Tout gérer →
              </Link>
            </div>
            {articles === null ? (
              <div className="px-6 py-5 text-[0.9rem] text-encre-30">
                Chargement…
              </div>
            ) : articles.length === 0 ? (
              <div className="px-6 py-5 text-[0.9rem] text-encre-30">
                Aucun article publié.{" "}
                <Link
                  href="/admin/articles/nouveau"
                  className="font-bold text-vovinam"
                >
                  Écrire le premier →
                </Link>
              </div>
            ) : (
              articles.map((a) => (
                <div
                  key={a.slug}
                  className="flex flex-wrap items-center gap-3.5 border-b border-[#f5f7fc] px-6 py-4.5 last:border-0"
                >
                  <span className="flex min-w-[220px] flex-1 flex-col gap-1.5">
                    <span className="text-[0.98rem] leading-snug font-bold text-encre">
                      {a.titre}
                    </span>
                    <span className="text-[0.84rem] text-encre-30">
                      Publié le {formatDateArticle(a.date)} — {a.auteur}
                    </span>
                  </span>
                  <Badge variant={categorieBadge[a.categorie]}>
                    {a.categorie}
                  </Badge>
                  <Link
                    href={`/admin/articles/${a.slug}/modifier`}
                    className="rounded-lg border border-[#e7ecf7] bg-[#f6f8fe] px-3.5 py-2.5 text-[0.84rem] font-semibold text-encre-70 hover:bg-vovinam-100"
                  >
                    Modifier
                  </Link>
                </div>
              ))
            )}
          </section>

          <div className="flex min-w-[300px] flex-1 flex-col gap-5">
            <section className={["overflow-hidden", carte].join(" ")}>
              <div className="flex items-center justify-between gap-3 border-b border-[#f1f4fb] px-5.5 py-5">
                <h2 className="font-display text-lg font-extrabold text-encre">
                  Prochains événements
                </h2>
                <Link
                  href="/admin/agenda"
                  className="text-[0.86rem] font-bold text-vovinam"
                >
                  Gérer →
                </Link>
              </div>
              {evenements === null ? (
                <div className="px-5.5 py-5 text-[0.9rem] text-encre-30">
                  Chargement…
                </div>
              ) : evenements.length === 0 ? (
                <div className="px-5.5 py-5 text-[0.9rem] text-encre-30">
                  Aucun événement à venir.
                </div>
              ) : null}
              {(evenements ?? []).map((e) => (
                <div
                  key={e.id}
                  className="flex items-center gap-3.5 border-b border-[#f5f7fc] px-5.5 py-4 last:border-0"
                >
                  <span className="flex size-13 flex-none flex-col items-center justify-center rounded-xl bg-vovinam text-white">
                    <span
                      className={[
                        "font-display leading-none font-extrabold",
                        pastilleDate(e).jour.length > 2
                          ? "text-[0.8rem]"
                          : "text-lg",
                      ].join(" ")}
                    >
                      {pastilleDate(e).jour}
                    </span>
                    <span className="text-[9px] font-bold tracking-[0.16em]">
                      {pastilleDate(e).mois}
                    </span>
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="text-[0.95rem] leading-snug font-bold text-encre">
                      {e.titre}
                    </span>
                    <span className="text-[0.83rem] text-encre-30">
                      {horaire(e)}
                    </span>
                  </span>
                </div>
              ))}
            </section>

            <section className={["p-5.5", carte].join(" ")}>
              <h2 className="mb-4 font-display text-lg font-extrabold text-encre">
                Répartition des adhérents
              </h2>
              {stats === null ? (
                <div className="text-[0.9rem] text-encre-30">Chargement…</div>
              ) : totalActifs === 0 ? (
                <div className="text-[0.9rem] text-encre-30">
                  Aucun adhérent actif.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {(Object.keys(libellesRepartition) as TypeAdherentStat[]).map(
                    (type) => {
                      const n = stats.repartition_adherents[type] ?? 0;
                      const pct = Math.round((n / totalActifs) * 100);
                      return (
                        <div key={type} className="flex flex-col gap-2">
                          <span className="flex justify-between text-[0.88rem] font-semibold text-encre-70">
                            <span>{libellesRepartition[type]}</span>
                            <span>
                              {n}{" "}
                              <span className="font-normal text-encre-30">
                                ({pct} %)
                              </span>
                            </span>
                          </span>
                          <span className="block h-2.5 overflow-hidden rounded-full bg-vovinam-100">
                            <span
                              className={[
                                "block h-full rounded-full",
                                type === "encadrant"
                                  ? "bg-jaune"
                                  : "bg-vovinam",
                              ].join(" ")}
                              style={{ width: pct + "%" }}
                            />
                          </span>
                        </div>
                      );
                    },
                  )}
                </div>
              )}
            </section>
          </div>
        </div>

        <section className={["overflow-hidden", carte].join(" ")}>
          <div className="flex flex-wrap items-center gap-3 border-b border-[#f1f4fb] px-6 py-5.5">
            <h2 className="mr-auto font-display text-lg font-extrabold text-encre">
              Demandes de cours d&apos;essai
            </h2>
            {stats && stats.demandes_a_traiter > 0 ? (
              <span className="rounded-md bg-jaune px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] text-encre uppercase">
                {stats.demandes_a_traiter} en attente
              </span>
            ) : null}
            <Link
              href="/admin/cours-essai"
              className="text-[0.86rem] font-bold text-vovinam"
            >
              Tout voir →
            </Link>
          </div>
          {demandes === null ? (
            <div className="px-6 py-5 text-[0.9rem] text-encre-30">
              Chargement…
            </div>
          ) : demandes.length === 0 ? (
            <div className="px-6 py-5 text-[0.9rem] text-encre-30">
              Aucune demande à traiter. Tout est à jour !
            </div>
          ) : (
            demandes.map((d) => (
              <div
                key={d.id}
                className="flex flex-wrap items-center gap-3.5 border-b border-[#f5f7fc] px-6 py-4.5 last:border-0"
              >
                <span className="flex size-10 flex-none items-center justify-center rounded-xl bg-[#e9eeff] font-display text-[0.82rem] font-extrabold text-vovinam">
                  {(d.prenom[0] ?? "") + (d.nom[0] ?? "")}
                </span>
                <span className="flex min-w-[200px] flex-1 flex-col gap-1">
                  <span className="text-[0.96rem] leading-snug font-bold text-encre">
                    {d.prenom} {d.nom}
                  </span>
                  <span className="text-[0.84rem] text-encre-30">
                    {coursEssai[d.cours]} · reçue le{" "}
                    {format(new Date(d.created_at), "d MMM", { locale: fr })}
                  </span>
                </span>
                {d.telephone ? (
                  <a
                    href={`tel:${d.telephone.replace(/[\s.-]/g, "")}`}
                    className="text-[0.88rem] text-encre-70 hover:text-vovinam"
                  >
                    {d.telephone}
                  </a>
                ) : (
                  <span className="text-[0.88rem] text-encre-30">
                    {d.email}
                  </span>
                )}
                <Link
                  href={`/admin/cours-essai/${d.id}`}
                  className="rounded-lg bg-vovinam px-4 py-2.5 text-[0.84rem] font-bold text-white transition-transform hover:-translate-y-0.5"
                >
                  Traiter
                </Link>
              </div>
            ))
          )}
        </section>
      </div>
    </>
  );
}
