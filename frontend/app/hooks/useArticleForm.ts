"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArticleApiError,
  blocsToCorpsText,
  corpsTextToBlocs,
  createArticle,
  getArticleBySlug,
  updateArticle,
  type ArticleInput,
} from "@/lib/api/articles";
import type { BadgeVariant } from "@/lib/data";

export type ArticleFormValues = {
  titre: string;
  categorie: string;
  badge: BadgeVariant;
  date: string;
  auteur: string;
  lecture: string;
  chapo: string;
  photo: string;
  corpsText: string;
  tags: string;
};

const valeursVides: ArticleFormValues = {
  titre: "",
  categorie: "Stage",
  badge: "stage",
  date: new Date().toISOString().slice(0, 10),
  auteur: "",
  lecture: "1 min",
  chapo: "",
  photo: "",
  corpsText: "",
  tags: "",
};

export function useArticleForm(slug?: string) {
  const router = useRouter();
  const [values, setValues] = useState<ArticleFormValues>(valeursVides);
  const [isLoadingInitial, setIsLoadingInitial] = useState(Boolean(slug));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      const article = await getArticleBySlug(slug);
      if (cancelled) return;
      if (article) {
        setValues({
          titre: article.titre,
          categorie: article.categorie,
          badge: article.badge,
          date: article.date,
          auteur: article.auteur,
          lecture: article.lecture,
          chapo: article.chapo,
          photo: article.photo,
          corpsText: blocsToCorpsText(article.corps),
          tags: article.tags.join(", "),
        });
      } else {
        setError("Article introuvable.");
      }
      setIsLoadingInitial(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const setField = useCallback(
    <K extends keyof ArticleFormValues>(field: K, value: ArticleFormValues[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const submit = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const input: ArticleInput = {
        titre: values.titre,
        categorie: values.categorie,
        badge: values.badge,
        date: values.date,
        auteur: values.auteur,
        lecture: values.lecture,
        chapo: values.chapo,
        photo: values.photo,
        corps: corpsTextToBlocs(values.corpsText),
        tags: values.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      const record = slug ? await updateArticle(slug, input) : await createArticle(input);
      router.push("/admin/articles");
      return record;
    } catch (err) {
      setError(err instanceof ArticleApiError ? err.message : "Une erreur est survenue.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [slug, values, router]);

  return { values, setField, submit, isSubmitting, isLoadingInitial, error };
}
