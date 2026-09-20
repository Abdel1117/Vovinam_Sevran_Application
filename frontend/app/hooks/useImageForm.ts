"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
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
  url: "",
};

type ImageFieldErrors = Partial<Record<keyof ImageInput, string>>;

function validate(values: ImageInput): ImageFieldErrors {
  const errors: ImageFieldErrors = {};
  errors.titre = requis(values.titre);
  errors.date = requis(values.date);
  errors.url = requis(values.url, "Une image doit être sélectionnée.");
  Object.keys(errors).forEach((key) => {
    if (errors[key as keyof ImageFieldErrors] === undefined) delete errors[key as keyof ImageFieldErrors];
  });
  return errors;
}

export function useImageForm(id?: string) {
  const router = useRouter();
  const [values, setValues] = useState<ImageInput>(valeursVides);
  const [isLoadingInitial, setIsLoadingInitial] = useState(Boolean(id));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ImageFieldErrors>({});

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      const image = await getImage(id);
      if (cancelled) return;
      if (image) {
        setValues({
          titre: image.titre,
          categorie: image.categorie,
          date: image.date,
          url: image.url,
        });
      } else {
        setError("Image introuvable.");
      }
      setIsLoadingInitial(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const setField = useCallback(
    <K extends keyof ImageInput>(field: K, value: ImageInput[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    },
    [],
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
      const record = id ? await updateImage(id, values) : await createImage(values);
      router.push("/admin/galerie");
      return record;
    } catch (err) {
      setError(err instanceof ImageApiError ? err.message : "Une erreur est survenue.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [id, values, router]);

  return { values, setField, submit, isSubmitting, isLoadingInitial, error, fieldErrors };
}
