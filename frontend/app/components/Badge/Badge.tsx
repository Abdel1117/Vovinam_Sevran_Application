import type { ReactNode } from "react";
import { badgeStyles, type BadgeVariant } from "@/lib/data";

type BadgeProps = {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
};

export default function Badge({ variant = "actualite", children, className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-lg px-3 py-2 text-[10px] font-bold tracking-[0.14em] uppercase",
        badgeStyles[variant] ?? badgeStyles.actualite,
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
