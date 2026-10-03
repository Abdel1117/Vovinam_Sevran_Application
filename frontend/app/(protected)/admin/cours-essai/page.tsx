"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Topbar from "@/components/Topbar/Topbar";
import { useMenu } from "@/components/AdminShell/menu-context";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import Loader from "@/components/Loader/Loader";
import { useDemandes } from "@/hooks/useDemandes";
import { coursEssai, statutsDemande, type StatutDemande } from "@/lib/data";
import { parseDateIso } from "@/lib/api/evenements";

const carte = "rounded-card border border-trait bg-white shadow-card";
const onglets: ("toutes" | StatutDemande)[] = [
  "a_traiter",
  "contacte",
  "essai_planifie",
  "inscrit",
  "sans_suite",
  "toutes",
];

export default function Page() {
  const { open } = useMenu();
  const { demandes, isLoading, error, removeDemande } = useDemandes();
  const [onglet, setOnglet] = useState<"toutes" | StatutDemande>("a_traiter");
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const compte = (o: "toutes" | StatutDemande) =>
    o === "toutes"
      ? demandes.length
      : demandes.filter((d) => d.statut === o).length;
  const affichees =
    onglet === "toutes"
      ? demandes
      : demandes.filter((d) => d.statut === onglet);

  async function confirmerSuppression() {
    if (!toDelete) return;
    setIsDeleting(true);
    try {
      await removeDemande(toDelete);
      setToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Topbar
        surtitre="Communauté"
        titre="Cours d'essai"
        onMenu={open}
        actions={
          <Link
            href="/admin/cours-essai/nouveau"
            className="inline-flex h-11.5 cursor-pointer items-center gap-2 rounded-xl bg-vovinam px-5 text-[0.92rem] font-bold text-white transition-all hover:-translate-y-0.5"
          >
            Saisir une demande
          </Link>
        }
      />

      <div className="flex flex-col gap-5 p-2 lg:p-8">
        <div role="tablist" className="flex flex-wrap gap-2">
          {onglets.map((o) => (
            <button
              key={o}
              type="button"
              role="tab"
              aria-selected={onglet === o}
              onClick={() => setOnglet(o)}
              className={[
                "cursor-pointer rounded-full border-[1.5px] px-4 py-2.5 text-[0.86rem] font-semibold transition-all",
                onglet === o
                  ? "border-vovinam bg-vovinam text-white"
                  : "border-[#e1e7f5] bg-white text-encre-70 hover:border-vovinam",
              ].join(" ")}
            >
              {o === "toutes" ? "Toutes" : statutsDemande[o].label}{" "}
              <span className="opacity-70">({compte(o)})</span>
            </button>
          ))}
        </div>

        <section className={["overflow-hidden", carte].join(" ")}>
          {isLoading ? (
            <Loader className="p-12" />
          ) : error ? (
            <div className="p-8 text-rouge">{error}</div>
          ) : affichees.length === 0 ? (
            <div className="p-8 text-encre-30">
              {onglet === "a_traiter"
                ? "Aucune demande à traiter. Tout est à jour !"
                : "Aucune demande dans cette catégorie."}
            </div>
          ) : (
            affichees.map((d) => (
              <div
                key={d.id}
                className="flex flex-wrap items-center gap-3.5 border-b border-[#f5f7fc] px-5.5 py-4 last:border-0"
              >
                <span className="flex size-10 flex-none items-center justify-center rounded-xl bg-[#e9eeff] font-display text-[0.82rem] font-extrabold text-vovinam">
                  {(d.prenom[0] ?? "") + (d.nom[0] ?? "")}
                </span>
                <span className="flex min-w-0 flex-[2_1_240px] flex-col gap-1">
                  <span className="truncate text-[0.96rem] font-bold text-encre">
                    {d.prenom} {d.nom}
                  </span>
                  <span className="text-[0.82rem] text-encre-30">
                    {coursEssai[d.cours]} · reçue le{" "}
                    {format(new Date(d.created_at), "d MMM yyyy", {
                      locale: fr,
                    })}
                    {d.date_essai
                      ? ` · essai le ${format(parseDateIso(d.date_essai), "d MMM", { locale: fr })}`
                      : ""}
                  </span>
                </span>
                <span className="flex min-w-[160px] flex-1 flex-col gap-1 text-[0.86rem] text-encre-70">
                  {d.telephone ? (
                    <a
                      href={`tel:${d.telephone.replace(/[\s.-]/g, "")}`}
                      className="hover:text-vovinam"
                    >
                      {d.telephone}
                    </a>
                  ) : null}
                  <a
                    href={`mailto:${d.email}`}
                    className="truncate hover:text-vovinam"
                  >
                    {d.email}
                  </a>
                </span>
                <span
                  className={[
                    "rounded-md px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] uppercase",
                    statutsDemande[d.statut].classe,
                  ].join(" ")}
                >
                  {statutsDemande[d.statut].label}
                </span>
                <div className="flex flex-none gap-2.5">
                  <Link
                    href={`/admin/cours-essai/${d.id}`}
                    className="inline-flex h-10.5 cursor-pointer items-center rounded-xl border-[1.5px] border-[#e1e7f5] bg-white px-4 text-[0.86rem] font-bold text-encre-70 hover:border-vovinam"
                  >
                    Ouvrir
                  </Link>
                  <button
                    type="button"
                    onClick={() => setToDelete(d.id)}
                    className="inline-flex h-10.5 cursor-pointer items-center rounded-xl border-[1.5px] border-[#f3d9d9] bg-white px-4 text-[0.86rem] font-bold text-rouge hover:border-rouge"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        title="Supprimer cette demande ?"
        description="Les coordonnées de la personne seront définitivement effacées."
        isConfirming={isDeleting}
        onConfirm={confirmerSuppression}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
