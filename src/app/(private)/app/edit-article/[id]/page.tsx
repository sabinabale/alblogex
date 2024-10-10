"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ArticleForm from "@/components/ArticleForm";

export default function EditArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [articleData, setArticleData] = useState<{
    title: string;
    content: string;
    imageUrl: string | null;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsSubmitting(true);
        const { data, error } = await supabase
          .from("Post")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) throw error;

        setArticleData({
          title: data.title,
          content: data.content,
          imageUrl: data.imageUrl,
        });
      } catch (err) {
        console.error("Error fetching article:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch article"
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    fetchArticle();
  }, [params.id, supabase]);

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      formData.append("postId", params.id);

      const response = await fetch("/api/articles", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save article");
      }

      const result = await response.json();

      if (result.success) {
        router.push(`/articles/${result.id}`);
      } else {
        throw new Error(result.error || "Unknown error occurred");
      }
    } catch (err) {
      console.error("Error updating article:", err);
      setError(err instanceof Error ? err.message : "Failed to update article");

      router.push(
        `/app/dashboard?message=${encodeURIComponent(
          err instanceof Error ? err.message : "Failed to update article"
        )}&type=error`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!articleData) return <div>Loading...</div>;

  return (
    <ArticleForm
      initialTitle={articleData.title}
      initialContent={articleData.content}
      initialImageUrl={articleData.imageUrl}
      onSubmit={handleSubmit}
      submitButtonText="Update Article"
      isSubmitting={isSubmitting}
    />
  );
}
