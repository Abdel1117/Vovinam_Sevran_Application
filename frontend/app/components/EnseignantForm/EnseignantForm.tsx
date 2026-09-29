"use client";

import Topbar from "@/components/Topbar/Topbar";
import { useMenu } from "@/components/AdminShell/menu-context";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/api/images";
import {
  GRADE_MAX,
  NOM_MAX,
  ROLE_MAX,
  TEXTE_MAX,
  type EnseignantFormValues,
} from "@/hooks/useEnseignantForm";
import { grades } from "../AdherentForm/AdherentForm";

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

type EnseignantFormProps = {
  mode: "create" | "edit";
  values: EnseignantFormValues;
  setField: <K extends keyof EnseignantFormValues>(
    field: K,
    value: EnseignantFormValues[K],
  ) => void;
  setPhoto: (fichier: File | null) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  error: string | null;
  fieldErrors: Partial<Record<keyof EnseignantFormValues, string>>;
};

export default function EnseignantForm({
  mode,
  values,
  setField,
  setPhoto,
  onSubmit,
  isSubmitting,
  error,
  fieldErrors,
}: EnseignantFormProps) {
  const { open } = useMenu();
  const hasFieldErrors = Object.keys(fieldErrors).length > 0;

  function surPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0];
    if (fichier) setPhoto(fichier);
    e.target.value = "";
  }

  return (
    <>
      <Topbar
        surtitre="Enseignants"
        titre={
          mode === "create" ? "Ajouter un enseignant" : "Modifier l'enseignant"
        }
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
                  ? "Ajouter"
                  : "Enregistrer les modifications"}
            </button>
          </>
        }
      />

      <div className="flex flex-wrap items-start gap-5.5 p-2 lg:p-8">
        <section
          className={[
            "flex min-w-[320px] flex-[2_1_560px] flex-col gap-4.5 p-3 lg:p-8",
            carte,
          ].join(" ")}
        >
          <label className="flex flex-col gap-2">
            <span className={label}>Nom et prénom</span>
            <input
              type="text"
              value={values.nom}
              maxLength={NOM_MAX}
              onChange={(e) => setField("nom", e.target.value)}
              placeholder="Julien Saffou"
              className={withError(champ, Boolean(fieldErrors.nom))}
            />
            <Error message={fieldErrors.nom} />
          </label>

          <div className="flex flex-wrap gap-4">
            <label className="flex min-w-[220px] flex-1 flex-col gap-2">
              <span className={label}>Grade</span>
              <select
                value={values.grade}
                onChange={(e) => setField("grade", e.target.value)}
                className={withError(champ, Boolean(fieldErrors.grade))}
              >
                <option value="">Sélectionner un grade</option>
                {Object.entries(grades).map(([cle, { nom, icone }]) => (
                  <option
                    className="hover:cursor-pointer"
                    key={cle}
                    value={nom}
                  >
                    {icone} {nom}
                  </option>
                ))}
              </select>
              <Error message={fieldErrors.grade} />
            </label>
            <label className="flex min-w-[220px] flex-1 flex-col gap-2">
              <span className={label}>Rôle</span>
              <input
                type="text"
                value={values.role}
                maxLength={ROLE_MAX}
                onChange={(e) => setField("role", e.target.value)}
                placeholder="Enseignant principal"
                className={withError(champ, Boolean(fieldErrors.role))}
              />
              <Error message={fieldErrors.role} />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className={label}>
              Présentation{" "}
              <span className="font-normal text-encre-30">(optionnelle)</span>
            </span>
            <textarea
              rows={4}
              value={values.texte}
              maxLength={TEXTE_MAX}
              onChange={(e) => setField("texte", e.target.value)}
              placeholder="Pratique depuis 20 ans, spécialiste des armes traditionnelles…"
              className={withError(
                "resize-y rounded-field border-[1.5px] border-[#e1e7f5] bg-[#fbfcff] p-4 text-base leading-relaxed text-encre outline-none focus:border-vovinam focus:ring-4 focus:ring-vovinam/10",
                Boolean(fieldErrors.texte),
              )}
            />
            <span className="text-[0.82rem] text-encre-30">
              {values.texte.trim().length} / {TEXTE_MAX} caractères
            </span>
            <Error message={fieldErrors.texte} />
          </label>

          <label className="flex max-w-[260px] flex-col gap-2">
            <span className={label}>Ordre d&apos;affichage</span>
            <input
              type="number"
              min={0}
              max={999}
              inputMode="numeric"
              value={values.ordre}
              onChange={(e) => setField("ordre", e.target.value)}
              placeholder={mode === "create" ? "En dernier" : ""}
              className={withError(champ, Boolean(fieldErrors.ordre))}
            />
            <span className="text-[0.82rem] text-encre-30">
              0 = en premier sur le site
            </span>
            <Error message={fieldErrors.ordre} />
          </label>
        </section>

        <section
          className={[
            "flex min-w-[280px] flex-1 flex-col gap-4 p-3 lg:p-8",
            carte,
          ].join(" ")}
        >
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-lg font-extrabold text-encre">
              Photo
            </h2>
            <span className="text-[0.84rem] text-encre-30">
              Optionnelle · portrait, JPEG/PNG/WebP, 5 Mo max
            </span>
          </div>
          <label
            className={withError(
              "relative flex h-72 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-[1.5px] border-dashed border-[#c9d6f5] bg-[#fbfcff] text-center transition-colors hover:border-vovinam hover:bg-vovinam-050",
              Boolean(fieldErrors.photo),
            )}
          >
            <input
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
              className="hidden"
              onChange={surPhoto}
            />
            {values.previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={values.previewUrl}
                alt="Aperçu du portrait"
                className="absolute inset-0 size-full object-cover object-top"
              />
            ) : (
              <>
                <span className="flex size-12 items-center justify-center rounded-xl bg-vovinam-100 text-xl font-bold text-vovinam">
                  +
                </span>
                <span className="font-semibold text-encre">
                  Ajouter un portrait
                </span>
              </>
            )}
          </label>
          <Error message={fieldErrors.photo} />
          {values.previewUrl ? (
            <button
              type="button"
              onClick={() => setPhoto(null)}
              className="cursor-pointer self-start rounded-xl border-[1.5px] border-[#f3d9d9] bg-white px-4 py-2.5 text-[0.86rem] font-bold text-rouge hover:border-rouge"
            >
              Retirer la photo
            </button>
          ) : null}
        </section>
      </div>
    </>
  );
}
