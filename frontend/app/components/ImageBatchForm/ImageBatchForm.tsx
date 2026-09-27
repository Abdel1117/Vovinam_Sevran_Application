"use client";

import DatePicker, { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale";
import Topbar from "@/components/Topbar/Topbar";
import { useMenu } from "@/components/AdminShell/menu-context";
import { categoriesGalerie } from "@/lib/data";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGES_PAR_ENVOI,
  formatMonthYear,
  parseMonthYear,
} from "@/lib/api/images";
import type { FichierEnAttente } from "@/hooks/useImageBatchForm";

registerLocale("fr", fr);

const carte = "rounded-card border border-trait bg-white shadow-card";
const champPetit =
  "h-9 rounded-field border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] px-2.5 text-[0.8rem] text-encre outline-none focus:border-vovinam focus:ring-2 focus:ring-vovinam/10 cursor-pointer";

const categories = categoriesGalerie.filter((c) => c !== "Tous");

type ImageBatchFormProps = {
  files: FichierEnAttente[];
  addFiles: (fichiers: FileList | File[]) => void;
  deleteFile: (id: string) => void;
  editFile: (
    id: string,
    champ: "titre" | "categorie" | "date",
    valeur: string,
  ) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  progression: { envoyees: number; total: number };
  error: string | null;
  errorByFile: Record<string, string>;
};

export default function ImageBatchForm({
  files,
  addFiles,
  deleteFile,
  editFile,
  onSubmit,
  isSubmitting,
  progression,
  error,
  errorByFile,
}: ImageBatchFormProps) {
  const { open } = useMenu();
  const plein = files.length >= MAX_IMAGES_PAR_ENVOI;

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
    e.target.value = "";
  }

  return (
    <>
      <Topbar
        surtitre="Galerie"
        titre="Ajouter des photos"
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
              disabled={isSubmitting || files.length === 0}
              className="inline-flex h-11.5 cursor-pointer items-center rounded-xl bg-vovinam px-5.5 text-[0.92rem] font-bold text-white transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? `Envoi ${progression.envoyees}/${progression.total}…`
                : `Ajouter ${files.length || ""} photo${files.length > 1 ? "s" : ""}`}
            </button>
          </>
        }
      />

      <div className="flex flex-wrap items-start gap-5.5 p-2 lg:p-8">
        <div className="flex min-w-[320px] flex-1 flex-col gap-5.5">
          <section
            className={["flex flex-col gap-4.5 p-3 lg:p-8", carte].join(" ")}
          >
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="mr-auto font-display text-lg font-extrabold text-encre">
                Photos
              </h2>
              <span className="text-[0.84rem] text-encre-30">
                {files.length} / {MAX_IMAGES_PAR_ENVOI}
              </span>
            </div>

            {error ? (
              <span className="text-[0.84rem] font-semibold text-rouge sm:hidden">
                {error}
              </span>
            ) : null}

            <label
              className={[
                "relative flex h-28 max-w-[720px] flex-col items-center justify-center gap-1.5 overflow-hidden rounded-2xl border-[1.5px] border-dashed border-[#c9d6f5] bg-[#fbfcff] text-center transition-colors",
                plein
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:border-vovinam hover:bg-vovinam-050",
              ].join(" ")}
            >
              <input
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                multiple
                disabled={plein}
                className="hidden"
                onChange={onFile}
              />
              <span className="flex size-10 items-center justify-center rounded-xl bg-vovinam-100 text-lg font-bold text-vovinam">
                +
              </span>
              <span className="font-semibold text-encre">
                {plein ? "Limite atteinte" : "Cliquez pour ajouter des photos"}
              </span>
              <span className="text-[0.86rem] text-encre-30">
                jusqu&apos;à {MAX_IMAGES_PAR_ENVOI} photos, titre/catégorie/date
                par photo
              </span>
            </label>

            {files.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,240px))] gap-4">
                {files.map((f) => (
                  <div
                    key={f.id}
                    className="flex flex-col gap-2 rounded-2xl border border-trait p-2.5"
                  >
                    <div className="relative h-32 overflow-hidden rounded-xl bg-[#fbfcff]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={f.previewUrl}
                        alt={f.titre}
                        className="absolute inset-0 size-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => deleteFile(f.id)}
                        aria-label="Retirer cette photo"
                        className="absolute top-1.5 right-1.5 flex size-6 cursor-pointer items-center justify-center rounded-full bg-black/60 text-xs font-bold text-white hover:bg-rouge"
                      >
                        ×
                      </button>
                    </div>
                    <input
                      type="text"
                      value={f.titre}
                      onChange={(e) => editFile(f.id, "titre", e.target.value)}
                      placeholder="Titre"
                      className={champPetit}
                    />
                    <DatePicker
                      selected={parseMonthYear(f.date)}
                      onChange={(d: Date | null) =>
                        editFile(f.id, "date", d ? formatMonthYear(d) : "")
                      }
                      locale="fr"
                      showMonthYearPicker
                      dateFormat="MMMM yyyy"
                      placeholderText="Mois AAAA"
                      onKeyDown={(e) => {
                        if (e.key.length === 1) e.preventDefault();
                      }}
                      wrapperClassName="w-full"
                      className={champPetit + " w-full"}
                    />
                    <select
                      value={f.categorie}
                      onChange={(e) =>
                        editFile(f.id, "categorie", e.target.value)
                      }
                      className={champPetit}
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {errorByFile[f.id] ? (
                      <span className="text-[0.74rem] font-semibold text-rouge">
                        {errorByFile[f.id]}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </>
  );
}
