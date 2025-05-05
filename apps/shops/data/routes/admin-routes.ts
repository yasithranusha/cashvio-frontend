import { getAvailableRoutesForRole } from "@/lib/role/functions";
import { Role } from "@workspace/ui/enum/user.enum";
import { TlinkTarget } from "@workspace/ui/types/common";
import {
  type LucideIcon as TLucideIcon,
  ListStartIcon,
  Folder,
  PieChart,
  LayoutDashboard,
  Users,
  BookUser,
  Package,
  Package2,
  LifeBuoy,
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
    title: "Orders",
    url: "/dashboard/orders",
    icon: Package,
    items: [
      {
        title: "Order History",
        url: "/dashboard/orders",
      },
      {
        title: "Create Order",
        url: "/dashboard/orders/create",
      },
    ],
  },
  {
    title: "Products",
    url: "/dashboard/products",
    icon: Package2,
    items: [
      {
        title: "Products",
        url: "/dashboard/products",
      },
      { title: "Discounts", url: "/dashboard/products/discounts" },
    ],
  },
  {
    title: "Stock",
    url: "/dashboard/stock",
    icon: ListStartIcon,
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
    title: "Cash Flow",
    url: "/dashboard/cashflow",
    icon: PieChart,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
    onlyForRoles: [Role.SHOP_OWNER],
  },
  {
    title: "Support",
    url: "/support",
    icon: LifeBuoy,
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
