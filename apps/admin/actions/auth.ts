"use server";

import {
  LoginSchema,
  NewPasswordSchema,
  ResetSchema,
} from "@workspace/ui/schemas/user";
import { z } from "zod";
import axios from "axios";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { BACKEND_URL } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import { axiosClient } from "@/lib/customAxios";

export async function login(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  try {
    const response = await axios.post(`${BACKEND_URL}/auth/auth/login`, {
      email,
      password,
    });

    if (
      response.data.user.role !== "ADMIN" &&
      response.data.user.role !== "SUPER_ADMIN"
    ) {
      return { error: "Invalid email or password." };
    }

    await createSession({
      user: {
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        role: response.data.user.role,
        profileImage: response.data.user?.profileImage,
      },
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    });
    return { success: "Logged in successfully" };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.message || "Something went wrong" };
    }
    return { error: "Something went wrong" };
  }
}

export async function reset(values: z.infer<typeof ResetSchema>) {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email } = validatedFields.data;

  try {
    await axios.post(`${BACKEND_URL}/auth/auth/forgot-password`, {
      email,
      useCase: "forgetPassword",
      role: "user",
    });
    return { success: "Reset email sent check your email" };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.message || "Something went wrong" };
    }
    return { error: "Something went wrong" };
  }
}

export async function signout() {
  const res = await axiosClient.post(`${BACKEND_URL}/auth/auth/logout`, {});
  if (res.status !== 201) {
    throw new Error("Failed to sign out");
  }

  await deleteSession();
  revalidatePath("/", "layout");
  revalidatePath("/", "page");

  redirect("/");
}

export const refreshToken = async (oldToken: string) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/auth/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${oldToken}`,
        },
      }
    );

    return response.data.accessToken;
  } catch (error) {
    console.error("Failed to refresh the token", error);
    redirect("/login");
  }
};

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>
) => {
  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password, token } = validatedFields.data;

  try {
    const response = await axios.post(
      `${BACKEND_URL}/auth/auth/reset-password`,
      {
        password,
        token,
      }
    );

    return { success: response.data.message };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.message || "Something went wrong" };
    }
    return { error: "Something went wrong" };
  }
};
