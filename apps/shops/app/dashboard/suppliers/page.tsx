import { getSuppliers } from "@/actions/supplier";
import { columns } from "@/components/supplier/datatable/supplier-columns";
import { DataTable } from "@workspace/ui/components/datatable/datatable";
import { getSelectedShopId } from "@/lib/shop";
import { SupplierDialog } from "@/components/supplier/dialog/supplier-dialog";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Suppliers | Cashvio",
  description:
    "cashvio is a modern and powerful poss system for your business to manage your sales and inventory.",
};

export default async function SupplierPage() {
  const selectedShopId = await getSelectedShopId();

  if (!selectedShopId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No shop selected. Please select a shop or contact support.</p>
      </div>
    );
  }

  const suppliersData = await getSuppliers(selectedShopId);

  if (suppliersData.error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{suppliersData.error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Suppliers</h2>
        <SupplierDialog shopId={selectedShopId} />
      </div>
      <DataTable
        columns={columns}
        data={suppliersData?.data?.data || []}
        searchColumn={["name", "email"]}
        searchPlaceholder="Search by name or email"
      />
    </div>
  );
}
