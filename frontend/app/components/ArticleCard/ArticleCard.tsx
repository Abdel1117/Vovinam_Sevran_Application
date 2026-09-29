import Link from "next/link";
import Badge from "@/components/Badge/Badge";
import Reveal from "@/components/Reveal/Reveal";
import { categorieBadge } from "@/lib/data";
import { formatDateArticle, type ArticlePublic } from "@/lib/api/articles";

type ArticleCardProps = {
  article: ArticlePublic;
  delay?: number;
  /** Version courte (« À lire aussi ») : image plus basse, sans chapô. */
  compact?: boolean;
};

export default function ArticleCard({
  article,
  delay = 0,
  compact = false,
}: ArticleCardProps) {
  return (
    <Reveal
      delay={delay}
      className="group relative flex min-w-[300px] flex-1 flex-col overflow-hidden rounded-card border border-trait bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
    >
      <div
        className={[
          "relative overflow-hidden bg-[repeating-linear-gradient(135deg,#e9eeff_0_12px,#dce5ff_12px_24px)]",
          compact ? "h-47" : "h-52",
        ].join(" ")}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.vignette}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge
          variant={categorieBadge[article.categorie]}
          className="absolute top-4 left-4"
        >
          {article.categorie}
        </Badge>
      </div>
      <div
        className={[
          "flex flex-1 flex-col gap-2.5",
          compact ? "px-6 pt-5.5 pb-6.5" : "px-6.5 pt-6 pb-7",
        ].join(" ")}
      >
        <span className="text-xs font-semibold tracking-[0.12em] text-encre-30 uppercase">
          {formatDateArticle(article.date)}
        </span>
        <h3
          className={[
            "font-display leading-snug font-extrabold text-encre",
            compact ? "text-lg" : "text-xl",
          ].join(" ")}
        >
          {article.titre}
        </h3>
        {compact ? null : (
          <p className="text-[0.96rem] leading-relaxed text-encre-50">
            {article.chapo}
          </p>
        )}
        <Link
          href={"/actualites/" + article.slug}
          className="mt-auto pt-2.5 text-sm font-bold text-vovinam after:absolute after:inset-0"
        >
          Lire l&apos;article →
        </Link>
      </div>
    </Reveal>
  );
}
