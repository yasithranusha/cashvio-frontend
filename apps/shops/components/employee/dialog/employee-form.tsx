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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import { useTransition, useState } from "react";
import { TEmployee } from "@/types/employee";
import { EmployeeSchema } from "@/schemas/employee";
import { createEmployee, updateEmployee } from "@/actions/employee";
import { PhoneInput } from "@workspace/ui/components/phone-input";
import { Role } from "@workspace/ui/enum/user.enum";
import {
  User,
  Mail,
  Phone,
  Shield,
  DollarSign,
  Calendar,
  MapPin,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Loader2
} from "lucide-react";

interface EmployeeFormProps {
  initialData?: TEmployee;
  onSuccess?: () => void;
  shopId?: string;
  onChange?: () => void;
}

export default function EmployeeForm({
  initialData,
  onSuccess,
  shopId,
  onChange,
}: EmployeeFormProps) {
  const [isPending, startTransition] = useTransition();
  const [showOptionalFields, setShowOptionalFields] = useState(false);

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
    mode: "onChange", // Better UX with real-time validation
  });

  const watchedFields = form.watch();
  const isFormValid = form.formState.isValid;
  const hasRequiredFields = watchedFields.firstName && watchedFields.lastName &&
                           watchedFields.email && watchedFields.contactNumber &&
                           watchedFields.role && watchedFields.dateOfJoining;

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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        onChange={onChange}
      >
        {/* Basic Information Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Essential employee details required for account creation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      First Name
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        {...field}
                        className={form.formState.errors.firstName ? "border-destructive" : ""}
                      />
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
                    <FormLabel className="flex items-center gap-2">
                      Last Name
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        {...field}
                        className={form.formState.errors.lastName ? "border-destructive" : ""}
                      />
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
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john.doe@example.com"
                      type="email"
                      {...field}
                      className={form.formState.errors.email ? "border-destructive" : ""}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be used for login and notifications
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Contact Number
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <PhoneInput
                      defaultCountry="LK"
                      placeholder="Enter phone number"
                      {...field}
                      className={form.formState.errors.contactNumber ? "border-destructive" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Employment Details Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5" />
              Employment Details
            </CardTitle>
            <CardDescription>
              Role, salary, and employment information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Role
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className={form.formState.errors.role ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={Role.SHOP_STAFF}>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Shop Staff
                          </div>
                        </SelectItem>
                        <SelectItem value={Role.SHOP_OWNER}>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Shop Owner
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Determines access level and permissions
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Monthly Salary
                    </FormLabel>
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
                    <FormDescription>
                      Optional: Monthly salary amount
                    </FormDescription>
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
                  <FormLabel className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date of Joining
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      className={form.formState.errors.dateOfJoining ? "border-destructive" : ""}
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/50">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-medium">
                      Active Employee Status
                    </FormLabel>
                    <FormDescription>
                      When enabled, employee can access the system and perform their duties
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
          </CardContent>
        </Card>

        {/* Optional Information Section */}
        <Card>
          <Collapsible open={showOptionalFields} onOpenChange={setShowOptionalFields}>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-4 cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {showOptionalFields ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                  Additional Information
                  <span className="text-sm font-normal text-muted-foreground">(Optional)</span>
                </CardTitle>
                <CardDescription>
                  Address and emergency contact details
                </CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4 pt-0">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Address
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="123 Main Street, City, State, ZIP Code"
                          className="resize-none min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Employee's residential address
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Emergency Contact
                      </FormLabel>
                      <FormControl>
                        <PhoneInput
                          defaultCountry="LK"
                          placeholder="Emergency contact number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Phone number to contact in case of emergency
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        <input type="hidden" {...form.register("shopId")} />

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button
            type="submit"
            disabled={isPending || !hasRequiredFields}
            className="flex-1"
            size="lg"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialData ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                {initialData ? "Update Employee" : "Add Employee"}
              </>
            )}
          </Button>

          {!hasRequiredFields && (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Please fill in all required fields
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}
