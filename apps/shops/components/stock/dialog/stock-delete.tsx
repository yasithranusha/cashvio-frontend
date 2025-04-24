"use client";

import { TStockItem } from "@workspace/ui/types/stock";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@workspace/ui/components/alert-dialog";
import { deleteStockItem } from "@/actions/stock";
import { toast } from "sonner";
import { useTransition } from "react";
import { formatPrice } from "@workspace/ui/lib/utils";

interface DeleteConfirmProps {
  stockItem: TStockItem;
  onSuccess: () => void;
}

export default function StockDeleteDialog({
  stockItem,
  onSuccess,
}: DeleteConfirmProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const promise = () =>
      new Promise(async (resolve, reject) => {
        startTransition(async () => {
          try {
            const result = await deleteStockItem(stockItem.id);

            if (result.success) {
              resolve(result);
              onSuccess();
            } else {
              reject(new Error(result.error || "Failed to delete stock item"));
            }
          } catch (error) {
            reject(
              error instanceof Error
                ? error
                : new Error("Failed to delete stock item")
            );
          }
        });
      });

    toast.promise(promise, {
      loading: "Deleting stock item...",
      success: "Stock item deleted successfully",
      error: (err) => `${err.message}`,
    });
  };

  // Add null check to prevent the error
  if (!stockItem) {
    return null;
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the stock item with
          barcode <span className="font-bold">{stockItem.barcode}</span>
          {" "}priced at <span className="font-bold">{formatPrice(stockItem.sellPrice)}</span>.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onSuccess}>Cancel</AlertDialogCancel>
        <AlertDialogAction 
          onClick={handleDelete}
          disabled={isPending}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}