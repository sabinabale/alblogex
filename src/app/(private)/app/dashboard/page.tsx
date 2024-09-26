"use client";

import React, { useEffect, useState } from "react";
import MyArticleTable from "@/components/MyArticleTable";
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
  const [user, setUser] = useState<User | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchUserAndArticles = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
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
            .eq("authorId", user.id);

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
        }
      } catch (err) {
        console.error("Error fetching user or articles:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndArticles();
  }, [supabase]);

  if (isLoading) {
    return <MyArticleTableSkeleton />;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 items-center">
        <h1 className="text-2xl font-semibold">
          {user?.user_metadata?.name ? `${user.user_metadata.name}'s` : "My"}{" "}
          articles
        </h1>
        <Link
          href="/app/create-article"
          className="w-fit py-1.5 px-3 text-sm bg-black text-white rounded-lg"
        >
          Create article
        </Link>
      </div>
      <MyArticleTable articles={articles} setArticles={setArticles} />
    </div>
  );
}
