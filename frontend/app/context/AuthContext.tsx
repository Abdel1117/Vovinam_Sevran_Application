"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import {
  API_URL,
  type CurrentUser,
  type TokenResponse,
  login as apiLogin,
  logout as apiLogout,
  refresh as apiRefresh,
} from "@/lib/auth";

const REFRESH_SKEW_MS = 60_000;

type AuthContextValue = {
  user: CurrentUser | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<CurrentUser>;
  logout: () => Promise<void>;
  authorizedFetch: (path: string, init?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accessTokenRef = useRef<string | null>(null);
  const refreshInFlightRef = useRef<Promise<TokenResponse | null> | null>(null);

  const runRefresh = useCallback((): Promise<TokenResponse | null> => {
    if (!refreshInFlightRef.current) {
      refreshInFlightRef.current = apiRefresh().finally(() => {
        refreshInFlightRef.current = null;
      });
    }
    return refreshInFlightRef.current;
  }, []);

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const applyTokenResponse = useCallback(
    (data: TokenResponse) => {
      setUser(data.user);
      setAccessToken(data.access_token);
      accessTokenRef.current = data.access_token;
      clearRefreshTimer();
      const delayMs = Math.max(data.expires_in * 1000 - REFRESH_SKEW_MS, 5_000);
      refreshTimerRef.current = setTimeout(() => {
        void silentRefresh();
      }, delayMs);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clearRefreshTimer],
  );

  const silentRefresh = useCallback(async (): Promise<TokenResponse | null> => {
    const data = await runRefresh();
    if (data) {
      applyTokenResponse(data);
    } else {
      setUser(null);
      setAccessToken(null);
      accessTokenRef.current = null;
      clearRefreshTimer();
    }
    return data;
  }, [runRefresh, applyTokenResponse, clearRefreshTimer]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const data = await runRefresh();
      if (!cancelled && data) applyTokenResponse(data);
      if (!cancelled) setIsLoading(false);
    })();

    return () => {
      cancelled = true;
      clearRefreshTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<CurrentUser> => {
      const data = await apiLogin(email, password);
      applyTokenResponse(data);
      return data.user;
    },
    [applyTokenResponse],
  );

  const logout = useCallback(async (): Promise<void> => {
    clearRefreshTimer();
    setUser(null);
    setAccessToken(null);
    accessTokenRef.current = null;
    await apiLogout();
  }, [clearRefreshTimer]);

  const authorizedFetch = useCallback(
    async (path: string, init: RequestInit = {}): Promise<Response> => {
      const doFetch = (token: string | null) =>
        fetch(`${API_URL}${path}`, {
          ...init,
          credentials: "include",
          headers: {
            ...(init.headers ?? {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

      let response = await doFetch(accessTokenRef.current);
      if (response.status === 401) {
        const data = await silentRefresh();
        if (data) {
          response = await doFetch(data.access_token);
        } else {
          await logout();
        }
      }
      return response;
    },
    [silentRefresh, logout],
  );

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, logout, authorizedFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
