export type NavItem = { label: string; href: string; children?: NavItem[] };

export type BadgeVariant = "actualite" | "association" | "stage" | "competition" | "club";

export type Valeur = { titre: string; texte: string };

export type Cours = {
  titre: string;
  niveau: string;
  badge: BadgeVariant;
  texte: string;
  horaires: string;
  lieu: string;
  photo: string;
};

export type Bloc = { type: "p" | "h2" | "quote"; texte: string; auteur?: string };

export type Article = {
  slug: string;
  titre: string;
  categorie: string;
  badge: BadgeVariant;
  date: string;
  auteur: string;
  lecture: string;
  chapo: string;
  photo: string;
  corps: Bloc[];
  tags: string[];
};

export type Evenement = {
  jour: string;
  mois: string;
  type: string;
  badge: BadgeVariant;
  titre: string;
  lieu: string;
  horaire: string;
};

export type Statistique = { valeur: number; suffixe: string; label: string };

export type Enseignant = { nom: string; grade: string; role: string; texte: string };

export type PhotoGalerie = { id: string; titre: string; categorie: string; date: string };

export type Adherent = {
  nom: string;
  prenom: string;
  licence: string;
  grade: string;
  couleur: string;
  naissance: string;
  categorie: "Enfants" | "Adolescents" | "Adultes";
  statut: "À jour" | "En attente";
  email: string;
  telephone: string;
  adresse: string;
  dateGrade: string;
  certificat: "Valide" | "Manquant";
  assurance: string;
};

export const navigation: NavItem[] = [
  {
    label: "Accueil",
    href: "/",
    children: [
      { label: "Le Vovinam", href: "/#vovinam" },
      { label: "Actualitées", href: "/#actu" },
      { label: "L'association", href: "/#valeurs" },
      { label: "Cours", href: "/#cours" },
      { label: "Agenda", href: "/#agenda" },
      { label: "Vie du club", href: "/#galerie" },
      { label: "Statistiques", href: "/#stats" },
      { label: "Les enseignants", href: "/#enseignants" },
      { label: "Envie d'essayer ?", href: "/#essai" },
    ],
  },
  { label: "Actualités", href: "/actualites" },
  { label: "Galerie", href: "/galerie" },
  { label: "Contact", href: "/contact" },
];

export const badgeStyles: Record<BadgeVariant, string> = {
  actualite: "bg-vovinam text-white",
  association: "bg-vovinam text-white",
  stage: "bg-jaune text-encre",
  competition: "bg-rouge text-white",
  club: "bg-vovinam-100 text-vovinam",
};

export const valeurs: Valeur[] = [
  { titre: "Respect", texte: "Respecter ses partenaires, ses enseignants et soi-même." },
  { titre: "Discipline", texte: "Progresser grâce au travail, à la régularité et à la persévérance." },
  { titre: "Maîtrise", texte: "Développer sa technique, son corps et son contrôle." },
  { titre: "Dépassement", texte: "Apprendre à repousser progressivement ses propres limites." },
];

export const cours: Cours[] = [
  {
    titre: "Enfants",
    niveau: "7 – 11 ans",
    badge: "stage",
    texte: "Découverte ludique, motricité, discipline et confiance.",
    horaires: "Lundi/Vendredi 19:00 — 20:00",
    lieu: "Gymnase Gaston bussière - Salle Verte",
    photo: "cours enfants",
  },
  {
    titre: "Adolescents",
    niveau: "12 – 17 ans",
    badge: "actualite",
    texte: "Technique, condition physique et progression personnelle. Initiation Combat",
    horaires: "Lundi/Vendredi 19:00 — 20:00",
    lieu: "Gymnase Gaston bussière - Salle Verte",
    photo: "cours ados",
  },
  {
    titre: "Adultes",
    niveau: "18 ans et +",
    badge: "actualite",
    texte: "Art martial complet : défense, technique et condition physique.",
    horaires: "Lundi/Vendredi 20:00 — 22:15",
    lieu: "Gymnase Gaston bussière - Salle Verte",
    photo: "cours adultes",
  },
];

export const actualites: Article[] = [
  {
    slug: "retour-stage-regional",
    titre: "Retour sur notre dernier stage régional",
    categorie: "Stage",
    badge: "stage",
    date: "21 août 2026",
    auteur: "Claire Nguyen",
    lecture: "4 min",
    chapo:
      "Trois jours de pratique intensive à Sevran : quyen, travail aux armes, applications et un examen blanc pour les candidats au passage de grades.",
    photo: "stage régional",
    corps: [
      { type: "p", texte: "Le stage régional a réuni cette année soixante-douze pratiquants venus de six clubs. Trois jours structurés autour d'un fil conducteur simple : revenir aux fondamentaux avant d'aborder les enchaînements les plus techniques du programme." },
      { type: "h2", texte: "Une première journée consacrée aux bases" },
      { type: "p", texte: "Déplacements, gardes, frappes directes : la matinée a été menée par les enseignants du club sur un rythme volontairement lent, afin de corriger les postures individuellement." },
      { type: "quote", texte: "Un stage n'est pas là pour ajouter des techniques, mais pour rendre celles que l'on connaît déjà plus justes.", auteur: "Minh Trân, directeur technique" },
      { type: "h2", texte: "Armes traditionnelles et quyen" },
      { type: "p", texte: "La deuxième journée a été consacrée au bâton long et au sabre, avec deux ateliers tournants. Les ceintures les plus avancées ont travaillé les quyen du programme de passage." },
      { type: "h2", texte: "Examen blanc et bilan" },
      { type: "p", texte: "La dernière matinée a pris la forme d'un examen blanc pour les dix-huit candidats inscrits à la session d'octobre, avec un retour individuel détaillé." },
    ],
    tags: ["stage", "technique", "passage de grades", "vie du club"],
  },
  {
    slug: "resultats-open-de-paris",
    titre: "Résultats de l'Open de Paris",
    categorie: "Compétition",
    badge: "competition",
    date: "12 juillet 2026",
    auteur: "Karim Belhadj",
    lecture: "3 min",
    chapo: "Six médailles pour nos compétiteurs sur les tableaux technique et combat.",
    photo: "podium",
    corps: [{ type: "p", texte: "Neuf compétiteurs engagés, six médailles rapportées. Le détail des résultats par catégorie." }],
    tags: ["compétition", "résultats"],
  },
  {
    slug: "passage-de-grades",
    titre: "Passage de grades de fin de saison",
    categorie: "Vie du club",
    badge: "actualite",
    date: "28 juin 2026",
    auteur: "Minh Trân",
    lecture: "2 min",
    chapo: "Dix-huit pratiquants ont validé leur nouveau grade en fin de saison.",
    photo: "passage de grades",
    corps: [{ type: "p", texte: "Retour sur la session d'examens organisée au dojo 1." }],
    tags: ["grades", "vie du club"],
  },
  {
    slug: "nouvelle-saison",
    titre: "Nouvelle saison, nouvelles inscriptions",
    categorie: "Association",
    badge: "association",
    date: "02 septembre 2026",
    auteur: "Claire Nguyen",
    lecture: "2 min",
    chapo: "Les inscriptions sont ouvertes pour tous les groupes, dans la limite des places disponibles.",
    photo: "groupe rentrée",
    corps: [{ type: "p", texte: "Créneaux, tarifs et documents à fournir pour la saison 2026 / 2027." }],
    tags: ["inscriptions", "association"],
  },
];

export const evenements: Evenement[] = [
  { jour: "14", mois: "SEP", type: "Stage", badge: "stage", titre: "Stage régional", lieu: "Salle omnisports — Sevran", horaire: "09:00 — 17:00" },
  { jour: "28", mois: "SEP", type: "Compétition", badge: "competition", titre: "Open de Paris", lieu: "Halle Georges-Carpentier — Paris 13e", horaire: "08:30 — 18:00" },
  { jour: "12", mois: "OCT", type: "Passage de grades", badge: "club", titre: "Examens de ceintures", lieu: "Gymnase Jean-Moulin — Dojo 1", horaire: "14:00 — 18:00" },
  { jour: "09", mois: "NOV", type: "Démonstration", badge: "club", titre: "Fête des associations", lieu: "Place de la Mairie", horaire: "11:00 — 12:00" },
];

export const statistiques: Statistique[] = [
  { valeur: 30, suffixe: "", label: "Années d'expérience" },
  { valeur: 3, suffixe: "", label: "Cours par semaine" },
  { valeur: 6, suffixe: "+", label: "Événements par an" },
];

export const enseignants: Enseignant[] = [
  { nom: "Julien Saffou", grade: "Ceinture Noir 2e dan", role: "Enseignant Principal", texte: "Pratique depuis 20 ans." },
  { nom: "Claire Nguyen", grade: "Ceinture Noir 1e dan", role: "Enseignant", texte: "Elle construit une pédagogie ludique autour de la motricité et du respect." },
  { nom: "Karim Belhadj", grade: "Ceinture Noir 1e dan", role: "Enseignant", texte: "Il prépare les compétiteurs sur les épreuves techniques et de combat." },
  { nom: "Léa Fontaine",  grade: "Ceinture Noir 1e dan", role: "Enseignant", texte: "Elle accompagne les adolescents dans la technique et la confiance en soi." },
];

export const photos: PhotoGalerie[] = [
  { id: "gal-01", titre: "Travail technique à deux", categorie: "Entraînement", date: "Juin 2026" },
  { id: "gal-02", titre: "Stage régional de printemps", categorie: "Stage", date: "Avril 2026" },
  { id: "gal-03", titre: "Open de Paris — finales", categorie: "Compétition", date: "Mars 2026" },
  { id: "gal-04", titre: "Démonstration fête des associations", categorie: "Démonstration", date: "Septembre 2025" },
  { id: "gal-05", titre: "Groupe enfants du mercredi", categorie: "Enfants", date: "Mai 2026" },
  { id: "gal-06", titre: "Quyen — passage de grades", categorie: "Entraînement", date: "Décembre 2025" },
  { id: "gal-07", titre: "Stage d'été à la mer", categorie: "Stage", date: "Août 2025" },
  { id: "gal-08", titre: "Podium par équipes", categorie: "Compétition", date: "Février 2026" },
  { id: "gal-09", titre: "Photo de groupe de fin de saison", categorie: "Démonstration", date: "Juin 2026" },
  { id: "gal-10", titre: "Atelier armes traditionnelles", categorie: "Entraînement", date: "Janvier 2026" },
  { id: "gal-11", titre: "Baby Vovinam — motricité", categorie: "Enfants", date: "Mars 2026" },
  { id: "gal-12", titre: "Stage national à Lyon", categorie: "Stage", date: "Novembre 2025" },
];

export const categoriesGalerie: string[] = ["Tous", "Entraînement", "Stage", "Compétition", "Démonstration", "Enfants"];

export const adherents: Adherent[] = [
  { nom: "Mercier", prenom: "Lucas", licence: "VVD-2026-0142", grade: "Bleu 1er cấp", couleur: "#1851D9", naissance: "12/04/1998", categorie: "Adultes", statut: "À jour", email: "lucas.mercier@email.fr", telephone: "06 12 00 00 00", adresse: "18 rue Victor-Hugo, 94400 Sevran", dateGrade: "15/06/2025", certificat: "Valide", assurance: "Incluse" },
  { nom: "Benali", prenom: "Sarah", licence: "VVD-2026-0143", grade: "Bleu ciel", couleur: "#7FB2FF", naissance: "03/09/2017", categorie: "Enfants", statut: "En attente", email: "famille.benali@email.fr", telephone: "06 34 00 00 00", adresse: "5 allée des Lilas, 94400 Sevran", dateGrade: "20/06/2026", certificat: "Manquant", assurance: "Incluse" },
  { nom: "Nguyen", prenom: "Thomas", licence: "VVD-2026-0118", grade: "Jaune 1er cấp", couleur: "#FFFF01", naissance: "27/01/2010", categorie: "Adolescents", statut: "À jour", email: "thomas.nguyen@email.fr", telephone: "07 55 00 00 00", adresse: "42 avenue de la République, 94200 Ivry-sur-Seine", dateGrade: "12/10/2025", certificat: "Valide", assurance: "Incluse" },
  { nom: "Fontaine", prenom: "Léa", licence: "VVD-2026-0087", grade: "Jaune 2e cấp", couleur: "#FFFF01", naissance: "08/07/1996", categorie: "Adultes", statut: "À jour", email: "lea.fontaine@email.fr", telephone: "06 78 00 00 00", adresse: "9 rue des Écoles, 94400 Sevran", dateGrade: "14/06/2024", certificat: "Valide", assurance: "Incluse" },
  { nom: "Belhadj", prenom: "Karim", licence: "VVD-2026-0021", grade: "Jaune 3e cấp", couleur: "#FFFF01", naissance: "22/11/1989", categorie: "Adultes", statut: "À jour", email: "karim.belhadj@email.fr", telephone: "06 90 00 00 00", adresse: "77 boulevard Paul-Vaillant, 94400 Sevran", dateGrade: "18/06/2023", certificat: "Valide", assurance: "Incluse" },
  { nom: "Dubois", prenom: "Emma", licence: "VVD-2026-0155", grade: "Bleu ciel", couleur: "#7FB2FF", naissance: "16/05/2015", categorie: "Enfants", statut: "À jour", email: "famille.dubois@email.fr", telephone: "06 21 00 00 00", adresse: "3 impasse du Parc, 94400 Sevran", dateGrade: "20/06/2026", certificat: "Valide", assurance: "Incluse" },
  { nom: "Trân", prenom: "Minh", licence: "VVD-2026-0003", grade: "Rouge 3e cấp", couleur: "#FE0000", naissance: "02/03/1978", categorie: "Adultes", statut: "À jour", email: "minh.tran@email.fr", telephone: "06 11 00 00 00", adresse: "21 rue des Sports, 94400 Sevran", dateGrade: "10/12/2021", certificat: "Valide", assurance: "Incluse" },
  { nom: "Rossi", prenom: "Matteo", licence: "VVD-2026-0129", grade: "Bleu 2e cấp", couleur: "#1851D9", naissance: "30/08/2009", categorie: "Adolescents", statut: "En attente", email: "famille.rossi@email.fr", telephone: "07 12 00 00 00", adresse: "14 rue Danielle-Casanova, 94200 Ivry-sur-Seine", dateGrade: "12/10/2025", certificat: "Valide", assurance: "Incluse" },
  { nom: "Nguyen", prenom: "Claire", licence: "VVD-2026-0009", grade: "Rouge 1er cấp", couleur: "#FE0000", naissance: "19/02/1985", categorie: "Adultes", statut: "À jour", email: "claire.nguyen@email.fr", telephone: "06 45 00 00 00", adresse: "6 rue Camille-Groult, 94400 Sevran", dateGrade: "11/12/2022", certificat: "Valide", assurance: "Incluse" },
  { nom: "Lopes", prenom: "Hugo", licence: "VVD-2026-0161", grade: "Bleu ciel", couleur: "#7FB2FF", naissance: "04/12/2018", categorie: "Enfants", statut: "En attente", email: "famille.lopes@email.fr", telephone: "06 66 00 00 00", adresse: "31 rue Charles-Fourier, 94400 Sevran", dateGrade: "—", certificat: "Manquant", assurance: "Incluse" },
  { nom: "Haddad", prenom: "Nour", licence: "VVD-2026-0134", grade: "Bleu 1er cấp", couleur: "#1851D9", naissance: "25/06/2008", categorie: "Adolescents", statut: "À jour", email: "nour.haddad@email.fr", telephone: "07 88 00 00 00", adresse: "2 place du Marché, 94400 Sevran", dateGrade: "12/10/2025", certificat: "Valide", assurance: "Incluse" },
  { nom: "Girard", prenom: "Antoine", licence: "VVD-2026-0076", grade: "Jaune 1er cấp", couleur: "#FFFF01", naissance: "11/10/1992", categorie: "Adultes", statut: "À jour", email: "antoine.girard@email.fr", telephone: "06 30 00 00 00", adresse: "48 avenue Rouget-de-Lisle, 94400 Sevran", dateGrade: "15/06/2025", certificat: "Valide", assurance: "Incluse" },
];

export function getArticle(slug: string): Article | undefined {
  return actualites.find((a) => a.slug === slug);
}
