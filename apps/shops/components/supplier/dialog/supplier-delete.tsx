"use client";

import { TSupplier } from "@/types/supplier";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@workspace/ui/components/alert-dialog";
import { deleteSupplier } from "@/actions/supplier";
import { toast } from "sonner";
import { useTransition } from "react";

interface DeleteConfirmProps {
  supplier: TSupplier;
  onSuccess: () => void;
}

export default function SupplierDeleteDialog({
  supplier,
  onSuccess,
}: DeleteConfirmProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const promise = () =>
      new Promise(async (resolve, reject) => {
        startTransition(async () => {
          try {
            const result = await deleteSupplier(supplier.id);

            if (result.success) {
              resolve(result);
              onSuccess();
            } else {
              reject(new Error(result.error || "Failed to delete supplier"));
            }
          } catch (error) {
            reject(
              error instanceof Error
                ? error
                : new Error("Failed to delete supplier")
            );
          }
        });
      });

    toast.promise(promise, {
      loading: "Deleting supplier...",
      success: "Supplier deleted successfully",
      error: (err) => `${err.message}`,
    });
  };

  // Add null check to prevent the error
  if (!supplier) {
    return null;
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the supplier{" "}
          <span className="font-bold">{supplier.name}</span>
          {supplier.email && (
            <>
              {" "}with email address <span className="font-bold">{supplier.email}</span>
            </>
          )}
          .
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