import Link from "next/link";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ArticleCard from "@/components/ArticleCard/ArticleCard";
import type { Metadata } from "next";
import { listArticles, type ArticlePublic } from "@/lib/api/articles";

export const metadata: Metadata = { title: "Actualités — Vovinam Viet Vo Dao" };

type SearchParams = { tag?: string | string[] };

/** Tags triés du plus utilisé au moins utilisé. */
function tagsParFrequence(articles: ArticlePublic[]): string[] {
  const compte = new Map<string, number>();
  for (const a of articles)
    for (const t of a.tags) compte.set(t, (compte.get(t) ?? 0) + 1);
  return [...compte.entries()]
    .sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0], "fr"))
    .map(([t]) => t);
}

const puce =
  "rounded-full border-[1.5px] px-4 py-2.5 text-[0.86rem] font-semibold transition-all duration-200";
const puceActive = "border-vovinam bg-vovinam text-white";
const puceInactive =
  "border-[#e1e7f5] bg-white text-encre-70 hover:border-vovinam hover:text-vovinam";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const tag =
    typeof params.tag === "string" ? params.tag.toLowerCase() : undefined;

  let articles: ArticlePublic[] = [];
  let erreur = false;
  try {
    articles = await listArticles();
  } catch {
    erreur = true;
  }
  const tags = tagsParFrequence(articles);
  const resultats = tag
    ? articles.filter((a) => a.tags.includes(tag))
    : articles;

  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden bg-hero-vovinam px-7 pt-40 pb-16">
          <div className="mx-auto max-w-[1360px]">
            <span className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-white/15 px-4 py-2.5 text-xs font-semibold tracking-[0.16em] text-white uppercase">
              <span className="size-1.5 rounded-full bg-jaune" />
              Actualités
            </span>
            <h1 className="font-display text-4xl leading-[1.02] font-extrabold tracking-[-0.03em] text-balance text-white lg:text-6xl">
              LA VIE DU CLUB,
              <br />
              <span className="text-jaune">AU FIL DES SAISONS.</span>
            </h1>
          </div>
        </section>

        {tags.length > 0 ? (
          <div className="border-b border-trait bg-white">
            <nav
              aria-label="Filtrer par étiquette"
              className="mx-auto flex max-w-[1360px] flex-wrap items-center gap-2 px-2 py-4 md:px-7"
            >
              <Link
                href="/actualites"
                className={[puce, tag ? puceInactive : puceActive].join(" ")}
              >
                Tous
              </Link>
              {tags.map((t) => (
                <Link
                  key={t}
                  href={`/actualites?tag=${encodeURIComponent(t)}`}
                  className={[puce, t === tag ? puceActive : puceInactive].join(
                    " ",
                  )}
                >
                  #{t}
                </Link>
              ))}
              <span className="ml-auto pl-2 text-[0.88rem] font-semibold text-encre-30">
                {resultats.length} article{resultats.length > 1 ? "s" : ""}
              </span>
            </nav>
          </div>
        ) : null}

        <section className="bg-white py-16 lg:py-24">
          <div className="mx-auto flex max-w-[1360px] flex-wrap gap-6 px-2 md:px-7">
            {resultats.map((a, i) => (
              <ArticleCard key={a.slug} article={a} delay={(i % 6) * 70} />
            ))}
          </div>

          {resultats.length === 0 ? (
            <div className="flex flex-col items-center gap-2.5 px-6 py-10 text-center">
              <span className="font-display text-xl font-extrabold text-encre">
                {erreur
                  ? "Les actualités sont indisponibles"
                  : tag
                    ? `Aucun article pour #${tag}`
                    : "Aucune actualité pour le moment"}
              </span>
              <span className="text-encre-50">
                {erreur
                  ? "Réessayez dans quelques instants."
                  : "Revenez bientôt pour suivre la vie du club."}
              </span>
              {tag ? (
                <Link
                  href="/actualites"
                  className="mt-2 rounded-full bg-vovinam px-6 py-3.5 text-[0.92rem] font-bold text-white"
                >
                  Voir toutes les actualités
                </Link>
              ) : null}
            </div>
          ) : null}
        </section>
      </main>
      <Footer />
    </>
  );
}
