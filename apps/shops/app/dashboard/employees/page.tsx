import { getEmployees } from "@/actions/employee";
import { columns } from "@/components/employee/datatable/employee-columns";
import { DataTable } from "@workspace/ui/components/datatable/datatable";
import { getSelectedShopId } from "@/lib/shop";
import { EmployeeDialog } from "@/components/employee/dialog/employee-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Users,
  UserPlus,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Activity
} from "lucide-react";
import { Role } from "@workspace/ui/enum/user.enum";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Employees | Cashvio",
  description:
    "Manage your shop employees, roles, and access permissions with Cashvio's employee management system.",
};

export default async function EmployeePage() {
  const selectedShopId = await getSelectedShopId();

  if (!selectedShopId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">No Shop Selected</h3>
          <p className="text-muted-foreground">
            Please select a shop or contact support to continue.
          </p>
        </div>
      </div>
    );
  }

  const employeesData = await getEmployees(selectedShopId);

  if (employeesData.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Failed to Load Employees</h3>
          <p className="text-muted-foreground max-w-md">
            {employeesData.error}
          </p>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const employees = employeesData?.data?.data || [];
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.isActive).length;
  const inactiveEmployees = totalEmployees - activeEmployees;
  const shopOwners = employees.filter(emp => emp.role === Role.SHOP_OWNER).length;
  const staffMembers = employees.filter(emp => emp.role === Role.SHOP_STAFF).length;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">
            Manage your shop staff, roles, and access permissions
          </p>
        </div>
        <EmployeeDialog shopId={selectedShopId} />
      </div>

      {/* Stats Overview */}
      {totalEmployees > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmployees}</div>
              <p className="text-xs text-muted-foreground">
                {activeEmployees} active, {inactiveEmployees} inactive
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeEmployees}</div>
              <p className="text-xs text-muted-foreground">
                Currently working
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shop Owners</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{shopOwners}</div>
              <p className="text-xs text-muted-foreground">
                Administrative access
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
              <UserPlus className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{staffMembers}</div>
              <p className="text-xs text-muted-foreground">
                Regular employees
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Employees Table or Empty State */}
      {totalEmployees === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 px-6">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Users className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Employees Yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Get started by adding your first employee. You can manage their roles,
              contact information, and access permissions.
            </p>
            <EmployeeDialog shopId={selectedShopId} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Employee Directory
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                {totalEmployees} total
              </Badge>
              <Badge variant="outline" className="text-xs">
                {activeEmployees} active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={employees}
              searchColumn={["firstName", "lastName", "email"]}
              searchPlaceholder="Search employees by name or email..."
            />
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {totalEmployees > 0 && (
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <EmployeeDialog shopId={selectedShopId} />
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
