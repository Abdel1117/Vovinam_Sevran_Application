"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ACCEPTED_IMAGE_TYPES,
  ImageApiError,
  createImage,
  getImage,
  updateImage,
  type ImageInput,
} from "@/lib/api/images";
import { requis } from "@/lib/validation";

const valeursVides: ImageInput = {
  titre: "",
  categorie: "Entraînement",
  date: "",
  fichier: null,
};

type ImageFieldErrors = Partial<Record<keyof ImageInput, string>>;

function validate(values: ImageInput, aUneImageExistante: boolean): ImageFieldErrors {
  const errors: ImageFieldErrors = {};
  errors.titre = requis(values.titre);
  errors.date = requis(values.date);
  if (!values.fichier && !aUneImageExistante) {
    errors.fichier = "Une image doit être sélectionnée.";
  }
  Object.keys(errors).forEach((key) => {
    if (errors[key as keyof ImageFieldErrors] === undefined) delete errors[key as keyof ImageFieldErrors];
  });
  return errors;
}

export function useImageForm(id?: string) {
  const router = useRouter();
  const { authorizedFetch } = useAuth();
  const [values, setValues] = useState<ImageInput>(valeursVides);
  const [existingUrl, setExistingUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(Boolean(id));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ImageFieldErrors>({});
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      const image = await getImage(authorizedFetch, id);
      if (cancelled) return;
      if (image) {
        setValues({
          titre: image.titre,
          categorie: image.categorie,
          date: image.date,
          fichier: null,
        });
        setExistingUrl(image.url);
        setPreviewUrl(image.url);
      } else {
        setError("Image introuvable.");
      }
      setIsLoadingInitial(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id, authorizedFetch]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const setField = useCallback(
    <K extends keyof ImageInput>(field: K, value: ImageInput[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    },
    [],
  );

  const setFichier = useCallback((fichier: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(fichier.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
      setFieldErrors((prev) => ({ ...prev, fichier: "Formats acceptés : JPEG, PNG, WebP." }));
      return;
    }
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(fichier);
    objectUrlRef.current = url;
    setValues((prev) => ({ ...prev, fichier }));
    setPreviewUrl(url);
    setFieldErrors((prev) => (prev.fichier ? { ...prev, fichier: undefined } : prev));
  }, []);

  const submit = useCallback(async () => {
    const errors = validate(values, Boolean(existingUrl));
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return null;
    }
    setFieldErrors({});
    setIsSubmitting(true);
    setError(null);
    try {
      const record = id
        ? await updateImage(authorizedFetch, id, values)
        : await createImage(authorizedFetch, values);
      router.push("/admin/galerie");
      return record;
    } catch (err) {
      setError(err instanceof ImageApiError ? err.message : "Une erreur est survenue.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [id, values, existingUrl, router, authorizedFetch]);

  return {
    values,
    previewUrl,
    setField,
    setFichier,
    submit,
    isSubmitting,
    isLoadingInitial,
    error,
    fieldErrors,
  };
}
