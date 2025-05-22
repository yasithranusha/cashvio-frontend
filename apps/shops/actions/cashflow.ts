"use server";

import { axiosClient } from "@/lib/customAxios";
import { BACKEND_URL } from "@/lib/constants";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActionResponse } from "@workspace/ui/types/common";
import { CashflowData, ShopBalance, UpcomingPayment } from "@/types/cashflow";
import { CustomerDuesResponse } from "@/types/customer-dues";
import { UpcomingPaymentsResponse } from "@/types/upcoming-payments";
import {
  createUpcomingPaymentSchema,
  updateUpcomingPaymentSchema,
} from "@/schemas/cashflow";

export async function getShopCashFlow(shopId?: string) {
  try {
    const url = `${BACKEND_URL}/order/cash-flow/comprehensive/${shopId}`;

    const response = await axiosClient.get<CashflowData>(url);

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

export async function getCustomerDues(shopId?: string) {
  try {
    const url = `${BACKEND_URL}/order/cash-flow/customer-dues/${shopId}`;

    const response = await axiosClient.get<CustomerDuesResponse>(url);

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

export async function getUpcomingPayments(shopId?: string) {
  try {
    const url = `${BACKEND_URL}/order/upcoming-payments?shopId=${shopId}`;

    const response = await axiosClient.get<UpcomingPaymentsResponse>(url);

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

export async function getUpcomingPaymentById(paymentid?: string) {
  try {
    const url = `${BACKEND_URL}/order/upcoming-payments/${paymentid}`;

    const response = await axiosClient.get<UpcomingPayment>(url);
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

export async function createUpcomingPayment(
  data: z.infer<typeof createUpcomingPaymentSchema>
): Promise<ActionResponse> {
  try {
    const validationResult = createUpcomingPaymentSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.errors[0]?.message || "Validation failed",
      };
    }

    const response = await axiosClient.post(
      `${BACKEND_URL}/order/upcoming-payments`,
      data
    );

    revalidatePath("/dashboard/cashflow");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to create cashflow",
      };
    }
    return {
      success: false,
      error: "Failed to create cashflow",
    };
  }
}

export async function updateUpcomingPayment(
  data: z.infer<typeof updateUpcomingPaymentSchema>
): Promise<ActionResponse> {
  try {
    const validationResult = updateUpcomingPaymentSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.errors[0]?.message || "Validation failed",
      };
    }

    const response = await axiosClient.put(
      `${BACKEND_URL}/order/upcoming-payments/${data.id}`,
      data
    );

    revalidatePath("/dashboard/cashflow");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update cashflow",
      };
    }
    return {
      success: false,
      error: "Failed to update cashflow",
    };
  }
}

export async function deleteUpcomingPayment(
  paymentId: string
): Promise<ActionResponse> {
  try {
    const response = await axiosClient.delete(
      `${BACKEND_URL}/order/upcoming-payments/${paymentId}`
    );

    revalidatePath("/dashboard/cashflow");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete cashflow",
      };
    }
    return {
      success: false,
      error: "Failed to delete cashflow",
    };
  }
}

export async function getShopBaBalance(shopId: string) { 
  try {
    const response = await axiosClient.get<ShopBalance>(
      `${BACKEND_URL}/order/shop-balance/${shopId}`
    );

    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get shop balance",
      };
    }
    return {
      success: false,
      error: "Failed to get shop balance",
    };
  }
}
