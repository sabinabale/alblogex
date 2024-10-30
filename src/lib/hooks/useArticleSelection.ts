import { useState } from "react";
import { Article } from "@/types/supabase";

export function useArticleSelection(articles: Article[]) {
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);

  const handleSelectArticle = (articleId: number) => {
    setSelectedArticles((prev) =>
      prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId]
    );
  };

  const handleSelectAll = (isChecked: boolean) => {
    setSelectedArticles(isChecked ? articles.map((article) => article.id) : []);
  };

  const isAllSelected =
    articles.length > 0 && selectedArticles.length === articles.length;
  const isSomeSelected = selectedArticles.length > 0 && !isAllSelected;

  return {
    selectedArticles,
    handleSelectArticle,
    handleSelectAll,
    isAllSelected,
    isSomeSelected,
  };
}
