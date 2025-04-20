"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { useState, Dispatch, SetStateAction } from "react";
import CategoryForm from "@/components/categories/dialog/category-form";
import { TCategory, TSubCategory } from "@workspace/ui/types/categories";
import { CategoryType } from "@/components/categories/datatable/categories-columns";

interface CategoryDialogProps {
  category?: TCategory;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  shopId?: string;
  type?: CategoryType;
  mainCategories?: TCategory[];
  subCategories?: TCategory[];
  disableTrigger?: boolean;
  title?: string;
}

export function CategoryDialog({
  category,
  setOpen,
  shopId,
  type = "main",
  mainCategories,
  subCategories,
  disableTrigger = false,
  title,
}: CategoryDialogProps) {
  const [localOpen, setLocalOpen] = useState(false);

  const open = setOpen ? undefined : localOpen;
  const handleOpenChange = setOpen || setLocalOpen;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!setOpen && (
        <DialogTrigger asChild>
          <Button disabled={disableTrigger} title={title}>
            {category ? "Edit Category" : "Add Category"}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {category ? `Update Category ${category.name}` : "Add Category"}
          </DialogTitle>
          <DialogDescription>
            {category
              ? `Update ${category.name}'s details`
              : "Fill in the details to add a new category"}
          </DialogDescription>
        </DialogHeader>
        {category ? (
          <CategoryForm
            initialData={category}
            onSuccess={() => handleOpenChange(false)}
            shopId={shopId}
            type={type}
            mainCategories={mainCategories}
            subCategories={subCategories}
          />
        ) : (
          <CategoryForm
            onSuccess={() => handleOpenChange(false)}
            shopId={shopId}
            type={type}
            mainCategories={mainCategories}
            subCategories={subCategories}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
