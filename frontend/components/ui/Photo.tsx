/**
 * Emplacement photo. Remplacez le contenu par <Image /> de next/image
 * quand les vraies photos du club sont disponibles :
 *   <Image src={src} alt={alt} fill className="object-cover" />
 */
type PhotoProps = {
  /** Décrit ce que la photo doit montrer — sert aussi de texte alternatif. */
  label?: string;
  className?: string;
  /** Active le zoom au survol du parent .group */
  zoom?: boolean;
};

export default function Photo({
  label = "photo",
  className = "",
  zoom = false,
}: PhotoProps) {
  return (
    <div
      className={[
        "relative flex items-center justify-center overflow-hidden",
        "bg-[repeating-linear-gradient(135deg,#e9eeff_0_12px,#dce5ff_12px_24px)]",
        zoom ? "transition-transform duration-500 group-hover:scale-105" : "",
        className,
      ].join(" ")}
      role="img"
      aria-label={label}
    ></div>
  );
}
