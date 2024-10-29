import Image from "next/image";
import { Article } from "@/types/supabase";
import AscendingIcon from "@/assets/icons/chevronup.svg";
import DescendingIcon from "@/assets/icons/chevrondown.svg";

type SortableColumnProps = {
  label: string;
  sortKey: keyof Article;
  sortConfig: {
    key: keyof Article;
    direction: "ascending" | "descending";
  } | null;
  onSort: (key: keyof Article) => void;
};

export function SortableColumn({
  label,
  sortKey,
  sortConfig,
  onSort,
}: SortableColumnProps) {
  return (
    <button
      className="text-left flex items-center group text-black/70 hover:text-black w-full text-gray-500"
      onClick={() => onSort(sortKey)}
    >
      {label}
      <span className="flex items-center">
        {sortConfig?.key === sortKey && (
          <Image
            src={
              sortConfig.direction === "ascending"
                ? AscendingIcon
                : DescendingIcon
            }
            alt={`${sortConfig.direction} icon`}
            className="group-hover:scale-110 transition-all duration-300 ease-out"
          />
        )}
      </span>
    </button>
  );
}
