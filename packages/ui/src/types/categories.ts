import { ProductStatus, TPaginatedResponse } from "@workspace/ui/types/common";

interface BaseCategoryFields {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  status: ProductStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Main category type
export type TCategory = BaseCategoryFields & {
  shopId: string;
  _count?: {
    subCategories: number;
    products: number;
  };
};

// Subcategory type
export type TSubCategory = BaseCategoryFields & {
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  _count?: {
    products: number;
    subSubCategories: number;
  };
};

// Sub-subcategory type
export type TSubSubCategory = BaseCategoryFields & {
  subCategoryId: string;
  subCategory?: {
    id: string;
    name: string;
    category?: {
      id: string;
      name: string;
    };
  };
  _count?: {
    products: number;
  };
};

// Union type for all category types
export type TCategoryUnion = TCategory | TSubCategory | TSubSubCategory;

export type TCategoryResponse = TPaginatedResponse<TCategory>;
export type TSubCategoryResponse = TPaginatedResponse<TSubCategory>;
export type TSubSubCategoryResponse = TPaginatedResponse<TSubSubCategory>;