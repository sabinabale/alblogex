"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ArticleForm from "@/components/articles/ArticleForm";

export default function CreateArticlePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Server error:", result);
        throw new Error(result.error || "Failed to create article");
      }

      localStorage.removeItem("articleTitle");
      localStorage.removeItem("markdownContent");

      if (result.id) {
        router.push(`/articles/${result.id}`);
      } else {
        console.error("Article ID not returned from API");
        router.push(
          "/app/dashboard?message=Article created but ID not returned. Please check your dashboard.&type=warning"
        );
      }
    } catch (error) {
      console.error("Error creating article:", error);
      router.push(
        `/app/dashboard?message=Failed to create article. Please try again.&type=error`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ArticleForm
      initialTitle=""
      initialContent=""
      onSubmit={handleSubmit}
      submitButtonText="Publish Article"
      isSubmitting={isSubmitting}
    />
  );
}
