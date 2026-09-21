import { initiales, type Adherent } from "@/lib/data";

interface AdherentRowProps {
  adherent: Adherent;
  isSelected: boolean;
  onSelect: () => void;
}

export function AdherentRow({ adherent, isSelected, onSelect }: AdherentRowProps) {
  const attente = adherent.statut !== "À jour";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "flex w-full flex-wrap items-center gap-3.5 border-b border-[#f5f7fc] px-5.5 py-4 text-left transition-colors last:border-0",
        isSelected ? "bg-vovinam-050" : "bg-white hover:bg-[#f8faff]",
      ].join(" ")}
    >
      <span className="flex min-w-0 flex-[2_1_200px] items-center gap-3">
        <span className="flex size-10 flex-none items-center justify-center rounded-xl bg-[#e9eeff] font-display text-[0.8rem] font-extrabold text-vovinam">
          {initiales(adherent)}
        </span>
        <span className="flex min-w-0 flex-col gap-1">
          <span className="text-[0.96rem] leading-tight font-bold text-encre">
            {adherent.nom.toUpperCase()} {adherent.prenom}
          </span>
          <span className="text-[0.82rem] text-encre-30">
            {adherent.categorie} · {adherent.naissance}
          </span>
        </span>
      </span>
      <span className="flex-[1_1_120px] font-mono text-[0.9rem] text-encre-70">
        {adherent.licence}
      </span>
      <span className="flex flex-[1_1_130px] items-center gap-2.5">
        <span
          className="h-2 w-5.5 flex-none rounded-sm border border-encre/10"
          style={{ background: adherent.couleur }}
        />
        <span className="text-[0.88rem] font-semibold text-encre-70">
          {adherent.grade}
        </span>
      </span>
      <span className="w-27 flex-none">
        <span
          className={[
            "inline-flex rounded-md px-3 py-2 text-[0.78rem] font-bold tracking-wide uppercase",
            attente ? "bg-[#fff6da] text-[#8a6a00]" : "bg-[#e9f8ee] text-[#0e7a3c]",
          ].join(" ")}
        >
          {adherent.statut}
        </span>
      </span>
    </button>
  );
}
