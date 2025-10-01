"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Switch } from "@workspace/ui/components/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useTransition } from "react";
import { TEmployee } from "@/types/employee";
import { EmployeeSchema } from "@/schemas/employee";
import { createEmployee, updateEmployee } from "@/actions/employee";
import { PhoneInput } from "@workspace/ui/components/phone-input";
import { Role } from "@workspace/ui/enum/user.enum";

interface EmployeeFormProps {
  initialData?: TEmployee;
  onSuccess?: () => void;
  shopId?: string;
}

export default function EmployeeForm({
  initialData,
  onSuccess,
  shopId,
}: EmployeeFormProps) {
  const [isPending, startTransition] = useTransition();

  const defaultValues = {
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    contactNumber: initialData?.contactNumber || "",
    role: initialData?.role || Role.SHOP_STAFF,
    salary: initialData?.salary || undefined,
    dateOfJoining: initialData?.dateOfJoining
      ? new Date(initialData.dateOfJoining).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    address: initialData?.address || "",
    emergencyContact: initialData?.emergencyContact || "",
    isActive: initialData?.isActive ?? true,
    shopId: initialData?.shopId || shopId || "",
  };

  const form = useForm<z.infer<typeof EmployeeSchema>>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues,
    mode: "onBlur",
  });

  function onSubmit(values: z.infer<typeof EmployeeSchema>) {
    startTransition(async () => {
      let result;

      if (initialData) {
        // Update existing employee
        result = await updateEmployee(initialData.id, values);
      } else {
        // Create new employee
        result = await createEmployee(values);
      }

      if (result.success) {
        toast.success(
          `Employee ${initialData ? "updated" : "created"} successfully!`
        );
        form.reset();
        onSuccess?.();
      } else {
        toast.error(result.error || "Something went wrong");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="john.doe@example.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <PhoneInput
                  defaultCountry="LK"
                  placeholder="Enter phone number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={Role.SHOP_STAFF}>Shop Staff</SelectItem>
                    <SelectItem value={Role.SHOP_OWNER}>Shop Owner</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="50000"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value ? parseFloat(value) : undefined);
                    }}
                  />
                </FormControl>
                <FormDescription>Monthly salary amount</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dateOfJoining"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Joining</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
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
              <FormLabel>Address (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="123 Main Street, City, State"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="emergencyContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emergency Contact (Optional)</FormLabel>
              <FormControl>
                <PhoneInput
                  defaultCountry="LK"
                  placeholder="Emergency contact number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Employee</FormLabel>
                <FormDescription>
                  Employee can access the system and perform their duties
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <input type="hidden" {...form.register("shopId")} />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending
            ? initialData
              ? "Updating..."
              : "Creating..."
            : initialData
              ? "Update Employee"
              : "Add Employee"}
        </Button>
      </form>
    </Form>
  );
}
