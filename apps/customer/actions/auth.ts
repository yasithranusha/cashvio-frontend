"use server";

import {
  LoginSchema,
  NewPasswordSchema,
  RegisterWithOtpSchema,
  ResetSchema,
  RegisterSchema,
} from "@workspace/ui/schemas/user";
import { z } from "zod";
import axios from "axios";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { BACKEND_URL } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import { axiosClient } from "@/lib/customAxios";
import { Role } from "@workspace/ui/enum/user.enum";

export async function getOtp(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, name } = validatedFields.data;

  try {
    const response = await axios.post(`${BACKEND_URL}/auth/auth/otp/generate`, {
      email,
      name,
    });
    if (response.status !== 201) {
      return { error: "Something went wrong" };
    }
    return { success: "Check your Email for OTP" };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.message || "Something went wrong" };
    }
    return { error: "Something went wrong" };
  }
}

export async function register(values: z.infer<typeof RegisterWithOtpSchema>) {
  const validatedFields = RegisterWithOtpSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const {
    name,
    email,
    password,
    otp,
    contactNumber,
  } = validatedFields.data;

  try {
    const response = await axios.post(`${BACKEND_URL}/auth/auth/register`, {
      name,
      email,
      password,
      contactNumber,
      otp,
    });

    if (response.status !== 201) {
      return { error: "Something went wrong" };
    }

    return { success: "Account Created successfully" };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.message || "Something went wrong" };
    }
    return { error: "Something went wrong" };
  }
}

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

    if (response.data.user.role !== Role.CUSTOMER) {
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
    console.error("Login error", error);
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
    redirect("/signin");
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
