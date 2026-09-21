import Link from "next/link";
import { initiales, type Adherent } from "@/lib/data";

const carte = "rounded-card border border-trait bg-white shadow-card";

interface AdherentDetailPanelProps {
  adherent: Adherent;
  onDelete: () => void;
}

export function AdherentDetailPanel({
  adherent: sel,
  onDelete,
}: AdherentDetailPanelProps) {
  return (
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
            {sel.grade}
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
          <Link
            href={`/admin/adherents/${sel.id}/modifier`}
            className="min-w-[130px] flex-1 cursor-pointer rounded-xl bg-vovinam px-4.5 py-4 text-center text-[0.9rem] font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            Modifier la fiche
          </Link>
          <button
            type="button"
            onClick={onDelete}
            className="min-w-[130px] flex-1 cursor-pointer rounded-xl border-[1.5px] border-[#f3d9d9] bg-white px-4.5 py-4 text-[0.9rem] font-bold text-rouge hover:border-rouge"
          >
            Supprimer
          </button>
        </div>
      </div>
    </aside>
  );
}
