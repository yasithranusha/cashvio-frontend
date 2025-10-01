import { getEmployees } from "@/actions/employee";
import { columns } from "@/components/employee/datatable/employee-columns";
import { DataTable } from "@workspace/ui/components/datatable/datatable";
import { getSelectedShopId } from "@/lib/shop";
import { EmployeeDialog } from "@/components/employee/dialog/employee-dialog";

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
      <div className="flex items-center justify-center h-screen">
        <p>No shop selected. Please select a shop or contact support.</p>
      </div>
    );
  }

  const employeesData = await getEmployees(selectedShopId);

  if (employeesData.error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{employeesData.error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Employees</h2>
          <p className="text-muted-foreground">
            Manage your shop staff and their access permissions
          </p>
        </div>
        <EmployeeDialog shopId={selectedShopId} />
      </div>
      <DataTable
        columns={columns}
        data={employeesData?.data?.data || []}
        searchColumn={["firstName", "lastName", "email"]}
        searchPlaceholder="Search by name or email"
      />
    </div>
  );
}
