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
import { TProduct } from "@workspace/ui/types/product";
import { AlertDialog } from "@workspace/ui/components/alert-dialog";
import ProductDeleteDialog from "../dialog/product-delete";
import ProductForm from "../dialog/product-form";

export default function ProductActions({ product }: { product: TProduct }) {
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
            onClick={() => navigator.clipboard.writeText(product.id)}
          >
            Copy product ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setIsUpdateOpen(true);
              setIsDropdownOpen(false);
            }}
          >
            Edit product
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setIsDeleteOpen(true);
              setIsDropdownOpen(false);
            }}
            className="text-destructive hover:text-destructive"
          >
            Delete product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit dialog */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Product {product.name}</DialogTitle>
            <DialogDescription>
              Update {product.name}'s details
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            initialData={product}
            onSuccess={() => setIsUpdateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <ProductDeleteDialog
          product={product}
          onSuccess={() => setIsDeleteOpen(false)}
        />
      </AlertDialog>
    </>
  );
}
