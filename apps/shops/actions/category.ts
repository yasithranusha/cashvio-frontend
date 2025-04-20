"use server";

import { axiosClient } from "@/lib/customAxios";
import { BACKEND_URL } from "@/lib/constants";
import axios from "axios";
import { TCategoryResponse } from "@workspace/ui/types/categories";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  CategorySchema,
  SubCategorySchema,
  SubSubCategorySchema,
  UpdateCategorySchema,
  UpdateSubCategorySchema,
  UpdateSubSubCategorySchema,
} from "@workspace/ui/schemas/category";
import { ActionResponse } from "@workspace/ui/types/common";

export type CategoryType = "main" | "sub" | "subsub";


function getCategoryEndpoint(type: CategoryType = "main") {
  switch (type) {
    case "sub":
      return `${BACKEND_URL}stock/categories/subcategories`;
    case "subsub":
      return `${BACKEND_URL}stock/categories/subcategories/subsubcategories`;
    case "main":
    default:
      return `${BACKEND_URL}stock/categories`;
  }
}

export async function getCategories(
  storeId: string,
  type: CategoryType = "main",
) {
  try {
    let url = `${getCategoryEndpoint(type)}/${storeId}`;


    const response = await axiosClient.get<TCategoryResponse>(url);
    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.message || "Something went wrong",
        success: false,
      };
    }
    return {
      error: "Unknown error occurred",
      success: false,
    };
  }
}

export async function createCategory(
  data:
    | z.infer<typeof CategorySchema>
    | z.infer<typeof SubCategorySchema>
    | z.infer<typeof SubSubCategorySchema>,
  type: CategoryType = "main"
): Promise<ActionResponse> {
  try {
    let validationResult;

    switch (type) {
      case "sub":
        validationResult = SubCategorySchema.safeParse(data);
        break;
      case "subsub":
        validationResult = SubSubCategorySchema.safeParse(data);
        break;
      case "main":
      default:
        validationResult = CategorySchema.safeParse(data);
        break;
    }

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.errors[0]?.message || "Validation failed",
      };
    }

    const endpoint = getCategoryEndpoint(type);
    const response = await axiosClient.post(endpoint, data);

    revalidatePath("/dashboard/categories");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.message || `Failed to create ${type} category`,
      };
    }
    return {
      success: false,
      error: `Failed to create ${type} category`,
    };
  }
}

export async function updateCategory(
  id: string,
  data:
    | z.infer<typeof UpdateCategorySchema>
    | z.infer<typeof UpdateSubCategorySchema>
    | z.infer<typeof UpdateSubSubCategorySchema>,
  type: CategoryType = "main"
): Promise<ActionResponse> {
  try {
    let validationResult;
    let updateData: Record<string, unknown>;

    switch (type) {
      case "sub":
        const { shopId: subShopId, ...subUpdateData } = data as {
          shopId?: string;
        } & Record<string, unknown>;
        updateData = subUpdateData;
        validationResult = UpdateSubCategorySchema.safeParse(updateData);
        break;
      case "subsub":
        const { shopId: subsubShopId, ...subsubUpdateData } = data as {
          shopId?: string;
        } & Record<string, unknown>;
        updateData = subsubUpdateData;
        validationResult = UpdateSubSubCategorySchema.safeParse(updateData);
        break;
      case "main":
      default:
        const { shopId, ...mainUpdateData } = data as {
          shopId?: string;
        } & Record<string, unknown>;
        updateData = mainUpdateData;
        validationResult = UpdateCategorySchema.safeParse(updateData);
        break;
    }

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.errors[0]?.message || "Validation failed",
      };
    }

    let endpoint = getCategoryEndpoint(type);
    if (type === "subsub") {
      endpoint = `${BACKEND_URL}stock/categories/subsubcategories/${id}`;
    } else {
      endpoint = `${endpoint}/${id}`;
    }

    const response = await axiosClient.put(endpoint, updateData);

    revalidatePath("/dashboard/categories");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.message || `Failed to update ${type} category`,
      };
    }
    return {
      success: false,
      error: `Failed to update ${type} category`,
    };
  }
}

export async function deleteCategory(
  id: string,
  type: CategoryType = "main"
): Promise<ActionResponse> {
  try {
    let endpoint = getCategoryEndpoint(type);
    if (type === "subsub") {
      endpoint = `${BACKEND_URL}stock/categories/subsubcategories/${id}`;
    } else {
      endpoint = `${endpoint}/${id}`;
    }

    await axiosClient.delete(endpoint);

    revalidatePath("/dashboard/categories");

    return {
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.message || `Failed to delete ${type} category`,
      };
    }
    return {
      success: false,
      error: `Failed to delete ${type} category`,
    };
  }
}
