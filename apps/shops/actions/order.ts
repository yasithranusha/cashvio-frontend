"use server";

import { axiosClient } from "@/lib/customAxios";
import { AUTH_PATH, BACKEND_URL, ORDER_PATH, STOCK_PATH } from "@/lib/constants";
import axios from "axios";
import {
  TCustomerResponse,
  TOrdersResponse,
  TProductResponse,
} from "@workspace/ui/types/order";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActionResponse } from "@workspace/ui/types/common";
import { OrderFormSchema } from "@/schemas/order";

export async function getCustomers(shopId: string) {
  try {
    const url = `${BACKEND_URL}${AUTH_PATH}/shops/${shopId}/customers`;

    const response = await axiosClient.get<TCustomerResponse>(url);

    return {
      data: response.data.data,
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

export async function getOrders(shopId: string) {
  try {
    const url = `${BACKEND_URL}${ORDER_PATH}/orders?shopId=${shopId}`;

    const response = await axiosClient.get<TOrdersResponse>(url);

    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.message || "Failed to fetch orders",
        success: false,
      };
    }
    return {
      error: "Unknown error occurred",
      success: false,
    };
  }
}

export async function getProducts(shopId: string) {
  try {
    const url = `${BACKEND_URL}${STOCK_PATH}/products/with-items?shopId=${shopId}`;
    const response = await axiosClient.get<TProductResponse>(url);

    return {
      data: response.data.data,
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

export async function getCustomerWalletBalance(
  shopId: string,
  customerId: string
) {
  try {
    const url = `${BACKEND_URL}${ORDER_PATH}/customer-wallet/${shopId}/${customerId}`;
    const response = await axiosClient.get(url);

    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error:
          error.response?.data?.message ||
          "Failed to get customer wallet balance",
        success: false,
      };
    }
    return {
      error: "Failed to get customer wallet balance",
      success: false,
    };
  }
}

export async function createOrder(
  data: z.infer<typeof OrderFormSchema>
): Promise<ActionResponse> {
  try {
    const validationResult = OrderFormSchema.safeParse(data);

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.errors[0]?.message || "Validation failed",
      };
    }

    const orderData = validationResult.data;

    const response = await axiosClient.post(
      `${BACKEND_URL}${ORDER_PATH}/orders`,
      orderData
    );

    // Revalidate the orders page to show the new order
    revalidatePath("/dashboard/orders");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to create order",
      };
    }
    return {
      success: false,
      error: "Failed to create order",
    };
  }
}
