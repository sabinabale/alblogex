import React, { useState, useMemo } from "react";
import CustomCheckbox from "@/components/basic/CustomCheckbox";
import AscendingIcon from "@/assets/icons/chevronup.svg";
import DescendingIcon from "@/assets/icons/chevrondown.svg";
import EditIcon from "@/assets/icons/edit.svg";
import DeleteIcon from "@/assets/icons/delete.svg";
import Image from "next/image";
import Link from "next/link";
import { Article, MyArticleTableProps } from "@/types/types";
import { Button } from "@/components/basic/Buttons";
import { toast } from "react-hot-toast";

export default function MyArticleTable({
  articles,
  setArticles,
}: MyArticleTableProps) {
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Article;
    direction: "ascending" | "descending";
  } | null>(null);

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

  const isAllSelected = selectedArticles.length === articles.length;
  const isSomeSelected = selectedArticles.length > 0 && !isAllSelected;

  const handleDeleteArticle = async (id: number, event: React.MouseEvent) => {
    event.stopPropagation();

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this article?"
    );
    if (!confirmDelete) return;

    try {
      const deletePromise = fetch(`/api/articles?postId=${id}`, {
        method: "DELETE",
      }).then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            console.error("Server response:", errorData);
            throw new Error(
              errorData.error ||
                `Failed to delete article. Status: ${response.status}`
            );
          });
        }
        return response.json();
      });

      toast.promise(deletePromise, {
        loading: "Deleting article...",
        success: (data) => {
          console.log("Delete response:", data);
          setArticles((prevArticles) =>
            prevArticles.filter((article) => article.id !== id)
          );
          return "Article deleted successfully";
        },
        error: (err) => {
          console.error("Error deleting article:", err);
          return `Failed to delete article. Error: ${err.message}`;
        },
      });
    } catch (error: unknown) {
      console.error("Error deleting article:", error);
      if (error instanceof Error) {
        toast.error(`Failed to delete article. Error: ${error.message}`);
      } else {
        toast.error("An unknown error occurred while deleting the article.");
      }
    }
  };

  const handleDeleteSelected = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the selected articles?"
    );
    if (!confirmDelete) return;

    try {
      const postIds = selectedArticles.join(",");

      const deletePromise = fetch(`/api/articles?postIds=${postIds}`, {
        method: "DELETE",
      }).then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(
              errorData.error || "Failed to delete selected articles"
            );
          });
        }
        return response.json();
      });

      await toast.promise(deletePromise, {
        loading: "Deleting selected articles...",
        success: () => {
          setArticles((prevArticles) =>
            prevArticles.filter(
              (article) => !selectedArticles.includes(article.id)
            )
          );
          setSelectedArticles([]);
          return `Successfully deleted ${selectedArticles.length} article(s)`;
        },
        error: (err) => {
          console.error("Error deleting selected articles:", err);
          return `Failed to delete selected articles. Error: ${err.message}`;
        },
      });
    } catch (error) {
      console.error("Error deleting selected articles:", error);
      if (error instanceof Error) {
        toast.error(
          `Failed to delete selected articles. Error: ${error.message}`
        );
      } else {
        toast.error(
          "An unknown error occurred while deleting selected articles."
        );
      }
    }
  };

  return (
    <div className="border border-gray-300 rounded-xl text-sm bg-white shadow-sm w-full overflow-x-scroll">
      <table className="w-full md:table-fixed ">
        <thead className="text-gray-500">
          <tr className="bg-gray-50">
            <th className="w-[4%] py-2 px-3">
              <CustomCheckbox
                onChange={handleSelectAll}
                checked={isAllSelected}
                indeterminate={isSomeSelected}
              />
            </th>
            <th className="w-1/3 py-2 px-4">
              <button
                className="text-left flex items-center group text-black/70 hover:text-black w-full text-gray-500"
                onClick={() => handleSort("title")}
              >
                Title
                <span className="flex items-center">
                  {sortConfig?.key === "title" &&
                    (sortConfig.direction === "ascending" ? (
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
                    ))}
                </span>
              </button>
            </th>
            <th className="w-2/3 py-2 px-4">
              <button
                className="text-left flex items-center group text-black/70 hover:text-black w-full text-gray-500"
                onClick={() => handleSort("perex")}
              >
                Perex
                <span className="flex items-center">
                  {sortConfig?.key === "perex" &&
                    (sortConfig.direction === "ascending" ? (
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
                    ))}
                </span>
              </button>
            </th>
            <th className="w-1/4 py-2 px-4">
              <button
                className=" text-left flex items-center group text-black/70 hover:text-black w-full text-gray-500"
                onClick={() => handleSort("author")}
              >
                Author
                <span className="flex items-center">
                  {sortConfig?.key === "author" &&
                    (sortConfig.direction === "ascending" ? (
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
                    ))}
                </span>
              </button>
            </th>
            <th className="w-1/5 py-2 px-4">
              <button
                className="text-left flex items-center group text-black/70 hover:text-black w-full text-gray-500"
                onClick={() => handleSort("comments")}
              >
                Comments
                <span className="flex items-center">
                  {sortConfig?.key === "comments" &&
                    (sortConfig.direction === "ascending" ? (
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
                    ))}
                </span>
              </button>
            </th>
            <th className="w-2/12 py-2 px-4 font-[500] text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedArticles.map((article) => (
            <tr
              key={article.id}
              className="border-t border-gray-300 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleSelectArticle(article.id)}
            >
              <td className="py-2 px-3" onClick={(e) => e.stopPropagation()}>
                <CustomCheckbox
                  onChange={() => handleSelectArticle(article.id)}
                  checked={selectedArticles.includes(article.id)}
                />
              </td>
              <td
                className="py-2 px-4 truncate"
                onClick={(e) => e.stopPropagation()}
              >
                <Button variant="link" size="none" asChild>
                  <Link href={`/articles/${article.id}`}>{article.title}</Link>
                </Button>
              </td>
              <td className="py-2 px-4 truncate w-[290px]">{article.perex}</td>
              <td className="py-2 px-4 truncate">{article.author}</td>
              <td className="py-2 px-4">{article.comments}</td>
              <td className="py-2 px-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex space-x-4">
                  <Link
                    href={`/app/edit-article/${article.id}`}
                    className="w-fit hover:opacity-40"
                  >
                    <Image src={EditIcon} alt="edit icon" />
                  </Link>
                  <button
                    className="w-fit hover:opacity-40"
                    onClick={(event) => handleDeleteArticle(article.id, event)}
                  >
                    <Image src={DeleteIcon} alt="delete icon" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="border-t border-gray-300">
          <tr className="bg-gray-50">
            <td colSpan={6} className="py-2 px-4">
              <div className="flex gap-4 items-center">
                <div className="text-gray-500">
                  <span className="font-medium">{selectedArticles.length}</span>{" "}
                  item
                  {selectedArticles.length !== 1 ? "s" : ""} selected
                </div>
                {selectedArticles.length > 1 && (
                  <Button
                    variant="destructive"
                    size="none"
                    onClick={handleDeleteSelected}
                  >
                    Bulk delete
                  </Button>
                )}
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
