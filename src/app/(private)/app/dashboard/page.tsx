"use client";

import React, { useEffect, useState } from "react";
import MyArticleTable from "@/components/articles/MyArticleTable";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/auth-helpers-nextjs";
import { MyArticleTableSkeleton } from "@/components/layout/Skeletons";
import { Article, PostData } from "@/types/types";

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
        <h1>
          {user?.user_metadata?.name
            ? `${user.user_metadata.name.split(" ")[0]}'s`
            : "My"}{" "}
          articles
        </h1>
      </div>
      <MyArticleTable articles={articles} setArticles={setArticles} />
    </div>
  );
}
