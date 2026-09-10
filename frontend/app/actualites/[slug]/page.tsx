import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Badge from "@/components/ui/Badge";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import SocialLinks from "@/components/ui/Social";
import ReadingProgress from "@/components/site/ReadingProgress";
import { actualites, getArticle } from "@/lib/data";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return actualites.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  return { title: article ? article.titre + " — Vovinam" : "Article" };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const autres = actualites.filter((a) => a.slug !== slug).slice(0, 3);

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
          <Badge variant={article.badge} className="self-start">
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
                {article.date} · {article.lecture} de lecture
              </span>
            </span>
            <SocialLinks tone="clair" />
          </div>
        </div>

        <Reveal className="mx-auto mt-10 max-w-[1200px] px-2 md:px-7">
          <Photo
            label={"photo de couverture — " + article.photo}
            className="h-70 rounded-3xl border border-trait lg:h-[560px]"
          />
          <span className="mt-3 block text-[0.86rem] leading-relaxed text-encre-30">
            Les participants réunis à la fin de la deuxième journée.
          </span>
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
                    <p className="mb-3 text-xl leading-relaxed font-semibold text-pretty text-encre">
                      « {bloc.texte} »
                    </p>
                    <span className="text-[0.9rem] font-semibold text-encre-50">
                      {bloc.auteur}
                    </span>
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

          <Reveal className="flex flex-wrap gap-2.5 border-t border-[#eff3fb] pt-4">
            {article.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[#e7ecf7] bg-[#f4f7fe] px-4 py-2.5 text-[0.86rem] font-semibold text-encre-70"
              >
                #{t}
              </span>
            ))}
          </Reveal>
        </div>
      </article>

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
              <Reveal
                key={a.slug}
                delay={i * 70}
                className="group flex min-w-[300px] flex-1 flex-col overflow-hidden rounded-card border border-trait bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
              >
                <div className="relative">
                  <Photo label={"photo — " + a.photo} className="h-47" zoom />
                  <Badge
                    variant={a.badge}
                    className="absolute top-3.5 left-3.5"
                  >
                    {a.categorie}
                  </Badge>
                </div>
                <div className="flex flex-1 flex-col gap-2.5 px-6 pt-5.5 pb-6.5">
                  <span className="text-xs font-semibold tracking-[0.12em] text-encre-30 uppercase">
                    {a.date}
                  </span>
                  <h3 className="font-display text-lg leading-snug font-extrabold text-encre">
                    {a.titre}
                  </h3>
                  <Link
                    href={"/actualites/" + a.slug}
                    className="mt-auto pt-2 text-sm font-bold text-vovinam"
                  >
                    Lire l'article →
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
