import { TPaginatedResponse, ProductStatus } from "@workspace/ui/types/common";

export type TProductStatus = "ACTIVE" | "INACTIVE";

export type TSupplierInfo = {
  id: string;
  name: string;
  contactNumber: string;
  haveWhatsApp: boolean;
  email: string;
  shopId: string;
  createdAt: string;
  updatedAt: string;
};

export type TCategoryInfo = {
  id: string;
  name: string;
};

export type TSubCategoryInfo = {
  id: string;
  name: string;
  categoryId: string;
};

export type TSubSubCategoryInfo = {
  id: string;
  name: string;
  subCategoryId: string;
};

export type TProduct = {
  id: string;
  name: string;
  description: string;
  displayName: string;
  keepingUnits: number;
  imageUrls: string[];
  status: TProductStatus;
  shopId: string;
  supplierId: string;
  warrantyMonths: number;
  loyaltyPoints: number;
  categoryId: string;
  subCategoryId: string;
  subSubCategoryId: string;
  createdAt: string;
  updatedAt: string;
  supplier?: TSupplierInfo;
  category?: TCategoryInfo;
  subCategory?: TSubCategoryInfo;
  subSubCategory?: TSubSubCategoryInfo;
  _count?: {
    items: number;
  };
  stock: number;
};

// Using the generic paginated response from common.ts
export type TProductResponse = TPaginatedResponse<TProduct>;

export type TProductCreate = {
  name: string;
  description: string;
  displayName: string;
  keepingUnits: number;
  imageUrls: string[];
  status: TProductStatus;
  shopId: string;
  supplierId: string;
  categoryId: string;
  subCategoryId: string;
  subSubCategoryId: string;
};

export type TProductUpdate = Partial<Omit<TProductCreate, "shopId">>;