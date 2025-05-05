import { getAvailableRoutesForRole } from "@/lib/role/functions";
import { Role } from "@workspace/ui/enum/user.enum";
import { TlinkTarget } from "@workspace/ui/types/common";
import {
  type LucideIcon as TLucideIcon,
  LayoutDashboard,
  LifeBuoy,
  LineChart,
  UserCog,
  Users,
} from "lucide-react";

export interface IBaseMenuItem {
  title: string;
  url: string;
  linkTarget?: TlinkTarget;
  icon?: TLucideIcon;
  onlyForRoles?: Role[];
}

interface ISubMenuItem extends IBaseMenuItem {
  seperator?: boolean;
}

export interface IMenueItem extends IBaseMenuItem {
  items?: ISubMenuItem[];
}

/**
 * An array of routes showing in sidebar as collapsible menu
 */
const navMain: IMenueItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LineChart,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Support Requests",
    url: "/support",
    icon: LifeBuoy,
  },
  {
    title: "Admin Users",
    url: "/admin-users",
    icon: UserCog,
  },
];


/**
 * An array of routes showing in admin sidebar as Dropdown menu
 */
const projects: IMenueItem[] = [];

export function availableNavMainRoutes(role: Role | undefined) {
  return getAvailableRoutesForRole({
    role,
    routes: navMain,
  });
}

export function availableProjectsRoutes(role: Role | undefined) {
  return getAvailableRoutesForRole({
    role,
    routes: projects,
  });
}

export function getAllAvailableRoutes(role: Role | undefined) {
  return [...availableNavMainRoutes(role), ...availableProjectsRoutes(role)];
}
