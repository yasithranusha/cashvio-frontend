"use client";

import { TCategory } from "@workspace/ui/types/categories";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@workspace/ui/components/alert-dialog";
import { deleteCategory, CategoryType } from "@/actions/category";
import { toast } from "sonner";
import { useTransition } from "react";

interface DeleteConfirmProps {
  category: TCategory;
  onSuccess: () => void;
  categoryType?: CategoryType;
}

export default function CategoryDeleteDialog({
  category,
  onSuccess,
  categoryType = "main",
}: DeleteConfirmProps) {
  const [isPending, startTransition] = useTransition();

  const getEntityName = () => {
    switch(categoryType) {
      case "sub": return "subcategory";
      case "subsub": return "sub-subcategory";
      default: return "category";
    }
  };

  const entityName = getEntityName();

  const handleDelete = async () => {
    const promise = () =>
      new Promise(async (resolve, reject) => {
        startTransition(async () => {
          try {
            const result = await deleteCategory(category.id, categoryType);

            if (result.success) {
              resolve(result);
              onSuccess();
            } else {
              reject(new Error(result.error || `Failed to delete ${entityName}`));
            }
          } catch (error) {
            reject(
              error instanceof Error
                ? error
                : new Error(`Failed to delete ${entityName}`)
            );
          }
        });
      });

    toast.promise(promise, {
      loading: `Deleting ${entityName}...`,
      success: `${entityName.charAt(0).toUpperCase() + entityName.slice(1)} deleted successfully`,
      error: (err) => `${err.message}`,
    });
  };

  // Add null check to prevent errors
  if (!category) {
    return null;
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the {entityName}{" "}
          <span className="font-bold">{category.name}</span>
          {category.description && (
            <>
              {" "}with description{" "}
              <span className="font-medium italic">"{category.description}"</span>
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