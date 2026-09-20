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

const valeursVides: ImageInput = {
  titre: "",
  categorie: "Entraînement",
  date: "",
  url: "",
};

export function useImageForm(id?: string) {
  const router = useRouter();
  const [values, setValues] = useState<ImageInput>(valeursVides);
  const [isLoadingInitial, setIsLoadingInitial] = useState(Boolean(id));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    },
    [],
  );

  const submit = useCallback(async () => {
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

  return { values, setField, submit, isSubmitting, isLoadingInitial, error };
}
