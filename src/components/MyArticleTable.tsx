import React, { useState, useMemo } from "react";
import CustomCheckbox from "@/components/CustomCheckbox";
import AscendingIcon from "@/assets/icons/chevronup.svg";
import DescendingIcon from "@/assets/icons/chevrondown.svg";
import ChevronsIcon from "@/assets/icons/chevrons.svg";
import EditIcon from "@/assets/icons/edit.svg";
import DeleteIcon from "@/assets/icons/delete.svg";
import Image from "next/image";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface Article {
  id: number;
  title: string;
  perex: string;
  author: string;
  comments: number;
}

interface MyArticleTableProps {
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
}

export default function MyArticleTable({
  articles,
  setArticles,
}: MyArticleTableProps) {
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Article;
    direction: "ascending" | "descending";
  } | null>(null);

  const supabase = createClientComponentClient();

  const handleSort = (key: keyof Article) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
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

  const handleSelectArticle = (id: number) => {
    setSelectedArticles((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((articleId) => articleId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedArticles(articles.map((article) => article.id));
    } else {
      setSelectedArticles([]);
    }
  };

  const handleDeleteArticle = async (id: number) => {
    try {
      const { error: imageError } = await supabase
        .from("PostImage")
        .delete()
        .eq("postId", id);

      if (imageError) throw imageError;

      const { error: postError } = await supabase
        .from("Post")
        .delete()
        .eq("id", id);

      if (postError) throw postError;

      setArticles((prevArticles) =>
        prevArticles.filter((article) => article.id !== id)
      );
    } catch (err) {
      console.error("Error deleting article:", err);
      alert("Failed to delete article. Please try again.");
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const { error } = await supabase
        .from("Post")
        .delete()
        .in("id", selectedArticles);

      if (error) throw error;

      setArticles((prevArticles) =>
        prevArticles.filter((article) => !selectedArticles.includes(article.id))
      );
      setSelectedArticles([]);
    } catch (err) {
      console.error("Error deleting selected articles:", err);
      alert("Failed to delete selected articles. Please try again.");
    }
  };

  return (
    <div className="border border-gray-300 rounded-md bg-white">
      <div className="grid grid-cols-[auto,290px,290px,200px,1fr,1fr] gap-4 items-center border-b border-gray-300 px-4 py-4">
        <div className="font-bold flex items-center ">
          <CustomCheckbox
            onChange={handleSelectAll}
            checked={selectedArticles.length === articles.length}
          />
        </div>
        {(["title", "perex", "author", "comments"] as const).map((key) => (
          <button
            key={key}
            className="font-bold text-left flex items-center group text-black/70 hover:text-black "
            onClick={() => handleSort(key)}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
            <span className="ml-1 flex items-center ">
              {sortConfig?.key === key ? (
                sortConfig.direction === "ascending" ? (
                  <Image
                    src={AscendingIcon}
                    alt="ascending icon"
                    className="group-hover:scale-110 transition-all duration-300 ease-out"
                  />
                ) : (
                  <Image
                    src={DescendingIcon}
                    alt="descending icon"
                    className="group-hover:scale-110 transition-all duration-300 ease-out"
                  />
                )
              ) : (
                <Image
                  src={ChevronsIcon}
                  alt="chevrons icon"
                  className="group-hover:scale-110 transition-all duration-300 ease-out"
                />
              )}
            </span>
          </button>
        ))}
        <div className="font-bold text-black/70">Actions</div>
      </div>

      <div className="grid grid-cols-[auto,290px,290px,200px,1fr,1fr] gap-4 items-center px-4 py-2 ">
        {sortedArticles.map((article) => (
          <React.Fragment key={article.id}>
            <div className="flex items-center ">
              <CustomCheckbox
                onChange={() => handleSelectArticle(article.id)}
                checked={selectedArticles.includes(article.id)}
              />
            </div>
            <div className="py-2 truncate">{article.title}</div>
            <div className="py-2 truncate">{article.perex}</div>
            <div className="py-2 truncate">{article.author}</div>
            <div className="text-center">{article.comments}</div>
            <div className="flex space-x-4">
              <Link
                href={`/edit-article/${article.id}`}
                className="w-fit hover:opacity-40"
              >
                <Image src={EditIcon} alt="edit icon" />
              </Link>
              <button
                className="w-fit hover:opacity-40"
                onClick={() => handleDeleteArticle(article.id)}
              >
                <Image src={DeleteIcon} alt="delete icon" />
              </button>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="py-2 px-4 flex gap-4 border-t text-sm border-gray-300 items-center">
        <div className="w-[120px]">
          {selectedArticles.length} item
          {selectedArticles.length !== 1 ? "s" : ""} selected
        </div>
        <button
          className="w-fit disabled:bg-gray-300 transition-all duration-300 ease-out bg-red-700 text-white px-2 py-1 rounded-md hover:bg-red-800"
          onClick={handleDeleteSelected}
          disabled={selectedArticles.length === 0}
        >
          Bulk delete
        </button>
      </div>
    </div>
  );
}
