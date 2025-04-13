"use client";
import { z } from "zod";
import { useState } from "react";
import { RegisterSchema  } from "@workspace/ui/schemas/user";
import UserDetailsForm from "@/components/auth/user-details-form";
import OTPRegisterForm from "@/components/auth/otp-form";
import { cn } from "@workspace/ui/lib/utils";

interface RegisterFormProps {
  className?: string;
  redirectUrl?: string;
}

const defaultFormValues: z.infer<typeof RegisterSchema> = {
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  agree: false,
};

export default function RegisterForm({
  className,
  redirectUrl = "/",
}: RegisterFormProps) {
  const [formType, setFormType] = useState<"register" | "otp">("register");
  const [registerFormValues, setRegisterFormValues] =
    useState<z.infer<typeof RegisterSchema>>(defaultFormValues);

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      {formType === "register" ? (
        <UserDetailsForm
          setFormType={setFormType}
          setRegisterFormValues={setRegisterFormValues}
          defaultValues={registerFormValues}
          className="w-full"
        />
      ) : (
        <OTPRegisterForm
          setFormType={setFormType}
          registerFormValues={registerFormValues}
          redirectUrl={redirectUrl}
          className="w-full"
        />
      )}
    </div>
  );
}
