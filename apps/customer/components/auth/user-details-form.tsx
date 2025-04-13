"use client";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { RegisterSchema } from "@workspace/ui/schemas/user";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import Link from "next/link";
import { getOtp } from "@/actions/auth";

type RegisterFormValues = z.infer<typeof RegisterSchema>;

interface UserDataFormProps {
  className?: string;
  setFormType: (formType: "register" | "otp") => void;
  setRegisterFormValues: (values: RegisterFormValues) => void;
  defaultValues: RegisterFormValues;
}

export default function UserDetailsForm({
  className,
  setFormType,
  setRegisterFormValues,
  defaultValues,
}: UserDataFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues,
  });

  function registerOnSubmit(values: RegisterFormValues) {
    const promise = (): Promise<string> =>
      new Promise(async (resolve, reject) => {
        startTransition(async () => {
          try {
            const result = await getOtp(values);
            if (result.error) {
              reject(new Error(result.error));
              return;
            }

            setRegisterFormValues(values);
            setFormType("otp");
            resolve(result.success || "OTP sent successfully");
          } catch (error) {
            reject(
              error instanceof Error ? error : new Error("Failed to send OTP")
            );
          }
        });
      });

    toast.promise(promise, {
      loading: "Sending verification code...",
      success: (message: string) =>
        message || "Verification code sent successfully!",
      error: (err: Error) => `${err.message}`,
    });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="backdrop-blur-md bg-gradient-to-br from-background/70 to-background/50 border border-muted/30 shadow-2xl shadow-primary/20 ring-1 ring-accent/10">
        <CardHeader>
          <CardTitle className="text-2xl">Create a Customer Account</CardTitle>
          <CardDescription>
            Enter your details to create a new customer account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(registerOnSubmit)}>
              <div className="flex flex-col gap-6">
                {/* User Information */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="john.doe@example.com"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="John Doe" type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password fields */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder="******"
                            type={showPassword ? "text" : "password"}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-2.5 text-muted-foreground cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {showPassword ? "Hide password" : "Show password"}
                            </span>
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="confirmPassword">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder="******"
                            type={showConfirmPassword ? "text" : "password"}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-2.5 text-muted-foreground cursor-pointer"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            tabIndex={-1}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {showConfirmPassword
                                ? "Hide password"
                                : "Show password"}
                            </span>
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Terms checkbox */}
                <FormField
                  control={form.control}
                  name="agree"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <div className="text-sm">
                            I agree to the{" "}
                            <Link href="/terms" className="underline">
                              Terms and Conditions
                            </Link>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Creating..." : "Create Account"}
                </Button>

                <Button
                  className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                  type="button"
                  disabled={isPending}
                  asChild
                >
                  <Link href="/google/login">
                    <span>Signup with Google </span>
                    {/* Replace the img tag with inline SVG */}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 256 262"
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="xMidYMid"
                      className="h-5 w-5"
                    >
                      <path
                        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                        fill="#4285F4"
                      />
                      <path
                        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                        fill="#34A853"
                      />
                      <path
                        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                        fill="#FBBC05"
                      />
                      <path
                        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                        fill="#EB4335"
                      />
                    </svg>
                  </Link>
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/signin" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
