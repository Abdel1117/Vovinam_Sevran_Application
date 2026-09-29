"use client";

import { useState } from "react";
import Link from "next/link";
import Topbar from "@/components/Topbar/Topbar";
import Badge from "@/components/Badge/Badge";
import { useMenu } from "@/components/AdminShell/menu-context";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import { useEvenements } from "@/hooks/useEvenements";
import { aujourdHuiIso } from "@/hooks/useEvenementForm";
import { typesEvenement } from "@/lib/data";
import {
  dateLongue,
  horaire,
  pastilleDate,
  type EvenementPublic,
} from "@/lib/api/evenements";

const carte = "rounded-card border border-trait bg-white shadow-card";

function Ligne({
  e,
  estPasse,
  onDelete,
}: {
  e: EvenementPublic;
  estPasse: boolean;
  onDelete: () => void;
}) {
  const { jour, mois } = pastilleDate(e);
  const type = typesEvenement[e.type];
  return (
    <div
      className={[
        "flex flex-wrap items-center gap-3.5 border-b border-[#f5f7fc] px-5.5 py-4 last:border-0",
        estPasse ? "opacity-60" : "",
      ].join(" ")}
    >
      <span className="flex size-13 flex-none flex-col items-center justify-center rounded-xl bg-vovinam text-white">
        <span
          className={[
            "font-display leading-none font-extrabold",
            jour.length > 2 ? "text-[0.8rem]" : "text-lg",
          ].join(" ")}
        >
          {jour}
        </span>
        <span className="text-[9px] font-bold tracking-[0.16em]">{mois}</span>
      </span>
      <span className="flex min-w-0 flex-[2_1_260px] flex-col gap-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="truncate text-[0.96rem] font-bold text-encre">
            {e.titre}
          </span>
          <Badge variant={type.badge}>{type.label}</Badge>
        </span>
        <span className="text-[0.82rem] text-encre-30 first-letter:uppercase">
          {dateLongue(e)} · {horaire(e)}
          {e.lieu ? ` · ${e.lieu}` : ""}
        </span>
      </span>
      <div className="flex flex-none gap-2.5">
        <Link
          href={`/admin/agenda/${e.id}/modifier`}
          className="inline-flex h-10.5 cursor-pointer items-center rounded-xl border-[1.5px] border-[#e1e7f5] bg-white px-4 text-[0.86rem] font-bold text-encre-70 hover:border-vovinam"
        >
          Modifier
        </Link>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex h-10.5 cursor-pointer items-center rounded-xl border-[1.5px] border-[#f3d9d9] bg-white px-4 text-[0.86rem] font-bold text-rouge hover:border-rouge"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  const { open } = useMenu();
  const { evenements, isLoading, error, removeEvenement } = useEvenements();
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const aujourdHui = aujourdHuiIso();
  // L'API renvoie du plus récent au plus ancien : on remet les « à venir » dans l'ordre chronologique.
  const aVenir = evenements
    .filter((e) => (e.date_fin ?? e.date_debut) >= aujourdHui)
    .reverse();
  const passes = evenements.filter(
    (e) => (e.date_fin ?? e.date_debut) < aujourdHui,
  );

  async function confirmerSuppression() {
    if (!toDelete) return;
    setIsDeleting(true);
    try {
      await removeEvenement(toDelete);
      setToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  }

  const sections: { titre: string; liste: EvenementPublic[]; vide: string }[] =
    [
      {
        titre: "À venir",
        liste: aVenir,
        vide: "Aucun événement à venir. Créez-en un pour qu'il apparaisse sur le site.",
      },
      { titre: "Passés", liste: passes, vide: "Aucun événement passé." },
    ];

  return (
    <>
      <Topbar
        surtitre="Pilotage"
        titre="Agenda"
        onMenu={open}
        actions={
          <Link
            href="/admin/agenda/nouveau"
            className="inline-flex h-11.5 cursor-pointer items-center gap-2 rounded-xl bg-vovinam px-5 text-[0.92rem] font-bold text-white transition-all hover:-translate-y-0.5"
          >
            Nouvel événement
          </Link>
        }
      />

      <div className="flex flex-col gap-5 p-2 lg:p-8">
        {isLoading ? (
          <section className={["p-8 text-encre-30", carte].join(" ")}>
            Chargement…
          </section>
        ) : error ? (
          <section className={["p-8 text-rouge", carte].join(" ")}>
            {error}
          </section>
        ) : (
          sections.map((s) => (
            <section
              key={s.titre}
              className={["overflow-hidden", carte].join(" ")}
            >
              <div className="border-b border-[#f1f4fb] px-5.5 py-4.5">
                <h2 className="font-display text-lg font-extrabold text-encre">
                  {s.titre}{" "}
                  <span className="text-encre-30">({s.liste.length})</span>
                </h2>
              </div>
              {s.liste.length === 0 ? (
                <div className="px-5.5 py-6 text-encre-30">{s.vide}</div>
              ) : (
                s.liste.map((e) => (
                  <Ligne
                    key={e.id}
                    e={e}
                    estPasse={s.liste === passes}
                    onDelete={() => setToDelete(e.id)}
                  />
                ))
              )}
            </section>
          ))
        )}
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        title="Supprimer cet événement ?"
        description="Il disparaîtra immédiatement de l'agenda du site. Cette action est irréversible."
        isConfirming={isDeleting}
        onConfirm={confirmerSuppression}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
