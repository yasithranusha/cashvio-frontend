"use server";

import { axiosClient } from "@/lib/customAxios";
import { BACKEND_URL, STOCK_PATH } from "@/lib/constants";
import axios from "axios";
import { TStockItemResponse } from "@workspace/ui/types/stock";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { StockItemSchema, UpdateStockItemSchema } from "@workspace/ui/schemas/stock";
import { ActionResponse } from "@workspace/ui/types/common";

export async function getStockItems(productId?: string) {
  try {
    const url = productId
      ? `${BACKEND_URL}${STOCK_PATH}/items?productId=${productId}`
      : `${BACKEND_URL}${STOCK_PATH}/items`;
      
    const response = await axiosClient.get<TStockItemResponse>(url);
    
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

export async function createStockItem(
  data: z.infer<typeof StockItemSchema>
): Promise<ActionResponse> {
  try {
    const validationResult = StockItemSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.errors[0]?.message || "Validation failed",
      };
    }

    const response = await axiosClient.post(
      `${BACKEND_URL}${STOCK_PATH}/items`,
      data
    );

    revalidatePath("/dashboard/inventory");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to create stock item",
      };
    }
    return {
      success: false,
      error: "Failed to create stock item",
    };
  }
}

export async function updateStockItem(
  itemId: string,
  data: z.infer<typeof UpdateStockItemSchema>
): Promise<ActionResponse> {
  try {
    const validationResult = UpdateStockItemSchema.safeParse(data);
    
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.errors[0]?.message || "Validation failed",
      };
    }

    const response = await axiosClient.put(
      `${BACKEND_URL}${STOCK_PATH}/items/${itemId}`,
      data
    );

    revalidatePath("/dashboard/inventory");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update stock item",
      };
    }
    return {
      success: false,
      error: "Failed to update stock item",
    };
  }
}

export async function deleteStockItem(itemId: string): Promise<ActionResponse> {
  try {
    await axiosClient.delete(`${BACKEND_URL}${STOCK_PATH}/items/${itemId}`);
    
    revalidatePath("/dashboard/inventory");

    return {
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete stock item",
      };
    }
    return {
      success: false,
      error: "Failed to delete stock item",
    };
  }
}