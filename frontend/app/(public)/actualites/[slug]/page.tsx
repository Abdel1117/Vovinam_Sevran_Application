import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Badge from "@/components/Badge/Badge";
import Reveal from "@/components/Reveal/Reveal";
import ArticleCard from "@/components/ArticleCard/ArticleCard";
import { SocialIcon, type SocialName } from "@/components/Social/Social";
import ReadingProgress from "@/components/ReadingProgress/ReadingProgress";
import { categorieBadge } from "@/lib/data";
import {
  formatDateArticle,
  getArticle as fetchArticle,
  listArticles,
  type ArticlePublic,
} from "@/lib/api/articles";

type Params = { slug: string };

// Dédoublonne l'appel entre generateMetadata et la page.
const getArticle = cache(fetchArticle);

function liensReseaux(
  article: ArticlePublic,
): { name: SocialName; label: string; url: string }[] {
  const liens: { name: SocialName; label: string; url: string | null }[] = [
    { name: "facebook", label: "Facebook", url: article.facebook_url },
    { name: "instagram", label: "Instagram", url: article.instagram_url },
    { name: "youtube", label: "YouTube", url: article.youtube_url },
  ];
  return liens.filter(
    (l): l is { name: SocialName; label: string; url: string } =>
      Boolean(l.url),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  return { title: article ? article.titre + " — Vovinam" : "Article" };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();
  const autres = (await listArticles().catch(() => []))
    .filter((a) => a.slug !== slug)
    .slice(0, 3);
  const liens = liensReseaux(article);

  return (
    <>
      <Header solide />
      <ReadingProgress />
      <article className="pt-26">
        <div className="mx-auto flex max-w-[820px] flex-col gap-5 px-2 md:px-7 pt-10 lg:pt-14">
          <nav className="flex flex-wrap items-center gap-2.5 text-[0.86rem] font-medium text-encre-30">
            <Link href="/" className="text-encre-30 hover:text-vovinam">
              Accueil
            </Link>
            <span>/</span>
            <Link
              href="/actualites"
              className="text-encre-30 hover:text-vovinam"
            >
              Actualités
            </Link>
            <span>/</span>
            <span className="text-encre-70">{article.titre}</span>
          </nav>
          <Badge
            variant={categorieBadge[article.categorie]}
            className="self-start"
          >
            {article.categorie}
          </Badge>
          <h1 className="font-display text-4xl leading-[1.05] font-extrabold tracking-[-0.03em] text-balance text-encre lg:text-6xl">
            {article.titre}
          </h1>
          <p className="text-xl leading-relaxed text-pretty text-[#4c5674]">
            {article.chapo}
          </p>
          <div className="flex flex-wrap items-center gap-4 border-y border-[#eff3fb] py-4.5">
            <span className="flex size-11 items-center justify-center rounded-xl bg-[#e9eeff] font-display text-[0.86rem] font-extrabold text-vovinam">
              {article.auteur
                .split(" ")
                .map((m: string) => m[0])
                .join("")}
            </span>
            <span className="mr-auto flex flex-col gap-1">
              <span className="text-[0.96rem] font-bold text-encre">
                {article.auteur}
              </span>
              <span className="text-[0.85rem] text-encre-30">
                {formatDateArticle(article.date)} · {article.lecture} de lecture
              </span>
            </span>
            {liens.length > 0 ? (
              <div className="flex gap-2.5">
                {liens.map((l) => (
                  <a
                    key={l.name}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Voir sur ${l.label}`}
                    title={`Voir sur ${l.label}`}
                    className="flex size-[42px] items-center justify-center rounded-xl border border-trait text-encre-70 transition-all duration-200 hover:-translate-y-0.5 hover:border-vovinam hover:text-vovinam"
                  >
                    <SocialIcon name={l.name} />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <Reveal className="mx-auto mt-10 max-w-[1200px] px-2 md:px-7">
          <div className="h-70 overflow-hidden rounded-3xl border border-trait bg-[repeating-linear-gradient(135deg,#e9eeff_0_12px,#dce5ff_12px_24px)] lg:h-[560px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.image}
              alt={article.titre}
              className="size-full object-cover"
            />
          </div>
        </Reveal>

        <div className="mx-auto flex max-w-[760px] flex-col gap-6.5 px-2 md:px-7 pt-12 lg:pt-16">
          {article.corps.map((bloc, i) => {
            if (bloc.type === "h2")
              return (
                <Reveal key={i} delay={20}>
                  <h2 className="mt-3.5 font-display text-2xl leading-tight font-extrabold tracking-tight text-encre lg:text-3xl">
                    {bloc.texte}
                  </h2>
                </Reveal>
              );
            if (bloc.type === "quote")
              return (
                <Reveal key={i} delay={20}>
                  <blockquote className="my-3.5 rounded-r-[18px] border-l-4 border-vovinam bg-vovinam-050 px-2 md:px-7 py-6.5">
                    <p className="text-xl leading-relaxed font-semibold text-pretty text-encre">
                      « {bloc.texte} »
                    </p>
                  </blockquote>
                </Reveal>
              );
            return (
              <Reveal key={i} delay={20}>
                <p className="text-[1.16rem] leading-[1.75] text-pretty text-[#28324d]">
                  {bloc.texte}
                </p>
              </Reveal>
            );
          })}

          {article.tags.length > 0 ? (
            <Reveal className="flex flex-wrap gap-2.5 border-t border-[#eff3fb] pt-4 pb-4">
              {article.tags.map((t) => (
                <Link
                  key={t}
                  href={`/actualites?tag=${encodeURIComponent(t)}`}
                  className="rounded-full border border-[#e7ecf7] bg-[#f4f7fe] px-4 py-2.5 text-[0.86rem] font-semibold text-encre-70 transition-colors hover:border-vovinam hover:text-vovinam"
                >
                  #{t}
                </Link>
              ))}
            </Reveal>
          ) : null}
        </div>
      </article>

      {autres.length > 0 ? (
        <section className="mt-16 bg-vovinam-050 py-16 lg:py-24">
          <div className="mx-auto max-w-[1360px] px-2 md:px-7">
            <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-2xl leading-tight font-extrabold tracking-[-0.025em] text-encre lg:text-4xl">
                À lire aussi
              </h2>
              <Link
                href="/actualites"
                className="rounded-full border-[1.5px] border-[#dce4f7] bg-white px-5 py-3.5 text-sm font-bold text-vovinam transition-colors hover:border-vovinam"
              >
                Toutes les actualités →
              </Link>
            </div>
            <div className="flex flex-wrap gap-5.5">
              {autres.map((a, i) => (
                <ArticleCard key={a.slug} article={a} delay={i * 70} compact />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <Footer />
    </>
  );
}
