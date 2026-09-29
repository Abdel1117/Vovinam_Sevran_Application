"use client";

import { useState } from "react";
import Link from "next/link";
import Topbar from "@/components/Topbar/Topbar";
import { useMenu } from "@/components/AdminShell/menu-context";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import { useEnseignants } from "@/hooks/useEnseignants";

const carte = "rounded-card border border-trait bg-white shadow-card";

function initiales(nom: string): string {
  return nom
    .split(/\s+/)
    .slice(0, 2)
    .map((m) => m[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Page() {
  const { open } = useMenu();
  const { enseignants, isLoading, error, removeEnseignant } = useEnseignants();
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function confirmerSuppression() {
    if (!toDelete) return;
    setIsDeleting(true);
    try {
      await removeEnseignant(toDelete);
      setToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Topbar
        surtitre="Communauté"
        titre="Enseignants"
        onMenu={open}
        actions={
          <Link
            href="/admin/enseignants/nouveau"
            className="inline-flex h-11.5 cursor-pointer items-center gap-2 rounded-xl bg-vovinam px-5 text-[0.92rem] font-bold text-white transition-all hover:-translate-y-0.5"
          >
            Ajouter un enseignant
          </Link>
        }
      />

      <div className="flex flex-col gap-5 p-2 lg:p-8">
        <section className={["overflow-hidden", carte].join(" ")}>
          {isLoading ? (
            <div className="p-8 text-encre-30">Chargement…</div>
          ) : error ? (
            <div className="p-8 text-rouge">{error}</div>
          ) : enseignants.length === 0 ? (
            <div className="p-8 text-encre-30">
              Aucun enseignant. La section « L&apos;équipe enseignante » est
              masquée sur le site tant qu&apos;il n&apos;y en a pas.
            </div>
          ) : (
            enseignants.map((e) => (
              <div
                key={e.id}
                className="flex flex-wrap items-center gap-3.5 border-b border-[#f5f7fc] px-5.5 py-4 last:border-0"
              >
                <span className="w-8 flex-none text-center font-mono text-[0.82rem] text-encre-30">
                  {e.ordre}
                </span>
                {e.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={e.photo}
                    alt=""
                    className="size-13 flex-none rounded-xl object-cover object-top"
                  />
                ) : (
                  <span className="flex size-13 flex-none items-center justify-center rounded-xl bg-[#e9eeff] font-display text-[0.9rem] font-extrabold text-vovinam">
                    {initiales(e.nom)}
                  </span>
                )}
                <span className="flex min-w-0 flex-[2_1_240px] flex-col gap-1">
                  <span className="truncate text-[0.96rem] font-bold text-encre">
                    {e.nom}
                  </span>
                  <span className="text-[0.82rem] text-encre-30">
                    {e.grade} · {e.role}
                  </span>
                </span>
                <div className="flex flex-none gap-2.5">
                  <Link
                    href={`/admin/enseignants/${e.id}/modifier`}
                    className="inline-flex h-10.5 cursor-pointer items-center rounded-xl border-[1.5px] border-[#e1e7f5] bg-white px-4 text-[0.86rem] font-bold text-encre-70 hover:border-vovinam"
                  >
                    Modifier
                  </Link>
                  <button
                    type="button"
                    onClick={() => setToDelete(e.id)}
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
        title="Supprimer cet enseignant ?"
        description="Il disparaîtra du site et sa photo sera supprimée. Cette action est irréversible."
        isConfirming={isDeleting}
        onConfirm={confirmerSuppression}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
