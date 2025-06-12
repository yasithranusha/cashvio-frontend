"use server";

import { axiosClient } from "@/lib/customAxios";
import { BACKEND_URL, ORDER_PATH } from "@/lib/constants";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActionResponse } from "@workspace/ui/types/common";
import { CustomerData, CustomerWarrantyResponse } from "@/types/order";

export async function getCustomerOrderHistoryWithWallet(customerId?: string) {
  try {
    const url = `${BACKEND_URL}${ORDER_PATH}/customer-orders/all/${customerId}/history`;

    const response = await axiosClient.get<CustomerData>(url);

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

export async function getCustomerWarrantyHistory(customerId?: string) {
  try {
    const url = `${BACKEND_URL}${ORDER_PATH}/customer-orders/all/${customerId}/warranty`;

    const response = await axiosClient.get<CustomerWarrantyResponse>(url);

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
