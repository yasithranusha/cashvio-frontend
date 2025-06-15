"use server";

import { axiosClient } from "@/lib/customAxios";
import { BACKEND_URL, STOCK_PATH } from "@/lib/constants";
import axios from "axios";
import { TProductResponse } from "@workspace/ui/types/product"
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ProductSchema } from "@workspace/ui/schemas/products";
import { ActionResponse } from "@workspace/ui/types/common";

export async function getProducts(shopId: string) {
  try {
    const response = await axiosClient.get<TProductResponse>(
      `${BACKEND_URL}${STOCK_PATH}/products?shopId=${shopId}`
    );
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

export async function getProductById(productId: string): Promise<ActionResponse> {
  try {
    const response = await axiosClient.get(
      `${BACKEND_URL}${STOCK_PATH}/products/${productId}`
    );
    
    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.message || "Failed to fetch product details",
        success: false,
      };
    }
    return {
      error: "Unknown error occurred while fetching product",
      success: false,
    };
  }
}

export async function createProduct(
  data: z.infer<typeof ProductSchema>
): Promise<ActionResponse> {
  try {
    const validationResult = ProductSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.errors[0]?.message || "Validation failed",
      };
    }

    const response = await axiosClient.post(
      `${BACKEND_URL}${STOCK_PATH}/products`,
      {
        ...data,
      }
    );

    revalidatePath("/dashboard/products");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to create product",
      };
    }
    return {
      success: false,
      error: "Failed to create product",
    };
  }
}

const UpdateProductSchema = ProductSchema.omit({ shopId: true }).partial();

export async function updateProduct(
  id: string,
  data: z.infer<typeof UpdateProductSchema>
): Promise<ActionResponse> {
  try {
    // Extract and remove shopId from the update data if present
    const { shopId, ...updateData } = data as { shopId?: string } & Record<string, unknown>;
    
    const validationResult = UpdateProductSchema.safeParse(updateData);
    
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.errors[0]?.message || "Validation failed",
      };
    }

    const response = await axiosClient.put(
      `${BACKEND_URL}${STOCK_PATH}/products/${id}`,
      updateData
    );

    revalidatePath("/dashboard/products");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update product",
      };
    }
    return {
      success: false,
      error: "Failed to update product",
    };
  }
}

export async function deleteProduct(id: string): Promise<ActionResponse> {
  try {
    await axiosClient.delete(`${BACKEND_URL}${STOCK_PATH}/products/${id}`);
    
    revalidatePath("/dashboard/products");

    return {
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete product",
      };
    }
    return {
      success: false,
      error: "Failed to delete product",
    };
  }
}