import { useMemo, useState } from "react";
import { AdherentsFilterBar } from "@/components/AdherentsFilterBar/AdherentsFilterBar";
import { AdherentsTableHeader } from "@/components/AdherentsTableHeader/AdherentsTableHeader";
import { AdherentRow } from "@/components/AdherentRow/AdherentRow";
import type { Adherent } from "@/lib/data";

const carte = "rounded-card border border-trait bg-white shadow-card";

interface AdherentsTableProps {
  adherents: Adherent[];
  isLoading: boolean;
  selection: number;
  onSelect: (index: number) => void;
}

export function AdherentsTable({ adherents, isLoading, selection, onSelect }: AdherentsTableProps) {
  const [query, setQuery] = useState("");
  const [categorie, setCategorie] = useState("Tous");

  const lignes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return adherents
      .map((m, i) => ({ ...m, index: i }))
      .filter((m) => categorie === "Tous" || m.categorie === categorie)
      .filter(
        (m) =>
          !q ||
          (m.nom + " " + m.prenom + " " + m.licence).toLowerCase().includes(q),
      );
  }, [adherents, query, categorie]);

  return (
    <section
      className={["min-w-[320px] flex-[2.2_1_620px] overflow-hidden", carte].join(" ")}
    >
      <AdherentsFilterBar
        query={query}
        onQueryChange={setQuery}
        categorie={categorie}
        onCategorieChange={setCategorie}
      />

      <AdherentsTableHeader />

      {isLoading ? (
        <div className="min-h-[816px] p-8 text-encre-30 animate-pulse ">
          Chargement…
        </div>
      ) : lignes.length === 0 ? (
        <div className="p-8 text-encre-30">Aucun adhérent ne correspond.</div>
      ) : (
        lignes.map((m) => (
          <AdherentRow
            key={m.id}
            adherent={m}
            isSelected={m.index === selection}
            onSelect={() => onSelect(m.index)}
          />
        ))
      )}

      <div className="flex flex-wrap items-center gap-3 px-5.5 py-4.5">
        <span className="mr-auto text-[0.88rem] text-encre-30">
          {lignes.length} adhérent{lignes.length > 1 ? "s" : ""} affiché
          {lignes.length > 1 ? "s" : ""} sur {adherents.length}
        </span>
      </div>
    </section>
  );
}
