import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { API_URL } from "@/lib/auth";
import { extractErrorMessage } from "@/lib/apiError";
import { absolutise, type AuthorizedFetch } from "@/lib/api/images";

export type Bloc = { type: "p" | "h2" | "quote"; texte: string };

export type ArticlePublic = {
  id: string;
  slug: string;
  titre: string;
  categorie: string;
  chapo: string;
  corps: Bloc[];
  tags: string[];
  image: string;
  vignette: string;
  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  auteur: string;
  /** Date de publication, ISO 8601. */
  date: string;
  lecture: string;
};

export type ArticleInput = {
  titre: string;
  categorie: string;
  chapo: string;
  corps: Bloc[];
  tags: string[];
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  fichier: File | null;
};

export class ArticleApiError extends Error {}

// Côté serveur Next (dans Docker), le backend n'est pas joignable via localhost.
const BASE_URL = process.env.API_INTERNAL_URL ?? API_URL;

export function formatDateArticle(iso: string): string {
  return format(new Date(iso), "d MMMM yyyy", { locale: fr });
}

export function corpsTextToBlocs(text: string): Bloc[] {
  const blocs: Bloc[] = [];
  let paragraphe: string[] = [];

  function flush() {
    const texte = paragraphe.join(" ").trim();
    if (texte) blocs.push({ type: "p", texte });
    paragraphe = [];
  }

  for (const ligne of text.split("\n")) {
    const trimmed = ligne.trim();
    if (!trimmed) {
      flush();
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flush();
      blocs.push({ type: "h2", texte: trimmed.slice(3).trim() });
      continue;
    }
    if (trimmed.startsWith("> ")) {
      flush();
      blocs.push({ type: "quote", texte: trimmed.slice(2).trim() });
      continue;
    }
    paragraphe.push(trimmed);
  }
  flush();
  return blocs;
}

export function blocsToCorpsText(blocs: Bloc[]): string {
  return blocs
    .map((bloc) => {
      if (bloc.type === "h2") return `## ${bloc.texte}`;
      if (bloc.type === "quote") return `> ${bloc.texte}`;
      return bloc.texte;
    })
    .join("\n\n");
}

function withAbsoluteUrls(article: ArticlePublic): ArticlePublic {
  return { ...article, image: absolutise(article.image), vignette: absolutise(article.vignette) };
}

function toFormData(input: ArticleInput): FormData {
  const formData = new FormData();
  formData.append("titre", input.titre);
  formData.append("categorie", input.categorie);
  formData.append("chapo", input.chapo);
  formData.append("corps", JSON.stringify(input.corps));
  formData.append("tags", JSON.stringify(input.tags));
  formData.append("facebook_url", input.facebook_url);
  formData.append("instagram_url", input.instagram_url);
  formData.append("youtube_url", input.youtube_url);
  if (input.fichier) formData.append("fichier", input.fichier);
  return formData;
}

export async function listArticles(tag?: string): Promise<ArticlePublic[]> {
  const query = tag ? `?tag=${encodeURIComponent(tag)}` : "";
  const response = await fetch(`${BASE_URL}/articles${query}`, { cache: "no-store" });
  if (!response.ok) {
    throw new ArticleApiError(await extractErrorMessage(response, "Impossible de charger les articles."));
  }
  const articles: ArticlePublic[] = await response.json();
  return articles.map(withAbsoluteUrls);
}

export async function getArticle(slug: string): Promise<ArticlePublic | undefined> {
  const response = await fetch(`${BASE_URL}/articles/${encodeURIComponent(slug)}`, { cache: "no-store" });
  if (response.status === 404) return undefined;
  if (!response.ok) {
    throw new ArticleApiError(await extractErrorMessage(response, "Impossible de charger l'article."));
  }
  return withAbsoluteUrls(await response.json());
}

export async function createArticle(fetcher: AuthorizedFetch, input: ArticleInput): Promise<ArticlePublic> {
  if (!input.fichier) {
    throw new ArticleApiError("Une image de couverture doit être sélectionnée.");
  }
  const response = await fetcher("/articles", { method: "POST", body: toFormData(input) });
  if (!response.ok) {
    throw new ArticleApiError(await extractErrorMessage(response, "Impossible de publier l'article."));
  }
  return withAbsoluteUrls(await response.json());
}

export async function updateArticle(
  fetcher: AuthorizedFetch,
  slug: string,
  input: ArticleInput,
): Promise<ArticlePublic> {
  const response = await fetcher(`/articles/${encodeURIComponent(slug)}`, {
    method: "PUT",
    body: toFormData(input),
  });
  if (!response.ok) {
    throw new ArticleApiError(await extractErrorMessage(response, "Impossible d'enregistrer l'article."));
  }
  return withAbsoluteUrls(await response.json());
}

export async function deleteArticle(fetcher: AuthorizedFetch, slug: string): Promise<void> {
  const response = await fetcher(`/articles/${encodeURIComponent(slug)}`, { method: "DELETE" });
  if (!response.ok) {
    throw new ArticleApiError(await extractErrorMessage(response, "Impossible de supprimer l'article."));
  }
}
