import Link from "next/link";
import type { ReactNode } from "react";

const variants = {
  jaune:
    "bg-jaune text-encre shadow-[0_12px_30px_rgb(0_0_0/0.18)] hover:-translate-y-0.5",
  bleu: "bg-vovinam text-white hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgb(24_81_217/0.3)]",
  blanc: "bg-white text-vovinam hover:-translate-y-0.5",
  contour:
    "border-[1.5px] border-[#dce4f7] text-vovinam hover:border-vovinam hover:bg-vovinam-050",
  contourClair:
    "border-[1.5px] border-white/55 text-white hover:border-white hover:bg-white/15",
};

type ButtonVariant = keyof typeof variants;

type ButtonProps = {
  href?: string;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};

export default function Button({
  href = "#",
  variant = "bleu",
  className = "",
  children,
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base  font-bold transition-all duration-200",
        variants[variant],
        className,
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
