import React, { useState, useMemo } from "react";

interface Article {
  id: number;
  title: string;
  perex: string;
  author: string;
  comments: number;
}

const initialArticles: Article[] = [
  {
    id: 1,
    title: "Article 1",
    perex: "Perex 1",
    author: "Author 1",
    comments: 5,
  },
  {
    id: 2,
    title: "Article 2",
    perex: "Perex 2",
    author: "Author 2",
    comments: 3,
  },
  {
    id: 3,
    title: "Article 3",
    perex: "Perex 3",
    author: "Author 3",
    comments: 1,
  },
  {
    id: 4,
    title: "Article 4",
    perex: "Perex 4",
    author: "Author 4",
    comments: 2,
  },
  {
    id: 5,
    title: "Article 5",
    perex: "Perex 5",
    author: "Author 5",
    comments: 4,
  },
];

export default function MyArticleTable() {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
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

  const handleSelectAll = () => {
    if (selectedArticles.length === articles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(articles.map((article) => article.id));
    }
  };

  const handleDeleteSelected = () => {
    setArticles((prevArticles) =>
      prevArticles.filter((article) => !selectedArticles.includes(article.id))
    );
    setSelectedArticles([]);
  };

  return (
    <div className="border border-gray-300 rounded-md">
      <div className="grid grid-cols-[auto,290px,290px,200px,1fr,1fr] gap-4 items-center border-b border-gray-300 px-4 py-4">
        <div className="font-bold flex items-center">
          <input
            type="checkbox"
            checked={selectedArticles.length === articles.length}
            onChange={handleSelectAll}
          />
        </div>
        {(["title", "perex", "author", "comments"] as const).map((key) => (
          <div
            key={key}
            className="font-bold cursor-pointer"
            onClick={() => handleSort(key)}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </div>
        ))}
        <div className="font-bold">Actions</div>
      </div>

      <div className="grid grid-cols-[auto,290px,290px,200px,1fr,1fr] gap-4 items-center px-4 py-2">
        {sortedArticles.map((article) => (
          <React.Fragment key={article.id}>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedArticles.includes(article.id)}
                onChange={() => handleSelectArticle(article.id)}
              />
            </div>
            <div className="py-2 ">{article.title}</div>
            <div className="py-2">{article.perex}</div>
            <div className="py-2">{article.author}</div>
            <div>{article.comments}</div>
            <div className="flex space-x-2">
              <button>Edit</button>
              <button>Delete</button>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="py-2 px-4 flex gap-4 border-t border-gray-300 items-center">
        <div>
          {selectedArticles.length} item
          {selectedArticles.length !== 1 ? "s" : ""} selected
        </div>
        <button
          className="w-fit disabled:bg-gray-300 bg-red-700 text-white px-2 py-1 rounded-md"
          onClick={handleDeleteSelected}
          disabled={selectedArticles.length === 0}
        >
          Bulk delete
        </button>
      </div>
    </div>
  );
}
