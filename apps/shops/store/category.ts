import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  TCategory,
  TSubCategory,
  TSubSubCategory,
} from "@workspace/ui/types/categories";
import { getCategories } from "@/actions/category";

interface CategoryState {
  mainCategories: TCategory[];
  subCategories: TSubCategory[];
  subSubCategories: TSubSubCategory[];
  isLoading: boolean;
  error: string | null;

  fetchCategories: (shopId: string) => Promise<void>;
  setMainCategories: (categories: TCategory[]) => void;
  setSubCategories: (categories: TSubCategory[]) => void;
  setSubSubCategories: (categories: TSubSubCategory[]) => void;
  reset: () => void;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      mainCategories: [],
      subCategories: [],
      subSubCategories: [],
      isLoading: false,
      error: null,

      fetchCategories: async (shopId: string) => {
        set({ isLoading: true, error: null });
        try {
          const [mainResult, subResult, subSubResult] = await Promise.all([
            getCategories(shopId, "main"),
            getCategories(shopId, "sub"),
            getCategories(shopId, "subsub"),
          ]);

          if (mainResult.success && mainResult.data) {
            set({
              mainCategories: (mainResult.data.data || []) as TCategory[],
            });
          } else if (mainResult.error) {
            set({
              error: `Failed to fetch main categories: ${mainResult.error}`,
            });
          }

          if (subResult.success && subResult.data) {
            set({
              subCategories: (subResult.data.data || []) as TSubCategory[],
            });
          } else if (subResult.error) {
            set({ error: `Failed to fetch subcategories: ${subResult.error}` });
          }

          if (subSubResult.success && subSubResult.data) {
            set({
              subSubCategories: (subSubResult.data.data ||
                []) as TSubSubCategory[],
            });
          } else if (subSubResult.error) {
            set({
              error: `Failed to fetch sub-subcategories: ${subSubResult.error}`,
            });
          }
        } catch (error) {
          set({
            error: `Failed to fetch categories: ${error instanceof Error ? error.message : String(error)}`,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      setMainCategories: (categories: TCategory[]) => {
        set({ mainCategories: categories });
      },

      setSubCategories: (categories: TSubCategory[]) => {
        set({ subCategories: categories });
      },

      setSubSubCategories: (categories: TSubSubCategory[]) => {
        set({ subSubCategories: categories });
      },

      reset: () => {
        set({
          mainCategories: [],
          subCategories: [],
          subSubCategories: [],
          isLoading: false,
          error: null,
        });
      },
    }),
    {
      name: "category-storage",
      partialize: (state) => ({
        mainCategories: state.mainCategories,
        subCategories: state.subCategories,
        subSubCategories: state.subSubCategories,
      }),
    }
  )
);
