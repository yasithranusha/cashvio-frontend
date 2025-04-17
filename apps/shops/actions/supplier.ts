"use server";

import { axiosClient } from "@/lib/customAxios";
import { BACKEND_URL } from "@/lib/constants";
import axios from "axios";
import { TSupplierResponse } from "@/types/supplier";

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
