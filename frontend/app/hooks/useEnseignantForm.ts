"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  EnseignantApiError,
  createEnseignant,
  getEnseignant,
  updateEnseignant,
  type EnseignantInput,
} from "@/lib/api/enseignants";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/api/images";
import { contientUneLettre, longueurEntre, longueurMax, requis } from "@/lib/validation";

export const NOM_MAX = 80;
export const GRADE_MAX = 60;
export const ROLE_MAX = 60;
export const TEXTE_MAX = 300;
const PHOTO_TAILLE_MAX_OCTETS = 5 * 1024 * 1024;

export type EnseignantFormValues = EnseignantInput & {
  /** Photo affichée : fichier choisi (blob:) ou photo existante. */
  previewUrl: string;
};

const valeursVides: EnseignantFormValues = {
  nom: "",
  grade: "",
  role: "",
  texte: "",
  ordre: "",
  photo: null,
  supprimerPhoto: false,
  previewUrl: "",
};

type EnseignantFieldErrors = Partial<Record<keyof EnseignantFormValues, string>>;

function validate(values: EnseignantFormValues): EnseignantFieldErrors {
  const errors: EnseignantFieldErrors = {
    nom:
      requis(values.nom, "Le nom est requis.") ??
      longueurEntre(values.nom, 2, NOM_MAX) ??
      contientUneLettre(values.nom, "Le nom doit contenir au moins une lettre."),
    grade: requis(values.grade, "Le grade est requis.") ?? longueurEntre(values.grade, 2, GRADE_MAX),
    role: requis(values.role, "Le rôle est requis.") ?? longueurEntre(values.role, 2, ROLE_MAX),
    texte: longueurMax(values.texte.trim(), TEXTE_MAX),
    ordre:
      values.ordre.trim() && !/^\d{1,3}$/.test(values.ordre.trim())
        ? "Un nombre entre 0 et 999."
        : undefined,
    photo: !values.photo
      ? undefined
      : !(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(values.photo.type)
        ? "Format non supporté (JPEG, PNG ou WebP)."
        : values.photo.size > PHOTO_TAILLE_MAX_OCTETS
          ? "La photo dépasse 5 Mo."
          : undefined,
  };
  Object.keys(errors).forEach((key) => {
    if (errors[key as keyof EnseignantFieldErrors] === undefined) delete errors[key as keyof EnseignantFieldErrors];
  });
  return errors;
}

export function useEnseignantForm(id?: string) {
  const router = useRouter();
  const { authorizedFetch } = useAuth();
  const [values, setValues] = useState<EnseignantFormValues>(valeursVides);
  const [isLoadingInitial, setIsLoadingInitial] = useState(Boolean(id));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<EnseignantFieldErrors>({});
  const blobUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const enseignant = await getEnseignant(authorizedFetch, id);
        if (cancelled) return;
        if (enseignant) {
          setValues({
            nom: enseignant.nom,
            grade: enseignant.grade,
            role: enseignant.role,
            texte: enseignant.texte ?? "",
            ordre: String(enseignant.ordre),
            photo: null,
            supprimerPhoto: false,
            previewUrl: enseignant.photo ?? "",
          });
        } else {
          setError("Enseignant introuvable.");
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof EnseignantApiError ? err.message : "Une erreur est survenue.");
      } finally {
        if (!cancelled) setIsLoadingInitial(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, authorizedFetch]);

  useEffect(
    () => () => {
      if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
    },
    [],
  );

  const setField = useCallback(
    <K extends keyof EnseignantFormValues>(field: K, value: EnseignantFormValues[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    },
    [],
  );

  const setPhoto = useCallback(
    (fichier: File | null) => {
      if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
      blobUrl.current = fichier ? URL.createObjectURL(fichier) : null;
      setField("photo", fichier);
      setField("previewUrl", blobUrl.current ?? "");
      // Retirer la photo existante = la supprimer à l'enregistrement.
      setField("supprimerPhoto", !fichier);
    },
    [setField],
  );

  const submit = useCallback(async () => {
    const errors = validate(values);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return null;
    }
    setFieldErrors({});
    setIsSubmitting(true);
    setError(null);
    try {
      const input: EnseignantInput = {
        nom: values.nom.trim().replace(/\s+/g, " "),
        grade: values.grade.trim().replace(/\s+/g, " "),
        role: values.role.trim().replace(/\s+/g, " "),
        texte: values.texte.trim(),
        ordre: values.ordre,
        photo: values.photo,
        supprimerPhoto: values.supprimerPhoto,
      };
      const record = id
        ? await updateEnseignant(authorizedFetch, id, input)
        : await createEnseignant(authorizedFetch, input);
      router.push("/admin/enseignants");
      return record;
    } catch (err) {
      setError(err instanceof EnseignantApiError ? err.message : "Une erreur est survenue.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [id, values, router, authorizedFetch]);

  return { values, setField, setPhoto, submit, isSubmitting, isLoadingInitial, error, fieldErrors };
}
