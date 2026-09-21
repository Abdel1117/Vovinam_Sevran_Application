"use client";

import { useState } from "react";
import Link from "next/link";
import Topbar from "@/components/Topbar/Topbar";
import { useMenu } from "@/components/AdminShell/menu-context";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import { useImages } from "@/hooks/useImages";
import type { PhotoGalerie } from "@/lib/data";

const carte = "rounded-card border border-trait bg-white shadow-card";

export default function Page() {
  const { open } = useMenu();
  const { images, isLoading, error, removeImage } = useImages();
  const [aSupprimer, setASupprimer] = useState<PhotoGalerie | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function confirmerSuppression() {
    if (!aSupprimer) return;
    setIsDeleting(true);
    try {
      await removeImage(aSupprimer.id);
      setASupprimer(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Topbar
        surtitre="Galerie"
        titre="Images"
        onMenu={open}
        actions={
          <Link
            href="/admin/galerie/nouveau"
            className="inline-flex h-11.5 cursor-pointer items-center gap-2 rounded-xl bg-vovinam px-5 text-[0.92rem] font-bold text-white transition-all hover:-translate-y-0.5"
          >
            + Ajouter une image
          </Link>
        }
      />

      <div className="flex flex-col gap-5 p-2 lg:p-8">
        {error ? (
          <div className="rounded-card border border-[#f3d9d9] bg-white p-5 text-rouge">
            {error}
          </div>
        ) : null}
        {isLoading ? (
          <div className={["p-8 text-encre-30", carte].join(" ")}>
            Chargement…
          </div>
        ) : images.length === 0 ? (
          <div className={["p-8 text-encre-30", carte].join(" ")}>
            Aucune image pour le moment.
          </div>
        ) : (
          <div className="flex flex-wrap gap-5">
            {images.map((img) => (
              <div
                key={img.id}
                className={[
                  "flex min-w-[260px] flex-1 flex-col overflow-hidden",
                  carte,
                ].join(" ")}
              >
                <div className="relative h-45 bg-[repeating-linear-gradient(135deg,#e9eeff_0_12px,#dce5ff_12px_24px)]">
                  {img.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img.url}
                      alt={img.titre}
                      className="absolute inset-0 size-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex flex-col gap-2 p-4.5">
                  <span className="truncate text-[0.96rem] font-bold text-encre">
                    {img.titre}
                  </span>
                  <span className="text-[0.82rem] text-encre-30">
                    {img.categorie} · {img.date}
                  </span>
                  <div className="mt-2 flex gap-2.5">
                    <Link
                      href={`/admin/galerie/${img.id}/modifier`}
                      className="flex-1 cursor-pointer rounded-xl border-[1.5px] border-[#e1e7f5] bg-white px-4 py-3 text-center text-[0.86rem] font-bold text-encre-70 hover:border-vovinam"
                    >
                      Modifier
                    </Link>
                    <button
                      type="button"
                      onClick={() => setASupprimer(img)}
                      className="flex-1 cursor-pointer rounded-xl border-[1.5px] border-[#f3d9d9] bg-white px-4 py-3 text-[0.86rem] font-bold text-rouge hover:border-rouge"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={aSupprimer !== null}
        title="Supprimer cette image ?"
        description="Cette action est irréversible."
        isConfirming={isDeleting}
        onConfirm={confirmerSuppression}
        onCancel={() => setASupprimer(null)}
      />
    </>
  );
}
