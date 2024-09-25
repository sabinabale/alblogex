"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import MyArticleTable from "../../../components/MyArticleTable";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/auth-helpers-nextjs";

interface Article {
  id: number;
  title: string;
  perex: string;
  author: string;
  comments: number;
}

interface PostData {
  id: number;
  title: string;
  content: string;
  author: { name: string };
  Comment: { count: number }[];
}

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const fetchArticles = useCallback(
    async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from("Post")
          .select(
            `
            id,
            title,
            content,
            author:User(name),
            Comment(count)
          `
          )
          .eq("authorId", userId);

        if (error) throw error;

        const formattedArticles: Article[] = (
          data as unknown as PostData[]
        ).map((article) => ({
          id: article.id,
          title: article.title,
          perex: article.content.substring(0, 100),
          author: article.author?.name || "Unknown",
          comments: article.Comment[0]?.count || 0,
        }));

        setArticles(formattedArticles);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch articles"
        );
      }
    },
    [supabase]
  );

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) throw error;

        if (user) {
          setUser(user);
          await fetchArticles(user.id);
        } else {
          router.push("/signin");
        }
      } catch (err) {
        console.error("Authentication error:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [router, supabase.auth, fetchArticles]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p>
        <button onClick={() => router.push("/signin")}>
          Return to Sign In
        </button>
      </div>
    );
  }

  if (!user) {
    router.push("/signin");
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 items-center">
        <h1 className="text-2xl font-semibold">
          {user?.user_metadata?.name ? `${user.user_metadata.name}'s` : "My"}{" "}
          articles
        </h1>
        <Link
          href="/create-article"
          className="w-fit py-1.5 px-3 text-sm bg-black text-white rounded-lg"
        >
          Create article
        </Link>
      </div>
      <MyArticleTable articles={articles} setArticles={setArticles} />
    </div>
  );
}
