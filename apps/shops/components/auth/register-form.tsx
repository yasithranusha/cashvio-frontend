"use client";
import { z } from "zod";
import { useState } from "react";
import { ShopRegisterSchema } from "@workspace/ui/schemas/user";
import ShopDetailsForm from "@/components/auth/shop-details-form";
import OTPRegisterForm from "@/components/auth/otp-form";
import { cn } from "@workspace/ui/lib/utils";

interface RegisterFormProps {
  className?: string;
  redirectUrl?: string;
}

const defaultFormValues: z.infer<typeof ShopRegisterSchema> = {
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  businessName: "",
  address: "",
  contactPhone: "",
  agree: false,
};

export default function RegisterForm({
  className,
  redirectUrl = "/",
}: RegisterFormProps) {
  const [formType, setFormType] = useState<"register" | "otp">("register");
  const [registerFormValues, setRegisterFormValues] =
    useState<z.infer<typeof ShopRegisterSchema>>(defaultFormValues);

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      {formType === "register" ? (
        <ShopDetailsForm
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
