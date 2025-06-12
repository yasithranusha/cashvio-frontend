"use server";

import { axiosClient } from "@/lib/customAxios";
import { AUTH_PATH, BACKEND_URL } from "@/lib/constants";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActionResponse } from "@workspace/ui/types/common";
import { TUserResponse } from "@workspace/ui/types/user";

export async function getUsers(type?: string) {
  try {
    const response = await axiosClient.get<TUserResponse>(
      `${BACKEND_URL}${AUTH_PATH}/users?role=${type === "admin" ? "SUPER_ADMIN" : "SHOP_OWNER"}`
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
