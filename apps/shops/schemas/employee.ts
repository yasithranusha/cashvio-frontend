import { z } from "zod";
import { Role } from "@workspace/ui/enum/user.enum";

export const EmployeeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  contactNumber: z.string().min(1, "Contact number is required"),
  role: z
    .nativeEnum(Role, {
      errorMap: () => ({ message: "Please select a valid role" }),
    })
    .refine((role) => [Role.SHOP_STAFF, Role.SHOP_OWNER].includes(role), {
      message: "Only shop staff and shop owner roles are allowed",
    }),
  salary: z.number().min(0, "Salary must be a positive number").optional(),
  dateOfJoining: z.string().min(1, "Date of joining is required"),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  isActive: z.boolean().default(true),
  shopId: z.string().min(1, "Shop ID is required"),
});

export const CreateEmployeeSchema = EmployeeSchema;

export const UpdateEmployeeSchema = EmployeeSchema.omit({
  shopId: true,
}).partial();
