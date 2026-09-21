import { extractErrorMessage } from "@/lib/apiError";

export const API_URL = process.env.NEXT_PUBLIC_API_BACK_END;

export type UserRole = "admin" | "adherent";

export type CurrentUser = {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: UserRole;
};

export type TokenResponse = {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
  user: CurrentUser;
};

export class AuthError extends Error {}

export async function login(email: string, password: string): Promise<TokenResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new AuthError(await extractErrorMessage(response, "Connexion impossible."));
  }

  return response.json();
}

export async function refresh(): Promise<TokenResponse | null> {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) return null;
  return response.json();
}

export async function logout(): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" });
}

export async function getCurrentUser(accessToken: string): Promise<CurrentUser | null> {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) return null;
  return response.json();
}
