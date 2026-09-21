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
