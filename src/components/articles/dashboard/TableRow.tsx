import Image from "next/image";
import Link from "next/link";
import { Article } from "@/lib/types/supabase";
import { Button } from "@/components/layout/Buttons";
import CustomCheckbox from "@/components/layout/CustomCheckbox";
import EditIcon from "@/assets/icons/edit.svg";
import DeleteIcon from "@/assets/icons/delete.svg";

type TableRowProps = {
  article: Article;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onDelete: (id: number, event: React.MouseEvent) => void;
};

export function TableRow({
  article,
  isSelected,
  onSelect,
  onDelete,
}: TableRowProps) {
  return (
    <tr
      className="border-t border-gray-300 hover:bg-gray-50 cursor-pointer"
      onClick={() => onSelect(article.id)}
    >
      <td className="py-2 px-3" onClick={(e) => e.stopPropagation()}>
        <CustomCheckbox
          onChange={() => onSelect(article.id)}
          checked={isSelected}
        />
      </td>
      <td className="py-2 px-4 truncate" onClick={(e) => e.stopPropagation()}>
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
            onClick={(event) => onDelete(article.id, event)}
          >
            <Image src={DeleteIcon} alt="delete icon" />
          </button>
        </div>
      </td>
    </tr>
  );
}
