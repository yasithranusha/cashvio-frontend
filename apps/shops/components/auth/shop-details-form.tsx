"use client";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { ShopRegisterSchema } from "@workspace/ui/schemas/user";
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

type ShopRegisterFormValues = z.infer<typeof ShopRegisterSchema>;

interface UserDataFormProps {
  className?: string;
  setFormType: (formType: "register" | "otp") => void;
  setRegisterFormValues: (values: ShopRegisterFormValues) => void;
  defaultValues: ShopRegisterFormValues;
}

export default function ShopDetailsForm({
  className,
  setFormType,
  setRegisterFormValues,
  defaultValues,
}: UserDataFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ShopRegisterFormValues>({
    resolver: zodResolver(ShopRegisterSchema),
    defaultValues,
  });

  function registerOnSubmit(values: ShopRegisterFormValues) {
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
          <CardTitle className="text-2xl">Create a Shop Account</CardTitle>
          <CardDescription>
            Enter your details to create a new shop account
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

                {/* Shop Information */}
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Your Business Name"
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="123 Business Street, City"
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Telephone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="+1234567890"
                          type="tel"
                        />
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
                  {isPending ? "Creating..." : "Create Shop"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
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
