import { navigationStart } from "@/lib/navigation";

// Appelé par Next.js au début de chaque navigation client (<Link>, router.push/replace…).
export function onRouterTransitionStart(href: string, type: "push" | "replace" | "traverse") {
  // Retour arrière/avant : l'URL a déjà changé et la page vient du cache.
  if (type === "traverse") return;
  navigationStart(href);
}
