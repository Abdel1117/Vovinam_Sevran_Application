"use client";

import { useState } from "react";
import Link from "next/link";
import Topbar from "@/components/Topbar/Topbar";
import { useMenu } from "@/components/AdminShell/menu-context";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import { useAdherents } from "@/hooks/useAdherents";
import type { Adherent } from "@/lib/data";
import { KpiCards } from "@/components/KpiCards/KpiCards";
import { AdherentsTable } from "@/components/AdherentsTable/AdherentsTable";
import { AdherentDetailPanel } from "@/components/AdherentDetailPanel/AdherentDetailPanel";

type Kpi = { label: string; valeur: string; alerte?: boolean };

export default function Page() {
  const { open } = useMenu();
  const { adherents, isLoading, error, removeAdherent } = useAdherents();
  const [selection, setSelection] = useState(0);
  const [toDelete, setToDelete] = useState<Adherent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const sel = adherents[selection]; // Selected type for display

  const kpis: Kpi[] = [
    { label: "Licenciés", valeur: String(adherents.length) },
    {
      label: "Cotisations à jour",
      valeur: String(adherents.filter((a) => a.statut === "À jour").length),
    },
    {
      label: "En attente de paiement",
      valeur: String(adherents.filter((a) => a.statut === "En attente").length),
    },
    {
      label: "Certificat médical manquant",
      valeur: String(
        adherents.filter((a) => a.certificat === "Manquant").length,
      ),
      alerte: true,
    },
  ];

  async function confirmDelete() {
    if (!toDelete) return;
    setIsDeleting(true);
    try {
      await removeAdherent(toDelete.id);
      setSelection(0);
      setToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Topbar
        surtitre="Administration"
        titre="Adhérents"
        onMenu={open}
        actions={
          <>
            <button
              type="button"
              className="hidden h-11.5 cursor-pointer items-center rounded-xl border-[1.5px] border-[#e1e7f5] bg-white px-4.5 text-[0.92rem] font-bold text-encre-70 hover:border-vovinam sm:inline-flex"
            >
              Exporter CSV
            </button>
            <Link
              href="/admin/adherents/nouveau"
              className="inline-flex h-11.5 cursor-pointer items-center gap-2 rounded-xl bg-vovinam px-5 text-[0.92rem] font-bold text-white transition-all hover:-translate-y-0.5"
            >
              + Nouvel adhérent
            </Link>
          </>
        }
      />

      <div className="flex flex-col gap-5 p-2 lg:p-8">
        {error ? (
          <div className="rounded-card border border-[#f3d9d9] bg-white p-5 text-rouge">
            {error}
          </div>
        ) : null}

        <KpiCards isLoading={isLoading} kpis={kpis} />
        <div className="flex flex-wrap items-start gap-5">
          <AdherentsTable
            adherents={adherents}
            isLoading={isLoading}
            selection={selection}
            onSelect={setSelection}
          />

          {isLoading ? (
            <aside className="flex min-w-[300px] min-h-[800px] flex-1 flex-col gap-3 overflow-hidden rounded-card border border-trait bg-white p-6 shadow-card lg:sticky lg:top-24">
              <div className="size-13 animate-pulse rounded-2xl bg-encre-10" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-encre-10" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-encre-10" />
            </aside>
          ) : sel ? (
            <AdherentDetailPanel
              adherent={sel}
              onDelete={() => setToDelete(sel)}
            />
          ) : null}
        </div>
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        title="Supprimer cet adhérent ?"
        description={
          toDelete
            ? `${toDelete.nom} ${toDelete.prenom} sera définitivement supprimé.`
            : undefined
        }
        isConfirming={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
