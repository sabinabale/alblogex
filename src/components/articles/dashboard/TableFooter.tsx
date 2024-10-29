import { Button } from "@/components/layout/Buttons";

type TableFooterProps = {
  selectedCount: number;
  onBulkDelete: () => void;
};

export function TableFooter({ selectedCount, onBulkDelete }: TableFooterProps) {
  return (
    <tfoot className="border-t border-gray-300">
      <tr className="bg-gray-50">
        <td colSpan={6} className="py-2 px-4">
          <div className="flex gap-4 items-center">
            <div className="text-gray-500">
              <span className="font-medium">{selectedCount}</span> item
              {selectedCount !== 1 ? "s" : ""} selected
            </div>
            {selectedCount > 1 && (
              <Button variant="destructive" size="none" onClick={onBulkDelete}>
                Bulk delete
              </Button>
            )}
          </div>
        </td>
      </tr>
    </tfoot>
  );
}
