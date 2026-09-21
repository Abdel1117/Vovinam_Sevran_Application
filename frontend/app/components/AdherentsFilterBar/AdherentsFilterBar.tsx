const categories = ["Tous", "Enfants", "Adolescents", "Adultes"];

interface AdherentsFilterBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  categorie: string;
  onCategorieChange: (value: string) => void;
}

export function AdherentsFilterBar({
  query,
  onQueryChange,
  categorie,
  onCategorieChange,
}: AdherentsFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-[#f1f4fb] px-5.5 py-5">
      <label className="relative flex min-w-[240px] flex-1 items-center">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="absolute left-3.5 text-encre-30"
        >
          <circle
            cx="11"
            cy="11"
            r="6.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
          />
          <path d="m16 16 4.4 4.4" stroke="currentColor" strokeWidth="1.9" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Nom, prénom ou n° de licence…"
          className="h-11.5 w-full rounded-field border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] pr-4 pl-10 text-[0.95rem] text-encre outline-none focus:border-vovinam focus:ring-4 focus:ring-vovinam/10"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onCategorieChange(c)}
            className={[
              "cursor-pointer rounded-full border-[1.5px] px-4 py-3 text-[0.86rem] font-semibold transition-all",
              categorie === c
                ? "border-vovinam bg-vovinam text-white"
                : "border-[#e1e7f5] bg-white text-encre-70",
            ].join(" ")}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
