import { Role } from "@workspace/ui/enum/user.enum";

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