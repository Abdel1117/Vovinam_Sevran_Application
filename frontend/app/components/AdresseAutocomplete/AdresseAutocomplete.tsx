"use client";

import { useEffect, useId, useRef, useState } from "react";
import { rechercherAdresses, type AdresseSuggestion } from "@/lib/api/adresses";

const DELAI_MS = 250;
const LONGUEUR_MIN = 3;

type AdresseAutocompleteProps = {
  value: string;
  /** Vrai quand l'adresse affichée vient d'une suggestion (coordonnées connues). */
  estVerifiee: boolean;
  onChange: (texte: string) => void;
  onSelect: (suggestion: AdresseSuggestion) => void;
  placeholder?: string;
  className?: string;
};

export default function AdresseAutocomplete({
  value,
  estVerifiee,
  onChange,
  onSelect,
  placeholder,
  className = "",
}: AdresseAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AdresseSuggestion[]>([]);
  const [ouvert, setOuvert] = useState(false);
  const [actif, setActif] = useState(-1);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const idListe = useId();
  const saisieUtilisateur = useRef(false);

  useEffect(() => {
    // On ne relance pas de recherche quand la valeur vient d'une sélection ou du chargement initial.
    if (!saisieUtilisateur.current) return;
    const texte = value.trim();
    if (texte.length < LONGUEUR_MIN) {
      setSuggestions([]);
      setOuvert(false);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setChargement(true);
      try {
        const resultats = await rechercherAdresses(texte, controller.signal);
        setSuggestions(resultats);
        setOuvert(true);
        setActif(resultats.length > 0 ? 0 : -1);
        setErreur(null);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setErreur("Service d'adresses indisponible, réessayez.");
        }
      } finally {
        if (!controller.signal.aborted) setChargement(false);
      }
    }, DELAI_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value]);

  function choisir(s: AdresseSuggestion) {
    saisieUtilisateur.current = false;
    onSelect(s);
    setOuvert(false);
    setSuggestions([]);
  }

  function surTouche(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!ouvert || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActif((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActif((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && actif >= 0) {
      e.preventDefault();
      choisir(suggestions[actif]);
    } else if (e.key === "Escape") {
      setOuvert(false);
    }
  }

  return (
    <div className="relative">
      <input
        type="text"
        role="combobox"
        aria-expanded={ouvert}
        aria-controls={idListe}
        aria-autocomplete="list"
        aria-activedescendant={
          ouvert && actif >= 0 ? `${idListe}-${actif}` : undefined
        }
        autoComplete="off"
        value={value}
        onChange={(e) => {
          saisieUtilisateur.current = true;
          onChange(e.target.value);
        }}
        onKeyDown={surTouche}
        onFocus={() => suggestions.length > 0 && setOuvert(true)}
        onBlur={() => setOuvert(false)}
        placeholder={placeholder}
        className={[className, "w-full pr-11"].join(" ")}
      />
      <span
        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[0.95rem]"
        aria-hidden="true"
      >
        {chargement ? (
          <span className="block size-4 animate-spin rounded-full border-2 border-vovinam/30 border-t-vovinam" />
        ) : estVerifiee && value ? (
          <span className="font-bold text-[#1f9d55]">✓</span>
        ) : null}
      </span>

      {ouvert ? (
        <ul
          id={idListe}
          role="listbox"
          className="absolute top-full right-0 left-0 z-30 mt-1.5 max-h-72 overflow-y-auto rounded-xl border border-[#e1e7f5] bg-white py-1.5 shadow-[0_18px_36px_rgb(16_24_40/0.14)]"
        >
          {suggestions.length === 0 ? (
            <li className="px-4 py-3 text-[0.9rem] text-encre-30">
              Aucune adresse trouvée.
            </li>
          ) : (
            suggestions.map((s, i) => (
              <li
                key={`${s.label}-${i}`}
                id={`${idListe}-${i}`}
                role="option"
                aria-selected={i === actif}
                // mousedown plutôt que click : se déclenche avant le blur de l'input.
                onMouseDown={(e) => {
                  e.preventDefault();
                  choisir(s);
                }}
                onMouseEnter={() => setActif(i)}
                className={[
                  "flex cursor-pointer flex-col gap-0.5 px-4 py-2.5",
                  i === actif ? "bg-vovinam-050" : "",
                ].join(" ")}
              >
                <span className="text-[0.94rem] font-semibold text-encre">
                  {s.label}
                </span>
                {s.contexte ? (
                  <span className="text-[0.8rem] text-encre-30">
                    {s.contexte}
                  </span>
                ) : null}
              </li>
            ))
          )}
        </ul>
      ) : null}

      {erreur ? (
        <span className="mt-1.5 block text-[0.82rem] font-semibold text-rouge">
          {erreur}
        </span>
      ) : null}
    </div>
  );
}
