import { UsersChart } from "@/components/users/area-chart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { UserPlus, LifeBuoy, Bell } from "lucide-react";

async function getNewUsersCount() {
  return 1;
}

async function getSupportRequestsCount() {
  return 12;
}

// Add a function to get unread support requests
async function getUnreadSupportRequestsCount() {
  // Replace with actual API call in production
  return 5;
}

export default async function Dashboard() {
  const [newUsersCount, supportRequestsCount, unreadSupportRequestsCount] = await Promise.all([
    getNewUsersCount(),
    getSupportRequestsCount(),
    getUnreadSupportRequestsCount(),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <UsersChart />
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                New Users Today
              </CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newUsersCount}</div>
              <p className="text-xs text-muted-foreground">
                Users registered in the last 24 hours
              </p>
            </CardContent>
          </Card>

          <Card className={unreadSupportRequestsCount > 0 ? "border-red-400" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                Support Requests
                {unreadSupportRequestsCount > 0 && (
                  <span className="inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white">
                    {unreadSupportRequestsCount} new
                  </span>
                )}
              </CardTitle>
              <div className="relative">
                <LifeBuoy className="h-4 w-4 text-muted-foreground" />
                {unreadSupportRequestsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                {supportRequestsCount}
                {unreadSupportRequestsCount > 0 && (
                  <span className="ml-2 text-sm font-normal text-red-500 flex items-center gap-1">
                    <Bell className="h-3 w-3" />
                    {unreadSupportRequestsCount} unread
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Open tickets requiring attention
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}