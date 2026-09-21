"use client";

import { useState } from "react";
import Link from "next/link";
import Topbar from "@/components/Topbar/Topbar";
import { useMenu } from "@/components/AdminShell/menu-context";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import { useArticles } from "@/hooks/useArticles";

const carte = "rounded-card border border-trait bg-white shadow-card";

export default function Page() {
  const { open } = useMenu();
  const { articles, isLoading, error, removeArticle } = useArticles();
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function confirmerSuppression() {
    if (!toDelete) return;
    setIsDeleting(true);
    try {
      await removeArticle(toDelete);
      setToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Topbar
        surtitre="Actualités"
        titre="Articles"
        onMenu={open}
        actions={
          <Link
            href="/admin/articles/nouveau"
            className="inline-flex h-11.5 cursor-pointer items-center gap-2 rounded-xl bg-vovinam px-5 text-[0.92rem] font-bold text-white transition-all hover:-translate-y-0.5"
          >
            Nouvel article
          </Link>
        }
      />

      <div className="flex flex-col gap-5 p-2 lg:p-8">
        <section className={["overflow-hidden", carte].join(" ")}>
          {isLoading ? (
            <div className="p-8 text-encre-30">Chargement…</div>
          ) : error ? (
            <div className="p-8 text-rouge">{error}</div>
          ) : articles.length === 0 ? (
            <div className="p-8 text-encre-30">
              Aucun article pour le moment.
            </div>
          ) : (
            articles.map((a) => (
              <div
                key={a.slug}
                className="flex flex-wrap items-center gap-3.5 border-b border-[#f5f7fc] px-5.5 py-4 last:border-0"
              >
                <span className="flex min-w-0 flex-[2_1_260px] flex-col gap-1">
                  <span className="truncate text-[0.96rem] font-bold text-encre">
                    {a.titre}
                  </span>
                  <span className="text-[0.82rem] text-encre-30">
                    {a.categorie} · {a.date}
                  </span>
                </span>
                <div className="flex flex-none gap-2.5">
                  <Link
                    href={`/admin/articles/${a.slug}/modifier`}
                    className="inline-flex h-10.5 cursor-pointer items-center rounded-xl border-[1.5px] border-[#e1e7f5] bg-white px-4 text-[0.86rem] font-bold text-encre-70 hover:border-vovinam"
                  >
                    Modifier
                  </Link>
                  <button
                    type="button"
                    onClick={() => setToDelete(a.slug)}
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
        title="Supprimer cet article ?"
        description="Cette action est irréversible."
        isConfirming={isDeleting}
        onConfirm={confirmerSuppression}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
