"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { ShopRegisterSchema } from "@workspace/ui/schemas/user";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Button } from "@workspace/ui/components/button";
import {
  InputOTP,
  InputOTPSlot,
  InputOTPGroup,
} from "@workspace/ui/components/input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import { toast } from "sonner";
import { getOtp, login, register } from "@/actions/auth";

interface OTPRegisterFormProps {
  className?: string;
  setFormType: (formType: "register" | "otp") => void;
  registerFormValues: z.infer<typeof ShopRegisterSchema>;
  redirectUrl?: string;
}

// Create a simpler schema just for the OTP form
const OtpFormSchema = z.object({
  otp: z.string().length(6, {
    message: "OTP must be exactly 6 characters",
  }),
});

export default function OTPRegisterForm({
  className,
  registerFormValues,
  setFormType,
  redirectUrl,
}: OTPRegisterFormProps) {
  const [isPending, startTransition] = useTransition();
  
  // Use the simplified schema for the form
  const form = useForm<z.infer<typeof OtpFormSchema>>({
    resolver: zodResolver(OtpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  function onSubmit(values: z.infer<typeof OtpFormSchema>) {
    if (!registerFormValues) {
      toast.error("Registration data not found");
      setFormType("register");
      return;
    }

    const promise = (): Promise<string> =>
      new Promise(async (resolve, reject) => {
        startTransition(async () => {
          try {
            const registerResult = await register({
              ...registerFormValues,
              otp: values.otp,
            });

            if (registerResult.error) {
              reject(new Error(registerResult.error));
              return;
            }

            const loginResult = await login({
              email: registerFormValues.email,
              password: registerFormValues.password,
            });

            if (loginResult.error) {
              reject(new Error(loginResult.error));
              return;
            }

            const successMessage =
              loginResult.success || "Registration successful!";
            resolve(successMessage);

            if (redirectUrl) {
              window.location.href = redirectUrl;
            } else {
              window.location.href = "/";
            }
          } catch (error) {
            reject(
              error instanceof Error ? error : new Error("Verification failed")
            );
          }
        });
      });

    toast.promise(promise, {
      loading: "Verifying...",
      success: (message: string) => message || "Registration successful!",
      error: (err: Error) => `${err.message}`,
    });
  }

  function resendOTP() {
    const promise = (): Promise<string> =>
      new Promise(async (resolve, reject) => {
        startTransition(async () => {
          try {
            const result = await getOtp(registerFormValues);
            if (result.error) {
              reject(new Error(result.error));
            } else {
              resolve(result.success || "OTP sent successfully");
            }
          } catch (error) {
            reject(
              error instanceof Error ? error : new Error("Failed to send OTP")
            );
          }
        });
      });

    toast.promise(promise, {
      loading: "Sending OTP...",
      success: (message: string) => message || "OTP sent successfully!",
      error: (err: Error) => `${err.message}`,
    });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="backdrop-blur-md bg-gradient-to-br from-background/70 to-background/50 border border-muted/30 shadow-2xl shadow-primary/20 ring-1 ring-accent/10">
        <CardHeader>
          <CardTitle className="text-2xl">Verify OTP</CardTitle>
          <CardDescription>
            Enter the verification code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription>
                        Please enter the one-time password we have sent to{" "}
                        <span className="underline">
                          {registerFormValues.email}
                        </span>
                      </FormDescription>
                      <div className="flex justify-end gap-2 mt-2">
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={resendOTP}
                          disabled={isPending}
                        >
                          Resend OTP
                        </Button>
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => setFormType("register")}
                          disabled={isPending}
                        >
                          Edit email
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isPending}
                >
                  {isPending ? "Verifying..." : "Submit"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}