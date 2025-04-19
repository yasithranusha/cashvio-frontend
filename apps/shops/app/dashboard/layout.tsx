import { cookies } from "next/headers";

import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import AdminHeaderContent from "@/components/sidebar/sidebar-header";
import { getSession } from "@/lib/session";
import { getSelectedShopId } from "@/lib/shop";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  const session = await getSession();
  const selectedShopId = await getSelectedShopId();

  const user = session?.user;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex h-screen w-screen">
        <AppSidebar user={user} selectedShopId={selectedShopId} />
        <div className="flex-1 flex flex-col ">
          <AdminHeaderContent role={user.role} />
          <div className="flex-1 overflow-auto ">
            <div className="container mx-auto">{children}</div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
