import { getAvailableRoutesForRole } from "@/lib/role/functions";
import { Role } from "@workspace/ui/enum/user.enum";
import { TlinkTarget } from "@workspace/ui/types/common";
import {
  type LucideIcon as TLucideIcon,
  HistoryIcon,
  ListStartIcon,
  Frame,
  Folder,
  Forward,
  Trash2,
  PieChart,
  LayoutDashboard,
  Users,
  BookUser,
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
    items: [
      {
        title: "Overview",
        url: "/dashboard/overview",
        icon: HistoryIcon,
      },
      {
        title: "Activity",
        url: "/dashboard/activity",
        icon: ListStartIcon,
      },
      {
        title: "Settings",
        url: "/dashboard/settings",
      },
    ],
  },
  {
    title: "Categories",
    url: "/dashboard/categories",
    icon: Folder,
    items: [
      {
        title: "Main Categories",
        url: "/dashboard/categories",
      },
      {
        title: "L1 Subcategories",
        url: "/dashboard/categories/subcategories",
      },
      {
        title: "L2 Subcategories",
        url: "/dashboard/categories/subsubcategories",
      },
    ],
  },
  {
    title: "Suppliers",
    url: "/dashboard/suppliers",
    icon: BookUser,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
    onlyForRoles: [Role.SHOP_OWNER],
  },
];

/**
 * An array of routes showing in admin sidebar as Dropdown menu
 */
const projects: IMenueItem[] = [
  {
    title: "Design Engineering",
    url: "/design",
    icon: Frame,
    items: [
      {
        title: "View Project",
        url: "/design/view",
        icon: Folder,
      },
      {
        title: "Share Project",
        url: "/design/share",
        icon: Forward,
        seperator: true,
      },
      {
        title: "Delete Project",
        url: "/design/delete",
        icon: Trash2,
      },
    ],
  },
  {
    title: "Sales & Marketing",
    url: "/sales",
    icon: PieChart,
    items: [
      {
        title: "View Project",
        url: "/sales/view",
        icon: Folder,
      },
      {
        title: "Share Project",
        url: "/sales/share",
        icon: Forward,
      },
      {
        title: "Delete Project",
        url: "/sales/delete",
        icon: Trash2,
      },
    ],
  },
  {
    title: "Sales & Marketing 2",
    url: "/sales2",
    icon: PieChart,
    items: [
      {
        title: "View Project 2",
        url: "/sales2/view",
        icon: Folder,
      },
      {
        title: "Share Project 2",
        url: "/sales2/share",
        icon: Forward,
      },
      {
        title: "Delete Project 2",
        url: "/sales2/delete",
        icon: Trash2,
      },
    ],
  },
];

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
