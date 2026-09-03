import type { ReactNode } from "react";

export type SocialName = "facebook" | "instagram" | "youtube";

const icons: Record<SocialName, ReactNode> = {
  facebook: (
    <path
      d="M13.3 21v-8h2.8l.4-3.2h-3.2V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.6-.1-2.6 0-4.3 1.6-4.3 4.4v2.1H6.9V13h2.8v8h3.6Z"
      fill="currentColor"
    />
  ),
  instagram: (
    <>
      <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.1" cy="6.9" r="1.3" fill="currentColor" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.6" y="5.4" width="18.8" height="13.2" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10.4 9.3 15.8 12l-5.4 2.7V9.3Z" fill="currentColor" />
    </>
  ),
};

export function SocialIcon({ name, className = "" }: { name: SocialName; className?: string }) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true" className={className}>
      {icons[name]}
    </svg>
  );
}

export default function SocialLinks({ tone = "sombre" }: { tone?: "sombre" | "clair" }) {
  const base =
    tone === "sombre"
      ? "border-white/20 text-white hover:bg-white/15"
      : "border-trait text-encre-70 hover:border-vovinam hover:text-vovinam";
  return (
    <div className="flex gap-2.5">
      {(["facebook", "instagram", "youtube"] as SocialName[]).map((n) => (
        <a
          key={n}
          href="#"
          aria-label={n}
          className={[
            "flex size-[42px] items-center justify-center rounded-xl border transition-all duration-200 hover:-translate-y-0.5",
            base,
          ].join(" ")}
        >
          <SocialIcon name={n} />
        </a>
      ))}
    </div>
  );
}
