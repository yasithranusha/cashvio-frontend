"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import { MoreHorizontal } from "lucide-react";
import { TCategory } from "@workspace/ui/types/categories";
import CategoryForm from "@/components/categories/dialog/category-form";
import CategoryDeleteDialog from "@/components/categories/dialog/category-delete";
import { AlertDialog } from "@workspace/ui/components/alert-dialog";

export default function CategoriesActions({
  category,
}: {
  category: TCategory;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(category.id)}
          >
            Copy category ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setIsUpdateOpen(true);
              setIsDropdownOpen(false);
            }}
          >
            Edit category
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setIsDeleteOpen(true);
              setIsDropdownOpen(false);
            }}
            className="text-destructive hover:text-destructive"
          >
            Delete category
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit dialog */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Category {category.name}</DialogTitle>
            <DialogDescription>
              Update {category.name}'s details
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            initialData={category}
            onSuccess={() => setIsUpdateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <CategoryDeleteDialog
          category={category}
          onSuccess={() => setIsDeleteOpen(false)}
        />
      </AlertDialog>
    </>
  );
}
