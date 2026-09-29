export function requis(valeur: string, message = "Ce champ est requis."): string | undefined {
  return valeur.trim() ? undefined : message;
}

export function longueurMax(valeur: string, max: number, message?: string): string | undefined {
  return valeur.length > max ? message ?? `${max} caractères maximum.` : undefined;
}

export function estEmailValide(valeur: string): string | undefined {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valeur.trim()) ? undefined : "Adresse email invalide.";
}

export function estDateIsoValide(valeur: string): string | undefined {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valeur.trim());
  if (!m) return "Date invalide.";
  const annee = Number(m[1]);
  const mois = Number(m[2]);
  const jour = Number(m[3]);
  const date = new Date(annee, mois - 1, jour);
  const valide = date.getFullYear() === annee && date.getMonth() === mois - 1 && date.getDate() === jour;
  return valide ? undefined : "Cette date n'existe pas.";
}

export function estTelephoneValide(valeur: string): string | undefined {
  return /^0\d([\s.-]?\d{2}){4}$/.test(valeur.trim()) ? undefined : "Numéro invalide (ex : 06 12 34 56 78).";
}

export function estCodePostalValide(valeur: string): string | undefined {
  return /^\d{5}$/.test(valeur.trim()) ? undefined : "Code postal invalide (5 chiffres).";
}

export function estAgeMinimum(valeur: string, anneesMin: number): string | undefined {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valeur.trim());
  if (!m) return undefined;
  const date = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const limite = new Date();
  limite.setFullYear(limite.getFullYear() - anneesMin);
  return date <= limite ? undefined : `L'adhérent doit avoir au moins ${anneesMin} ans.`;
}

export function isDateInTheFutur(valeur: string): string | undefined {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valeur.trim());
  if (!m) return undefined;

  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const date = new Date(year, month - 1, day);
  const isValid = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  if (!isValid) return undefined;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date <= today ? undefined : "La date ne peut pas être dans le futur.";
}

export function longueurEntre(valeur: string, min: number, max: number): string | undefined {
  const longueur = valeur.trim().length;
  return longueur < min || longueur > max ? `Entre ${min} et ${max} caractères.` : undefined;
}

export function contientUneLettre(valeur: string, message = "Doit contenir au moins une lettre."): string | undefined {
  return /\p{L}/u.test(valeur) ? undefined : message;
}

const REGEX_TAG = /^[a-z0-9à-öø-ÿœæ][a-z0-9à-öø-ÿœæ -]{1,29}$/;

export function estTagValide(tag: string): string | undefined {
  return REGEX_TAG.test(tag)
    ? undefined
    : `Étiquette "${tag}" invalide : 2 à 30 caractères, lettres, chiffres, espaces ou tirets.`;
}

export type Reseau = "facebook" | "instagram" | "youtube";

const REGEX_RESEAUX: Record<Reseau, { regex: RegExp; nom: string; exemple: string }> = {
  facebook: {
    regex: /^https:\/\/(www\.|m\.)?(facebook\.com|fb\.watch)\/\S+$/,
    nom: "Facebook",
    exemple: "https://www.facebook.com/…",
  },
  instagram: {
    regex: /^https:\/\/(www\.)?instagram\.com\/\S+$/,
    nom: "Instagram",
    exemple: "https://www.instagram.com/…",
  },
  youtube: {
    regex: /^https:\/\/(www\.|m\.)?(youtube\.com\/\S+|youtu\.be\/\S+)$/,
    nom: "YouTube",
    exemple: "https://www.youtube.com/watch?v=… ou https://youtu.be/…",
  },
};

export function estUrlReseau(valeur: string, reseau: Reseau): string | undefined {
  const url = valeur.trim();
  if (!url) return undefined;
  const { regex, nom, exemple } = REGEX_RESEAUX[reseau];
  return url.length <= 500 && regex.test(url) ? undefined : `Lien ${nom} invalide (ex : ${exemple}).`;
}
