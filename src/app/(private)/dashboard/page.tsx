"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import MyArticleTable from "../../../components/MyArticleTable";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/auth-helpers-nextjs";
import { MyArticleTableSkeleton } from "@/components/Skeletons";

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
  const [user, setUser] = useState<User | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      } finally {
        setIsLoading(false);
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
        router.push("/signin");
      }
    };

    getUser();
  }, [router, supabase.auth, fetchArticles]);

  if (!user) return null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 items-center">
        <h1 className="text-2xl font-semibold">
          {user.user_metadata?.name ? `${user.user_metadata.name}'s` : "My"}{" "}
          articles
        </h1>
        <Link
          href="/create-article"
          className="w-fit py-1.5 px-3 text-sm bg-black text-white rounded-lg"
        >
          Create article
        </Link>
      </div>
      {isLoading ? (
        <MyArticleTableSkeleton />
      ) : (
        <MyArticleTable articles={articles} setArticles={setArticles} />
      )}
    </div>
  );
}
