type LoaderProps = {
  label?: string;
  size?: "sm" | "md";
  className?: string;
};

export default function Loader({ label = "Chargement…", size = "md", className = "" }: LoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={["flex items-center justify-center gap-3 text-encre-50", className].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "flex-none animate-spin rounded-full border-2 border-vovinam-100 border-t-vovinam",
          size === "sm" ? "size-5" : "size-8",
        ].join(" ")}
      />
      <span className={size === "sm" ? "text-[0.88rem]" : "text-[0.93rem] font-semibold"}>{label}</span>
    </div>
  );
}
