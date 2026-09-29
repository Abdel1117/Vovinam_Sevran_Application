import Link from "next/link";
import ArticleCard from "@/components/ArticleCard/ArticleCard";
import Reveal from "@/components/Reveal/Reveal";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import { listArticles } from "@/lib/api/articles";

const NOMBRE_ARTICLES = 3;

export default async function News() {
  const articles = (await listArticles().catch(() => [])).slice(
    0,
    NOMBRE_ARTICLES,
  );
  if (articles.length === 0) return null;

  return (
    <section id="articles" className="bg-white py-20 lg:py-30">
      <div className="mx-auto max-w-[1360px] px-2 md:px-7">
        <SectionTitle
          label="Actualités du club"
          titre="Dernières actualités"
          accent="bg-vovinam"
        />
        <div className="flex flex-wrap gap-6">
          {articles.map((a, i) => (
            <ArticleCard key={a.slug} article={a} delay={i * 70} />
          ))}
        </div>
        <Reveal className="mt-11 flex justify-center">
          <Link
            href="/actualites"
            className="rounded-full border-[1.5px] border-[#dce4f7] px-7 py-4.5 text-[15px] font-bold text-vovinam transition-colors hover:border-vovinam hover:bg-vovinam-050"
          >
            Voir toutes les actualités
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
