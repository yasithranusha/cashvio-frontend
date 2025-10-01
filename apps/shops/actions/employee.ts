"use server";

import { axiosClient } from "@/lib/customAxios";
import { BACKEND_URL } from "@/lib/constants";
import axios from "axios";
import { TEmployeeResponse } from "@/types/employee";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { EmployeeSchema, UpdateEmployeeSchema } from "@/schemas/employee";
import { ActionResponse } from "@workspace/ui/types/common";

export async function getEmployees(storeId: string) {
  try {
    const response = await axiosClient.get<TEmployeeResponse>(
      `${BACKEND_URL}/employees?shopId=${storeId}`
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

export async function getEmployee(id: string) {
  try {
    const response = await axiosClient.get(`${BACKEND_URL}/employees/${id}`);
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

export async function createEmployee(
  data: z.infer<typeof EmployeeSchema>
): Promise<ActionResponse> {
  try {
    const validationResult = EmployeeSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.errors[0]?.message || "Validation failed",
      };
    }

    const response = await axiosClient.post(`${BACKEND_URL}/employees`, {
      ...data,
    });

    revalidatePath("/dashboard/employees");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to create employee",
      };
    }
    return {
      success: false,
      error: "Failed to create employee",
    };
  }
}

export async function updateEmployee(
  id: string,
  data: z.infer<typeof UpdateEmployeeSchema>
): Promise<ActionResponse> {
  try {
    // Extract and remove shopId from the update data if present
    const { shopId, ...updateData } = data as { shopId?: string } & Record<
      string,
      unknown
    >;

    const validationResult = UpdateEmployeeSchema.safeParse(updateData);

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.errors[0]?.message || "Validation failed",
      };
    }

    const response = await axiosClient.put(
      `${BACKEND_URL}/employees/${id}`,
      updateData
    );

    revalidatePath("/dashboard/employees");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update employee",
      };
    }
    return {
      success: false,
      error: "Failed to update employee",
    };
  }
}

export async function deleteEmployee(id: string): Promise<ActionResponse> {
  try {
    await axiosClient.delete(`${BACKEND_URL}/employees/${id}`);

    revalidatePath("/dashboard/employees");

    return {
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete employee",
      };
    }
    return {
      success: false,
      error: "Failed to delete employee",
    };
  }
}

export async function toggleEmployeeStatus(
  id: string,
  isActive: boolean
): Promise<ActionResponse> {
  try {
    const response = await axiosClient.patch(
      `${BACKEND_URL}/employees/${id}/status`,
      {
        isActive,
      }
    );

    revalidatePath("/dashboard/employees");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Failed to update employee status",
      };
    }
    return {
      success: false,
      error: "Failed to update employee status",
    };
  }
}
