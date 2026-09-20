"use client";

import Topbar from "@/components/Topbar/Topbar";
import { useMenu } from "@/components/AdminShell/menu-context";
import { categoriesGalerie } from "@/lib/data";
import { fileToDataUrl } from "@/utils/File/File";
import type { ImageInput } from "@/lib/api/images";

const carte = "rounded-card border border-trait bg-white shadow-card";
const champ =
  "h-12.5 rounded-field border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] px-4 text-[0.98rem] text-encre outline-none focus:border-vovinam focus:ring-4 focus:ring-vovinam/10";
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
  setField: <K extends keyof ImageInput>(
    field: K,
    value: ImageInput[K],
  ) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  error: string | null;
  fieldErrors: Partial<Record<keyof ImageInput, string>>;
};

export default function ImageForm({
  mode,
  values,
  setField,
  onSubmit,
  isSubmitting,
  error,
  fieldErrors,
}: ImageFormProps) {
  const { ouvrir } = useMenu();

  async function surFichier(e: React.ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0];
    if (!fichier) return;
    setField("url", await fileToDataUrl(fichier));
  }

  return (
    <>
      <Topbar
        surtitre="Galerie"
        titre={mode === "create" ? "Ajouter une image" : "Modifier l'image"}
        onMenu={ouvrir}
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
            <label className="relative flex h-70 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-[1.5px] border-dashed border-[#c9d6f5] bg-[#fbfcff] text-center transition-colors hover:border-vovinam hover:bg-vovinam-050">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={surFichier}
              />
              {values.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={values.url}
                  alt="Aperçu"
                  className="absolute inset-0 size-full object-cover"
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
            <Error message={fieldErrors.url} />

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
                <input
                  type="text"
                  value={values.date}
                  onChange={(e) => setField("date", e.target.value)}
                  placeholder="Avril 2026"
                  className={withError(champ, Boolean(fieldErrors.date))}
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
