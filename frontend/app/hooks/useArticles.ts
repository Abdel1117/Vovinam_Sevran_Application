"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { deleteArticle, listArticles, type ArticlePublic } from "@/lib/api/articles";

export function useArticles() {
  const { authorizedFetch } = useAuth();
  const [articles, setArticles] = useState<ArticlePublic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setArticles(await listArticles());
    } catch {
      setError("Impossible de charger les articles.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const removeArticle = useCallback(
    async (slug: string) => {
      await deleteArticle(authorizedFetch, slug);
      setArticles((prev) => prev.filter((a) => a.slug !== slug));
    },
    [authorizedFetch],
  );

  return { articles, isLoading, error, refresh, removeArticle };
}
