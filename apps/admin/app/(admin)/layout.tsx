import { cookies } from "next/headers";

import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import AdminHeaderContent from "@/components/sidebar/sidebar-header";
import { getSession } from "@/lib/session";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const session = await getSession();

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
      <div className="flex h-screen w-screen overflow-hidden">
        <AppSidebar user={user} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeaderContent role={user.role} />
          <div className="flex-1 overflow-auto p-4">
            <div className="container mx-auto">{children}</div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
