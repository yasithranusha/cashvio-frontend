"use server";

import { axiosClient } from "@/lib/customAxios";
import { BACKEND_URL } from "@/lib/constants";
import axios from "axios";
import { TSupplierResponse } from "@/types/supplier";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { SupplierSchema } from "@/app/schemas/suppliers";
import { ActionResponse } from "@workspace/ui/types/common";

export async function getSuppliers(storeId: string) {
  try {
    const response = await axiosClient.get<TSupplierResponse>(
      `${BACKEND_URL}/stock/suppliers?shopId=${storeId}`
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

export async function createSupplier(
  data: z.infer<typeof SupplierSchema>
): Promise<ActionResponse> {
  try {
    const validationResult = SupplierSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.errors[0]?.message || "Validation failed",
      };
    }

    const response = await axiosClient.post(`${BACKEND_URL}/stock/suppliers`, {
      ...data,
    });

    revalidatePath("/dashboard/suppliers");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to create supplier",
      };
    }
    return {
      success: false,
      error: "Failed to create supplier",
    };
  }
}

const UpdateSupplierSchema = SupplierSchema.omit({ shopId: true }).partial();

export async function updateSupplier(
  id: string,
  data: z.infer<typeof UpdateSupplierSchema>
): Promise<ActionResponse> {
  try {
    // Extract and remove shopId from the update data if present
    const { shopId, ...updateData } = data as { shopId?: string } & Record<string, unknown>;
    
    const validationResult = UpdateSupplierSchema.safeParse(updateData);
    
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.errors[0]?.message || "Validation failed",
      };
    }

    const response = await axiosClient.put(`${BACKEND_URL}/stock/suppliers/${id}`, updateData);

    revalidatePath("/dashboard/suppliers");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update supplier",
      };
    }
    return {
      success: false,
      error: "Failed to update supplier",
    };
  }
}

export async function deleteSupplier(id: string): Promise<ActionResponse> {
  try {
    await axiosClient.delete(`${BACKEND_URL}/stock/suppliers/${id}`);
    
    revalidatePath("/dashboard/suppliers");

    return {
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete supplier",
      };
    }
    return {
      success: false,
      error: "Failed to delete supplier",
    };
  }
}