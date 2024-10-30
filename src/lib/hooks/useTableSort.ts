import { useState, useMemo } from "react";
import { Article } from "@/lib/types/supabase";

type SortConfig = {
  key: keyof Article;
  direction: "ascending" | "descending";
};

export function useTableSort(articles: Article[]) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const handleSort = (key: keyof Article) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig?.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedArticles = useMemo(() => {
    const sortableArticles = [...articles];
    if (sortConfig !== null) {
      sortableArticles.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableArticles;
  }, [articles, sortConfig]);

  return { sortConfig, handleSort, sortedArticles };
}
