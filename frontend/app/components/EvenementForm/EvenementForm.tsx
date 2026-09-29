"use client";

import DatePicker, { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale";
import Topbar from "@/components/Topbar/Topbar";
import Badge from "@/components/Badge/Badge";
import AdresseAutocomplete from "@/components/AdresseAutocomplete/AdresseAutocomplete";
import { useMenu } from "@/components/AdminShell/menu-context";
import { typesEvenement, type TypeEvenement } from "@/lib/data";
import { horaire, parseDateIso, pastilleDate } from "@/lib/api/evenements";
import { carteEmbedUrl, type AdresseSuggestion } from "@/lib/api/adresses";
import {
  DESCRIPTION_MAX,
  LIEU_MAX,
  TITRE_MAX,
  aujourdHuiIso,
  type EvenementFormValues,
} from "@/hooks/useEvenementForm";

registerLocale("fr", fr);

const carte = "rounded-card border border-trait bg-white shadow-card";
const champ =
  "h-12.5 rounded-field border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] px-4 text-[0.98rem] text-encre outline-none focus:border-vovinam focus:ring-4 focus:ring-vovinam/10";
const label = "text-[0.88rem] font-semibold text-encre-70";

function withError(base: string, onError: boolean): string {
  return onError ? `${base} border-rouge` : base;
}

function Error({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <span className="text-[0.82rem] font-semibold text-rouge">{message}</span>
  );
}

function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const types = Object.entries(typesEvenement) as [
  TypeEvenement,
  (typeof typesEvenement)[TypeEvenement],
][];

type EvenementFormProps = {
  mode: "create" | "edit";
  values: EvenementFormValues;
  setField: <K extends keyof EvenementFormValues>(
    field: K,
    value: EvenementFormValues[K],
  ) => void;
  setAdresseTexte: (texte: string) => void;
  choisirAdresse: (suggestion: AdresseSuggestion) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  error: string | null;
  fieldErrors: Partial<Record<keyof EvenementFormValues, string>>;
};

export default function EvenementForm({
  mode,
  values,
  setField,
  setAdresseTexte,
  choisirAdresse,
  onSubmit,
  isSubmitting,
  error,
  fieldErrors,
}: EvenementFormProps) {
  const { open } = useMenu();
  const hasFieldErrors = Object.keys(fieldErrors).length > 0;
  const minDebut =
    mode === "create" ? parseDateIso(aujourdHuiIso()) : undefined;
  const apercu = values.date_debut
    ? pastilleDate({
        date_debut: values.date_debut,
        date_fin:
          values.date_fin && values.date_fin !== values.date_debut
            ? values.date_fin
            : null,
      })
    : null;
  const type = typesEvenement[values.type];

  function datePicker(
    field: "date_debut" | "date_fin",
    placeholder: string,
    minDate?: Date,
  ) {
    return (
      <DatePicker
        selected={values[field] ? parseDateIso(values[field]) : null}
        onChange={(date: Date | null) =>
          setField(field, date ? toIsoDate(date) : "")
        }
        locale="fr"
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholder}
        onKeyDown={(e) => {
          if (e.key.length === 1) e.preventDefault();
        }}
        minDate={minDate}
        isClearable={field === "date_fin"}
        wrapperClassName="w-full"
        className={withError(
          champ + " w-full cursor-pointer",
          Boolean(fieldErrors[field]),
        )}
      />
    );
  }

  return (
    <>
      <Topbar
        surtitre="Agenda"
        titre={mode === "create" ? "Nouvel événement" : "Modifier l'événement"}
        onMenu={open}
        actions={
          <>
            {error || hasFieldErrors ? (
              <span className="hidden text-[0.84rem] font-semibold text-rouge sm:inline">
                {error ?? "Certains champs sont à corriger."}
              </span>
            ) : null}
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="inline-flex h-11.5 cursor-pointer items-center rounded-xl bg-vovinam px-5.5 text-[0.92rem] font-bold text-white transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Enregistrement…"
                : mode === "create"
                  ? "Publier"
                  : "Enregistrer les modifications"}
            </button>
          </>
        }
      />

      <div className="flex flex-wrap items-start gap-5.5 p-2 lg:p-8">
        <section
          className={[
            "flex min-w-[320px] flex-[2.2_1_620px] flex-col gap-4.5 p-3 lg:p-8",
            carte,
          ].join(" ")}
        >
          <label className="flex flex-col gap-2">
            <span className={label}>Titre de l&apos;événement</span>
            <input
              type="text"
              value={values.titre}
              maxLength={TITRE_MAX}
              onChange={(e) => setField("titre", e.target.value)}
              placeholder="Stage régional"
              className={withError(
                "h-15 rounded-2xl border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] px-4.5 font-display text-xl font-bold text-encre outline-none focus:border-vovinam focus:ring-4 focus:ring-vovinam/10",
                Boolean(fieldErrors.titre),
              )}
            />
            <Error message={fieldErrors.titre} />
          </label>

          <div className="flex flex-col gap-2.5">
            <span className={label}>Type</span>
            <div className="flex flex-wrap gap-2">
              {types.map(([valeur, t]) => (
                <button
                  key={valeur}
                  type="button"
                  onClick={() => setField("type", valeur)}
                  className={[
                    "cursor-pointer rounded-full border-[1.5px] px-3.5 py-2.5 text-[0.84rem] font-semibold transition-all",
                    values.type === valeur
                      ? "border-vovinam bg-vovinam text-white"
                      : "border-[#e1e7f5] bg-white text-encre-70",
                  ].join(" ")}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex min-w-[200px] flex-1 flex-col gap-2">
              <span className={label}>Date</span>
              {datePicker("date_debut", "JJ/MM/AAAA", minDebut)}
              <Error message={fieldErrors.date_debut} />
            </label>
            <label className="flex min-w-[200px] flex-1 flex-col gap-2">
              <span className={label}>
                Date de fin{" "}
                <span className="font-normal text-encre-30">
                  (si plusieurs jours)
                </span>
              </span>
              {datePicker(
                "date_fin",
                "Optionnelle",
                values.date_debut ? parseDateIso(values.date_debut) : minDebut,
              )}
              <Error message={fieldErrors.date_fin} />
            </label>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex min-w-[160px] flex-1 flex-col gap-2">
              <span className={label}>Heure de début</span>
              <input
                type="time"
                value={values.heure_debut}
                onChange={(e) => setField("heure_debut", e.target.value)}
                className={withError(champ, Boolean(fieldErrors.heure_debut))}
              />
              <Error message={fieldErrors.heure_debut} />
            </label>
            <label className="flex min-w-[160px] flex-1 flex-col gap-2">
              <span className={label}>
                Heure de fin{" "}
                <span className="font-normal text-encre-30">(optionnelle)</span>
              </span>
              <input
                type="time"
                value={values.heure_fin}
                onChange={(e) => setField("heure_fin", e.target.value)}
                className={withError(champ, Boolean(fieldErrors.heure_fin))}
              />
              <Error message={fieldErrors.heure_fin} />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className={label}>
              Lieu{" "}
              <span className="font-normal text-encre-30">
                (nom affiché sur le site)
              </span>
            </span>
            <input
              type="text"
              value={values.lieu}
              maxLength={LIEU_MAX}
              onChange={(e) => setField("lieu", e.target.value)}
              placeholder="Gymnase Gaston Bussière — Salle verte"
              className={withError(champ, Boolean(fieldErrors.lieu))}
            />
            <Error message={fieldErrors.lieu} />
          </label>

          <div className="flex flex-col gap-2">
            <label className="flex flex-col gap-2">
              <span className={label}>
                Adresse{" "}
                <span className="font-normal text-encre-30">
                  (optionnelle · itinéraire, carte et agenda)
                </span>
              </span>
              <AdresseAutocomplete
                value={values.adresse}
                estVerifiee={values.latitude !== null}
                onChange={setAdresseTexte}
                onSelect={choisirAdresse}
                placeholder="Tapez une adresse puis choisissez-la dans la liste"
                className={withError(champ, Boolean(fieldErrors.adresse))}
              />
            </label>
            <Error message={fieldErrors.adresse} />
            {values.latitude !== null && values.longitude !== null ? (
              <iframe
                title="Position de l'adresse"
                src={carteEmbedUrl(values.latitude, values.longitude)}
                loading="lazy"
                className="mt-1 h-48 w-full rounded-field border border-[#e1e7f5]"
              />
            ) : null}
          </div>

          <label className="flex flex-col gap-2">
            <span className={label}>
              Description{" "}
              <span className="font-normal text-encre-30">
                (optionnelle, affichée avec le bouton « Détails »)
              </span>
            </span>
            <textarea
              rows={5}
              value={values.description}
              maxLength={DESCRIPTION_MAX}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Programme, public concerné, tenue, tarif, inscription…"
              className={withError(
                "resize-y rounded-field border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] p-4 text-base leading-relaxed text-encre outline-none focus:border-vovinam focus:ring-4 focus:ring-vovinam/10",
                Boolean(fieldErrors.description),
              )}
            />
            <span className="text-[0.82rem] text-encre-30">
              {values.description.trim().length} / {DESCRIPTION_MAX} caractères
            </span>
            <Error message={fieldErrors.description} />
          </label>
        </section>

        <section
          className={["min-w-[300px] flex-1 overflow-hidden", carte].join(" ")}
        >
          <div className="border-b border-[#f1f4fb] px-5.5 pt-5 pb-4">
            <h2 className="font-display text-lg font-extrabold text-encre">
              Aperçu
            </h2>
          </div>
          <div className="flex items-center gap-4 p-5.5">
            <span className="flex size-18 flex-none flex-col items-center justify-center rounded-2xl bg-vovinam text-white">
              <span
                className={[
                  "font-display leading-none font-extrabold",
                  apercu && apercu.jour.length > 2 ? "text-base" : "text-2xl",
                ].join(" ")}
              >
                {apercu?.jour ?? "--"}
              </span>
              <span className="mt-1 text-[10px] font-bold tracking-[0.16em]">
                {apercu?.mois ?? "MOIS"}
              </span>
            </span>
            <span className="flex min-w-0 flex-col gap-1.5">
              <Badge variant={type.badge} className="self-start">
                {type.label}
              </Badge>
              <span className="font-display text-base leading-snug font-extrabold text-encre">
                {values.titre || "Titre de l'événement"}
              </span>
              <span className="text-[0.85rem] text-encre-30">
                {values.heure_debut
                  ? horaire({
                      heure_debut: values.heure_debut,
                      heure_fin: values.heure_fin || null,
                    })
                  : "Horaire"}
                {values.lieu ? ` · ${values.lieu}` : ""}
              </span>
            </span>
          </div>
        </section>
      </div>
    </>
  );
}
