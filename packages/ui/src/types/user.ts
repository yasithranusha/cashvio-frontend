import { Role } from "@workspace/ui/enum/user.enum";

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

export interface ISessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  profileImage?: string;
}

export type Session = {
  user: ISessionUser;
  accessToken: string;
  refreshToken: string;
}