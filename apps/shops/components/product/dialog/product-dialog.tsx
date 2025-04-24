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
import ProductForm from "@/components/product/dialog/product-form";
import { TProduct } from "@workspace/ui/types/product";

interface ProductDialogProps {
  product?: TProduct;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  shopId?: string;
}

export function ProductDialog({ product, setOpen, shopId }: ProductDialogProps) {
  const [localOpen, setLocalOpen] = useState(false);

  const open = setOpen ? undefined : localOpen;
  const handleOpenChange = setOpen || setLocalOpen;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!setOpen && (
        <DialogTrigger asChild>
          <Button>{product ? "Edit Product" : "Add Product"}</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? `Update Product ${product.name}` : "Add Product"}
          </DialogTitle>
          <DialogDescription>
            {product
              ? `Update ${product.name}'s details`
              : "Fill in the details to add a new product"}
          </DialogDescription>
        </DialogHeader>
        {product ? (
          <ProductForm
            initialData={product}
            onSuccess={() => handleOpenChange(false)}
            shopId={shopId}
          />
        ) : (
          <ProductForm 
            onSuccess={() => handleOpenChange(false)} 
            shopId={shopId}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}