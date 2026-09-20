import { actualites, type Article, type Bloc } from "@/lib/data";
import { createMockRepository } from "@/lib/mockRepository";

export type ArticleRecord = Article & { id: string };

export type ArticleInput = Omit<Article, "slug">;

export class ArticleApiError extends Error {}

const seed: ArticleRecord[] = actualites.map((article) => ({ ...article, id: article.slug }));

const repository = createMockRepository<ArticleRecord>("vovinam_articles", seed);

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
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

export async function listArticles(): Promise<ArticleRecord[]> {
  return repository.list();
}

export async function getArticleBySlug(slug: string): Promise<ArticleRecord | undefined> {
  return repository.get(slug);
}

export async function createArticle(input: ArticleInput): Promise<ArticleRecord> {
  const slug = slugify(input.titre);
  if (!slug) {
    throw new ArticleApiError("Le titre de l'article est requis pour générer son lien.");
  }
  const existing = await repository.get(slug);
  if (existing) {
    throw new ArticleApiError(`Un article avec le lien "${slug}" existe déjà.`);
  }
  return repository.create({ ...input, slug, id: slug });
}

export async function updateArticle(slug: string, input: ArticleInput): Promise<ArticleRecord> {
  return repository.update(slug, input);
}

export async function deleteArticle(slug: string): Promise<void> {
  return repository.remove(slug);
}
