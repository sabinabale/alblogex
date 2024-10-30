import { Article } from "@/types/supabase";
import { SortableColumn } from "./SortableColumn";
import CustomCheckbox from "@/components/layout/CustomCheckbox";

type TableHeaderProps = {
  isAllSelected: boolean;
  isSomeSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  sortConfig: {
    key: keyof Article;
    direction: "ascending" | "descending";
  } | null;
  onSort: (key: keyof Article) => void;
};

export function TableHeader({
  isAllSelected,
  isSomeSelected,
  onSelectAll,
  sortConfig,
  onSort,
}: TableHeaderProps) {
  return (
    <thead className="text-gray-500">
      <tr className="bg-gray-50">
        <th className="w-[4%] py-2 px-3">
          <CustomCheckbox
            onChange={onSelectAll}
            checked={isAllSelected}
            indeterminate={isSomeSelected}
          />
        </th>
        <th className="w-1/3 py-2 px-4">
          <SortableColumn
            label="Title"
            sortKey="title"
            sortConfig={sortConfig}
            onSort={onSort}
          />
        </th>
        <th className="w-2/3 py-2 px-4">
          <SortableColumn
            label="Perex"
            sortKey="perex"
            sortConfig={sortConfig}
            onSort={onSort}
          />
        </th>
        <th className="w-1/4 py-2 px-4">
          <SortableColumn
            label="Author"
            sortKey="author"
            sortConfig={sortConfig}
            onSort={onSort}
          />
        </th>
        <th className="w-1/5 py-2 px-4">
          <SortableColumn
            label="Comments"
            sortKey="comments"
            sortConfig={sortConfig}
            onSort={onSort}
          />
        </th>
        <th className="w-2/12 py-2 px-4 font-[500] text-left">Actions</th>
      </tr>
    </thead>
  );
}
