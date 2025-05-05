import { DataTable } from "@workspace/ui/components/datatable/datatable";
import { columns } from "@/components/users/table/user-column";
import { getUsers } from "@/actions/users";

export default async function Dashboard() {
  const response = await getUsers();
  
  if (!response.success) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Registered Owners</h1>
        <p className="text-destructive-foreground">Error: {response.error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Registered Owners</h1>
      <DataTable
        columns={columns}
        seperateFilters
        data={Array.isArray(response.data?.data) ? response.data.data : []}
        searchColumn={["email"]}
        searchPlaceholder="Search by name, display name, or description"
      />
    </div>
  );
}