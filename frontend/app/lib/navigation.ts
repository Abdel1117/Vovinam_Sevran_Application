/**
 * État global « navigation en cours », alimenté par `onRouterTransitionStart`
 * (instrumentation-client.ts) et lu par NavigationOverlay.
 */

const DELAI_SECURITE_MS = 10_000;

let isNavigating = false;
let timer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

function emit(valeur: boolean) {
  if (isNavigating === valeur) return;
  isNavigating = valeur;
  listeners.forEach((l) => l());
}

export function subscribeNavigation(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getIsNavigating(): boolean {
  return isNavigating;
}

export function getIsNavigatingServer(): boolean {
  return false;
}

export function navigationStart(href: string) {
  const cible = new URL(href, window.location.href);
  // Même page (ou simple ancre #…) : l'URL ne changera pas, rien à attendre.
  if (cible.origin !== window.location.origin) return;
  if (cible.pathname === window.location.pathname && cible.search === window.location.search) return;

  if (timer) clearTimeout(timer);
  timer = setTimeout(navigationDone, DELAI_SECURITE_MS);
  emit(true);
}

export function navigationDone() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  emit(false);
}
