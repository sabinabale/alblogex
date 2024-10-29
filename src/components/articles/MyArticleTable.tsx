import { Article } from "@/types/supabase";
import { useTableSort } from "@/lib/hooks/useTableSort";
import { useArticleSelection } from "@/lib/hooks/useArticleSelection";
import { useArticleActions } from "@/lib/hooks/useArticleActions";
import { TableHeader } from "./dashboard/TableHeader";
import { TableRow } from "./dashboard/TableRow";
import { TableFooter } from "./dashboard/TableFooter";

type MyArticleTableProps = {
  initialArticles: Article[];
  onArticlesChange: (articles: Article[]) => void;
};

export default function MyArticleTable({
  initialArticles,
  onArticlesChange,
}: MyArticleTableProps) {
  const { sortConfig, handleSort, sortedArticles } =
    useTableSort(initialArticles);
  const {
    selectedArticles,
    handleSelectArticle,
    handleSelectAll,
    isAllSelected,
    isSomeSelected,
  } = useArticleSelection(initialArticles);

  const { handleDeleteArticle, handleDeleteSelected } = useArticleActions(
    initialArticles,
    onArticlesChange
  );

  return (
    <div className="border border-gray-300 rounded-xl text-sm bg-white shadow-sm w-full overflow-x-scroll">
      <table className="w-full md:table-fixed">
        <TableHeader
          isAllSelected={isAllSelected}
          isSomeSelected={isSomeSelected}
          onSelectAll={handleSelectAll}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
        <tbody>
          {sortedArticles.map((article) => (
            <TableRow
              key={article.id}
              article={article}
              isSelected={selectedArticles.includes(article.id)}
              onSelect={handleSelectArticle}
              onDelete={handleDeleteArticle}
            />
          ))}
        </tbody>
        <TableFooter
          selectedCount={selectedArticles.length}
          onBulkDelete={() => handleDeleteSelected(selectedArticles)}
        />
      </table>
    </div>
  );
}
