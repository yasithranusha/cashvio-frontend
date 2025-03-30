'use client'

import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import { Separator } from "@workspace/ui/components/separator";
import { useAdminRoutes } from "@workspace/ui/hooks/useAdminRoutes";
import { usePathname } from "next/navigation";
import { Role } from "@workspace/ui/enum/user.enum";
import { getAllAvailableRoutes } from "@/data/routes/admin-routes";

interface AdminHeaderContentProps {
  role: Role;
}

export default function AdminHeaderContent({ 
  role,
}: AdminHeaderContentProps) {
  const pathname = usePathname();
  const availableRoutes = getAllAvailableRoutes(role);
  const { pathOne, pathTwo } = useAdminRoutes(availableRoutes, pathname);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1 cursor-pointer" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="line-clamp-1">
            <BreadcrumbPage>{pathOne?.title}</BreadcrumbPage>
          </BreadcrumbItem>
          {pathTwo && <BreadcrumbSeparator className="hidden md:block" />}
          {pathTwo && (
            <BreadcrumbItem>
              <BreadcrumbPage>{pathTwo.title}</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}