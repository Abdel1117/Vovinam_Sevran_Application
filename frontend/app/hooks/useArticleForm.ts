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
import { longueurMax, requis } from "@/lib/validation";

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

type ArticleFieldErrors = Partial<Record<keyof ArticleFormValues, string>>;

function validate(values: ArticleFormValues): ArticleFieldErrors {
  const errors: ArticleFieldErrors = {};
  errors.titre = requis(values.titre);
  errors.date = requis(values.date);
  errors.auteur = requis(values.auteur);
  errors.chapo = requis(values.chapo) ?? longueurMax(values.chapo, 220);
  errors.corpsText = requis(values.corpsText, "Le contenu de l'article est requis.");
  Object.keys(errors).forEach((key) => {
    if (errors[key as keyof ArticleFieldErrors] === undefined) delete errors[key as keyof ArticleFieldErrors];
  });
  return errors;
}

export function useArticleForm(slug?: string) {
  const router = useRouter();
  const [values, setValues] = useState<ArticleFormValues>(valeursVides);
  const [isLoadingInitial, setIsLoadingInitial] = useState(Boolean(slug));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ArticleFieldErrors>({});

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

  return { values, setField, submit, isSubmitting, isLoadingInitial, error, fieldErrors };
}
