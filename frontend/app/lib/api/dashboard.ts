import { extractErrorMessage } from "@/lib/apiError";
import type { AuthorizedFetch } from "@/lib/api/images";

export type TypeAdherentStat = "enfant" | "adolescent" | "adulte" | "encadrant";

export type DashboardStats = {
  adherents_actifs: number;
  adherents_nouveaux_saison: number;
  repartition_adherents: Record<TypeAdherentStat, number>;
  demandes_a_traiter: number;
  evenements_a_venir: number;
  prochain_evenement: { titre: string; date_debut: string } | null;
};

export async function getDashboardStats(fetcher: AuthorizedFetch): Promise<DashboardStats> {
  const response = await fetcher("/dashboard/stats");
  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, "Impossible de charger les statistiques."));
  }
  return response.json();
}
