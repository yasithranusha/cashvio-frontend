"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import { BRAND } from "@workspace/ui/data/brand";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavUser } from "@/components/sidebar/nav-user";
import { ISessionUser } from "@workspace/ui/types/user";
import {
  availableNavMainRoutes,
  availableProjectsRoutes,
} from "@/data/routes/admin-routes";
import Image from "next/image";

type AppSidebarProps = {
  user: ISessionUser;
  className?: string;
};

export function AppSidebar({ user, className, ...props }: AppSidebarProps) {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" className={className} {...props}>
      <SidebarHeader>
        <div className="w-full flex justify-center items-center py-3">
          <Image
            alt={BRAND.name}
            height={50}
            width={100}
            src={open ? BRAND?.logo || BRAND.mobilelogo : BRAND.mobilelogo}
            className={`object-contain dark:invert`}
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={availableNavMainRoutes(user.role)} />
        <NavProjects projects={availableProjectsRoutes(user.role)} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
