"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ArticleApiError,
  blocsToCorpsText,
  corpsTextToBlocs,
  createArticle,
  getArticle,
  updateArticle,
  type ArticleInput,
} from "@/lib/api/articles";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/api/images";
import { categoriesArticle } from "@/lib/data";
import { contientUneLettre, estTagValide, estUrlReseau, longueurEntre, requis } from "@/lib/validation";

export const TITRE_MIN = 5;
export const TITRE_MAX = 120;
export const CHAPO_MIN = 30;
export const CHAPO_MAX = 220;
export const CORPS_MIN = 100;
export const CORPS_MAX = 20_000;
export const TAGS_MAX = 8;
const IMAGE_TAILLE_MAX_OCTETS = 5 * 1024 * 1024;

export type ArticleFormValues = {
  titre: string;
  categorie: string;
  chapo: string;
  corpsText: string;
  tags: string;
  facebook: string;
  instagram: string;
  youtube: string;
  fichier: File | null;
  /** Image affichée dans le formulaire : fichier choisi (blob:) ou image existante en modification. */
  previewUrl: string;
};

const valeursVides: ArticleFormValues = {
  titre: "",
  categorie: categoriesArticle[0],
  chapo: "",
  corpsText: "",
  tags: "",
  facebook: "",
  instagram: "",
  youtube: "",
  fichier: null,
  previewUrl: "",
};

type ArticleFieldErrors = Partial<Record<keyof ArticleFormValues, string>>;

export function parseTags(texte: string): string[] {
  const tags = texte
    .split(",")
    .map((t) => t.trim().toLowerCase().replace(/\s+/g, " "))
    .filter(Boolean);
  return [...new Set(tags)];
}

function validerCorps(corpsText: string): string | undefined {
  const blocs = corpsTextToBlocs(corpsText);
  const longueur = blocs.reduce((total, b) => total + b.texte.length, 0);
  if (longueur === 0) return "Le contenu de l'article est requis.";
  if (longueur < CORPS_MIN || longueur > CORPS_MAX) {
    return `Le contenu doit faire entre ${CORPS_MIN} et ${CORPS_MAX} caractères (${longueur} actuellement).`;
  }
  if (!blocs.some((b) => b.type === "p")) return "Le contenu doit contenir au moins un paragraphe.";
  return undefined;
}

function validerTags(texte: string): string | undefined {
  const tags = parseTags(texte);
  if (tags.length > TAGS_MAX) return `${TAGS_MAX} étiquettes maximum.`;
  for (const tag of tags) {
    const erreur = estTagValide(tag);
    if (erreur) return erreur;
  }
  return undefined;
}

function validerImage(values: ArticleFormValues, estCreation: boolean): string | undefined {
  if (!values.fichier) return estCreation ? "Une image de couverture est requise." : undefined;
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(values.fichier.type)) {
    return "Format non supporté (JPEG, PNG ou WebP).";
  }
  if (values.fichier.size > IMAGE_TAILLE_MAX_OCTETS) return "L'image dépasse 5 Mo.";
  return undefined;
}

function validate(values: ArticleFormValues, estCreation: boolean): ArticleFieldErrors {
  const titre = values.titre.trim().replace(/\s+/g, " ");
  const errors: ArticleFieldErrors = {
    titre:
      requis(titre, "Le titre est requis.") ??
      longueurEntre(titre, TITRE_MIN, TITRE_MAX) ??
      contientUneLettre(titre, "Le titre doit contenir au moins une lettre."),
    chapo: requis(values.chapo, "Le chapô est requis.") ?? longueurEntre(values.chapo, CHAPO_MIN, CHAPO_MAX),
    corpsText: validerCorps(values.corpsText),
    tags: validerTags(values.tags),
    fichier: validerImage(values, estCreation),
    facebook: estUrlReseau(values.facebook, "facebook"),
    instagram: estUrlReseau(values.instagram, "instagram"),
    youtube: estUrlReseau(values.youtube, "youtube"),
  };
  Object.keys(errors).forEach((key) => {
    if (errors[key as keyof ArticleFieldErrors] === undefined) delete errors[key as keyof ArticleFieldErrors];
  });
  return errors;
}

export function useArticleForm(slug?: string) {
  const router = useRouter();
  const { authorizedFetch } = useAuth();
  const [values, setValues] = useState<ArticleFormValues>(valeursVides);
  const [isLoadingInitial, setIsLoadingInitial] = useState(Boolean(slug));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ArticleFieldErrors>({});
  const blobUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      try {
        const article = await getArticle(slug);
        if (cancelled) return;
        if (article) {
          setValues({
            titre: article.titre,
            categorie: article.categorie,
            chapo: article.chapo,
            corpsText: blocsToCorpsText(article.corps),
            tags: article.tags.join(", "),
            facebook: article.facebook_url ?? "",
            instagram: article.instagram_url ?? "",
            youtube: article.youtube_url ?? "",
            fichier: null,
            previewUrl: article.image,
          });
        } else {
          setError("Article introuvable.");
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof ArticleApiError ? err.message : "Une erreur est survenue.");
      } finally {
        if (!cancelled) setIsLoadingInitial(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(
    () => () => {
      if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
    },
    [],
  );

  const setField = useCallback(
    <K extends keyof ArticleFormValues>(field: K, value: ArticleFormValues[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    },
    [],
  );

  const setImage = useCallback(
    (fichier: File) => {
      if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
      blobUrl.current = URL.createObjectURL(fichier);
      setField("fichier", fichier);
      setField("previewUrl", blobUrl.current);
    },
    [setField],
  );

  const submit = useCallback(async () => {
    const errors = validate(values, !slug);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return null;
    }
    setFieldErrors({});
    setIsSubmitting(true);
    setError(null);
    try {
      const input: ArticleInput = {
        titre: values.titre.trim().replace(/\s+/g, " "),
        categorie: values.categorie,
        chapo: values.chapo.trim(),
        corps: corpsTextToBlocs(values.corpsText),
        tags: parseTags(values.tags),
        facebook_url: values.facebook.trim(),
        instagram_url: values.instagram.trim(),
        youtube_url: values.youtube.trim(),
        fichier: values.fichier,
      };
      const record = slug
        ? await updateArticle(authorizedFetch, slug, input)
        : await createArticle(authorizedFetch, input);
      router.push("/admin/articles");
      return record;
    } catch (err) {
      setError(err instanceof ArticleApiError ? err.message : "Une erreur est survenue.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [slug, values, router, authorizedFetch]);

  return { values, setField, setImage, submit, isSubmitting, isLoadingInitial, error, fieldErrors };
}
