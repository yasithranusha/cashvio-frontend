import * as z from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const LoginSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email(),
  password: z.string().min(1, { message: "Password is required" }),
});

export const ResetSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email(),
});

const userInfoSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters long",
  }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Must be a valid email address" }),
  dob: z
    .date()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        const now = new Date();
        return date < now;
      },
      { message: "Date of birth must be in the past" }
    ),
});

export const updateUserInfoSchema = userInfoSchema.extend({
  profileImage: z.string().optional(),
});

const passwordSchema = z.object({
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .refine((value) => passwordRegex.test(value), {
      message:
        "Password must be at least 8 characters and include uppercase, lowercase, number and special character",
    }),
  confirmPassword: z
    .string()
    .min(1, { message: "Confirm password is required" }),
});

const userWithPasswordSchema = z.object({
  ...userInfoSchema.shape,
  ...passwordSchema.shape,
});

const baseRegisterSchema = userWithPasswordSchema.extend({
  agree: z.boolean().refine((value) => value === true, {
    message: "You must agree to the terms and conditions.",
  }),
});

export const RegisterSchema = baseRegisterSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords must match",
    path: ["confirmPassword"],
  }
);

export const RegisterWithOtpSchema = baseRegisterSchema.extend({
  otp: z.string().length(6, {
    message: "OTP must be exactly 6 characters",
  }),
});

export const otpSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export const updatePasswordSchema = passwordSchema.extend({
  oldPassword: z.string().min(1, { message: "Old password is required" }),
});

export const NewPasswordWithToken = passwordSchema.extend({
  token: z.string(),
});

export const NewPasswordSchema = NewPasswordWithToken.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords must match",
    path: ["confirmPassword"],
  }
);
