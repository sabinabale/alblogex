import { useState, useEffect } from "react";
import { User } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@/lib/supabase-client";
import { Article } from "@/types/supabase";
import { queries } from "@/lib/supabase-shared-queries";

type DashboardState = {
  user: User | null;
  articles: Article[];
  isLoading: boolean;
  error: string | null;
};

export default function useDashboardData() {
  const [state, setState] = useState<DashboardState>({
    user: null,
    articles: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const supabase = createClient();

    async function fetchDashboardData() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;

        if (!user) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: "User not found",
          }));
          return;
        }

        const { data, error: articlesError } = await queries.getUserPosts(
          supabase,
          user.id
        );
        if (articlesError) throw articlesError;

        const formattedArticles: Article[] =
          data?.map((article) => ({
            id: article.id,
            title: article.title,
            perex: article.content.substring(0, 100),
            author: article.author?.name || "Unknown",
            comments: article.comments[0]?.count || 0,
          })) || [];

        setState({
          user,
          articles: formattedArticles,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error:
            err instanceof Error ? err.message : "An unknown error occurred",
        }));
      }
    }

    fetchDashboardData();
  }, []);

  const setArticles: React.Dispatch<React.SetStateAction<Article[]>> = (
    newArticlesOrUpdater
  ) => {
    setState((prev) => ({
      ...prev,
      articles:
        typeof newArticlesOrUpdater === "function"
          ? newArticlesOrUpdater(prev.articles)
          : newArticlesOrUpdater,
    }));
  };

  return {
    user: state.user,
    articles: state.articles,
    isLoading: state.isLoading,
    error: state.error,
    setArticles,
  } as const;
}
