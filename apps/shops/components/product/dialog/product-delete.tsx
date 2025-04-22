"use client";

import { TProduct } from "@workspace/ui/types/product";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@workspace/ui/components/alert-dialog";
import { deleteProduct } from "@/actions/products";
import { toast } from "sonner";
import { useTransition } from "react";

interface DeleteConfirmProps {
  product: TProduct;
  onSuccess: () => void;
}

export default function ProductDeleteDialog({
  product,
  onSuccess,
}: DeleteConfirmProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const promise = () =>
      new Promise(async (resolve, reject) => {
        startTransition(async () => {
          try {
            const result = await deleteProduct(product.id);

            if (result.success) {
              resolve(result);
              onSuccess();
            } else {
              reject(new Error(result.error || "Failed to delete product"));
            }
          } catch (error) {
            reject(
              error instanceof Error
                ? error
                : new Error("Failed to delete product")
            );
          }
        });
      });

    toast.promise(promise, {
      loading: "Deleting product...",
      success: "Product deleted successfully",
      error: (err) => `${err.message}`,
    });
  };

  // Add null check to prevent errors
  if (!product) {
    return null;
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the product{" "}
          <span className="font-bold">{product.displayName || product.name}</span>.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onSuccess}>Cancel</AlertDialogCancel>
        <AlertDialogAction 
          onClick={handleDelete}
          disabled={isPending}
          className="bg-destructive hover:bg-destructive/90"
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}