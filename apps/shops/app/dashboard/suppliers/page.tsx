import { getSuppliers } from "@/actions/supplier";
import { columns } from "@/components/supplier/datatable/supplier-columns";
import { DataTable } from "@workspace/ui/components/datatable/datatable";
import { getSession } from "@/lib/session";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Suppliers | Cashvio",
  description:
    "cashvio is a modern and powerful posst system for your business to manage your sales and inventory.",
};

export default async function SupplierPage() {
  const suppliersData = await getSuppliers(
    "d20139cf-cb49-4999-a6e2-ff02830c13de"
  );

  // const filters = [
  //   {
  //     title: "Status",
  //     filterKey: "status",
  //     options: [
  //       {
  //         label: "Pending",
  //         value: "pending",
  //       },
  //       {
  //         label: "Processing",
  //         value: "processing",
  //       },
  //       {
  //         label: "Success",
  //         value: "success",
  //       },
  //       {
  //         label: "Failed",
  //         value: "failed",
  //       },
  //     ],
  //   },
  // ];

  if (suppliersData.error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{suppliersData.error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={suppliersData?.data?.data || []}
        searchColumn="email"
        searchPlaceholder="Filter emails..."
      />
    </div>
  );
}
