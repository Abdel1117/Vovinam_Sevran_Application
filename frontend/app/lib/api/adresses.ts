/**
 * Autocomplétion d'adresses via le service de géocodage de l'IGN (Géoplateforme,
 * successeur de api-adresse.data.gouv.fr) : gratuit, sans clé, France uniquement.
 */
const GEOCODAGE_URL = "https://data.geopf.fr/geocodage/search";

// Les résultats proches du club remontent en premier.
const CLUB = { lat: 48.9386, lon: 2.5275 };

export type AdresseSuggestion = {
  label: string;
  contexte: string;
  latitude: number;
  longitude: number;
};

type Feature = {
  geometry: { coordinates: [number, number] };
  properties: { label: string; context?: string };
};

export async function rechercherAdresses(
  texte: string,
  signal?: AbortSignal,
): Promise<AdresseSuggestion[]> {
  const params = new URLSearchParams({
    q: texte,
    limit: "6",
    autocomplete: "1",
    lat: String(CLUB.lat),
    lon: String(CLUB.lon),
  });
  const response = await fetch(`${GEOCODAGE_URL}?${params}`, { signal });
  if (!response.ok) throw new Error("Service d'adresses indisponible.");
  const data: { features: Feature[] } = await response.json();
  return data.features.map((f) => ({
    label: f.properties.label,
    contexte: f.properties.context ?? "",
    longitude: f.geometry.coordinates[0],
    latitude: f.geometry.coordinates[1],
  }));
}

/** Ouvre l'itinéraire dans Google Maps (appli sur mobile, site sur ordinateur). */
export function itineraireUrl(adresse: string): string {
  // Adresse seule (déjà normalisée par l'autocomplétion) : ajouter le nom du lieu peut égarer Google.
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(adresse)}`;
}

/** Carte OpenStreetMap intégrable (iframe) centrée sur le point, avec un marqueur. */
export function carteEmbedUrl(latitude: number, longitude: number): string {
  const delta = 0.004;
  const bbox = [longitude - delta, latitude - delta * 0.6, longitude + delta, latitude + delta * 0.6]
    .map((v) => v.toFixed(6))
    .join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude.toFixed(6)},${longitude.toFixed(6)}`;
}

export function carteUrl(latitude: number, longitude: number): string {
  return `https://www.openstreetmap.org/?mlat=${latitude.toFixed(6)}&mlon=${longitude.toFixed(6)}#map=17/${latitude.toFixed(6)}/${longitude.toFixed(6)}`;
}
