import { Role } from "@workspace/ui/enum/user.enum";
import { TPaginatedResponse } from "@workspace/ui/types/common";

export interface IShop {
  id: string;
  businessName: string;
  address: string;
  contactPhone: string;
  shopLogo: string | null;
  shopBanner: string | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  role?: string;
}

export interface ISessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  profileImage?: string;
  defaultShopId?: string;
  defaultShop?: IShop;
  shops?: IShop[];
}

export type Session = {
  user: ISessionUser;
  accessToken: string;
  refreshToken: string;
}

export type TUser = {
  id: string;
  name: string;
  email: string;
  dob: string | null;
  profileImage: string | null;
  contactNumber: string | null;
  status: "ACTIVE" | "INACTIVE";
  role: Role;
  defaultShopId: string | null;
  createdAt: string;
  updatedAt: string;
  refreshToken: string | null;
  refreshTokenExp: string | null;
};

// Using the generic paginated response from common.ts
export type TUserResponse = TPaginatedResponse<TUser>;

export type TUserCreate = {
  name: string;
  email: string;
  password: string;
  dob?: string;
  profileImage?: string;
  contactNumber?: string;
  status?: "ACTIVE" | "INACTIVE";
  role: Role;
};

export type TUserUpdate = Partial<Omit<TUserCreate, "password">>;