import { TPaginatedResponse } from "@workspace/ui/types/common";
import { Role } from "@workspace/ui/enum/user.enum";

export type TEmployee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  role: Role;
  salary?: number;
  dateOfJoining: string;
  address?: string;
  emergencyContact?: string;
  isActive: boolean;
  shopId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TEmployeeResponse = TPaginatedResponse<TEmployee>;

export type TEmployeeFormData = Omit<
  TEmployee,
  "id" | "createdAt" | "updatedAt"
>;
