"use client";

import DatePicker, { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale";
import Topbar from "@/components/Topbar/Topbar";
import { useMenu } from "@/components/AdminShell/menu-context";
import { categoriesGalerie } from "@/lib/data";
import {
  ACCEPTED_IMAGE_TYPES,
  formatMonthYear,
  parseMonthYear,
  type ImageInput,
} from "@/lib/api/images";

registerLocale("fr", fr);

const carte = "rounded-card border border-trait bg-white shadow-card";
const champ =
  "h-12.5 rounded-field border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] px-4 text-[0.98rem] text-encre outline-none focus:border-vovinam focus:ring-4 focus:ring-vovinam/10 cursor-pointer";
const label = "text-[0.88rem] font-semibold text-encre-70";

const categories = categoriesGalerie.filter((c) => c !== "Tous");

function withError(base: string, onError: boolean): string {
  return onError ? `${base} border-rouge` : base;
}

function Error({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <span className="text-[0.82rem] font-semibold text-rouge">{message}</span>
  );
}

type ImageFormProps = {
  mode: "create" | "edit";
  values: ImageInput;
  previewUrl: string | null;
  setField: <K extends keyof ImageInput>(
    field: K,
    value: ImageInput[K],
  ) => void;
  setFichier: (fichier: File) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  error: string | null;
  fieldErrors: Partial<Record<keyof ImageInput, string>>;
};

export default function ImageForm({
  mode,
  values,
  previewUrl,
  setField,
  setFichier,
  onSubmit,
  isSubmitting,
  error,
  fieldErrors,
}: ImageFormProps) {
  const { open } = useMenu();

  function surFichier(e: React.ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0];
    if (!fichier) return;
    setFichier(fichier);
  }

  return (
    <>
      <Topbar
        surtitre="Galerie"
        titre={mode === "create" ? "Ajouter une image" : "Modifier l'image"}
        onMenu={open}
        actions={
          <>
            {error ? (
              <span className="hidden text-[0.84rem] font-semibold text-rouge sm:inline">
                {error}
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
                  ? "Ajouter"
                  : "Enregistrer les modifications"}
            </button>
          </>
        }
      />

      <div className="flex flex-wrap items-start gap-5.5 p-2 lg:p-8">
        <div className="flex min-w-[320px] flex-1 flex-col gap-5.5">
          <section
            className={["flex flex-col gap-4.5 p-3 lg:p-8", carte].join(" ")}
          >
            <h2 className="font-display text-lg font-extrabold text-encre">
              Photo
            </h2>
            <label className="relative flex aspect-video max-w-[720px] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-[1.5px] border-dashed border-[#c9d6f5] bg-[#fbfcff] text-center transition-colors hover:border-vovinam hover:bg-vovinam-050">
              <input
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                className="hidden"
                onChange={surFichier}
              />
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Aperçu"
                  className="absolute inset-0 size-full object-contain"
                />
              ) : (
                <>
                  <span className="flex size-12 items-center justify-center rounded-xl bg-vovinam-100 text-xl font-bold text-vovinam">
                    +
                  </span>
                  <span className="font-semibold text-encre">
                    Glissez une photo ici
                  </span>
                  <span className="text-[0.86rem] text-encre-30">
                    ou cliquez pour parcourir vos fichiers
                  </span>
                </>
              )}
            </label>
            <Error message={fieldErrors.fichier} />

            <label className="flex flex-col gap-2">
              <span className={label}>Titre</span>
              <input
                type="text"
                value={values.titre}
                onChange={(e) => setField("titre", e.target.value)}
                placeholder="Stage régional de printemps"
                className={withError(champ, Boolean(fieldErrors.titre))}
              />
              <Error message={fieldErrors.titre} />
            </label>

            <div className="flex flex-wrap gap-4">
              <label className="flex min-w-[220px] flex-1 flex-col gap-2">
                <span className={label}>Date</span>
                <DatePicker
                  selected={parseMonthYear(values.date)}
                  onChange={(date: Date | null) =>
                    setField("date", date ? formatMonthYear(date) : "")
                  }
                  locale="fr"
                  showMonthYearPicker
                  dateFormat="MMMM yyyy"
                  placeholderText="Mois AAAA"
                  onKeyDown={(e) => {
                    if (e.key.length === 1) e.preventDefault();
                  }}
                  wrapperClassName="w-full"
                  className={withError(
                    champ + " w-full ",
                    Boolean(fieldErrors.date),
                  )}
                />
                <Error message={fieldErrors.date} />
              </label>
              <label className="flex min-w-[220px] flex-1 flex-col gap-2">
                <span className={label}>Catégorie</span>
                <select
                  value={values.categorie}
                  onChange={(e) => setField("categorie", e.target.value)}
                  className={champ}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
