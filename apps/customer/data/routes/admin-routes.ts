import { getAvailableRoutesForRole } from "@/lib/role/functions";
import { Role } from "@workspace/ui/enum/user.enum";
import { TlinkTarget } from "@workspace/ui/types/common";
import {
  type LucideIcon as TLucideIcon,
  LayoutDashboard,
  Wallet,
  LifeBuoy,
  ShieldCheck,
  History,
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
    icon: LayoutDashboard,
  },
  {
    title: "Order History",
    url: "/orders",
    icon: History,
  },
  {
    title: "Shop Wallets",
    url: "/wallets",
    icon: Wallet,
  },
  {
    title: "Support Requests",
    url: "/support",
    icon: LifeBuoy,
  },
  {
    title: "Warranty Tracker",
    url: "/warranty",
    icon: ShieldCheck,
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
