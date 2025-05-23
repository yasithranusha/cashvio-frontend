"use client";

import { DataTable } from "@workspace/ui/components/datatable/datatable";
import { columns, Warranty } from "./warrenty-columns";

type WarrantyClientProps = {
  warrantyData: {
    warranties: Warranty[];
    error: string | null;
  };
};

export default function WarrantyClient({ warrantyData }: WarrantyClientProps) {
  // Count active warranties
  const activeWarranties = warrantyData.warranties.filter(
    (w) => w.status === "Active"
  ).length;

  // Handle error state
  if (warrantyData.error) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Warranty Tracker</h1>
          <p className="text-red-500 mt-1">Error: {warrantyData.error}</p>
        </div>
      </div>
    );
  }

  // Define the filters with string values
  const warrantyFilters = [
    {
      title: "Status",
      filterKey: "status",
      options: [
        { label: "Active", value: "Active" },
        { label: "Expired", value: "Expired" },
        { label: "Claimed", value: "Claimed" },
      ],
    },
    {
      title: "Store",
      filterKey: "storeName",
      options: Array.from(
        new Set(warrantyData.warranties.map((w) => w.storeName))
      )
        .filter(Boolean)
        .map((store) => ({ label: store, value: store })),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Warranty Tracker</h1>
          <p className="text-muted-foreground mt-1">
            You have {activeWarranties} active{" "}
            {activeWarranties === 1 ? "warranty" : "warranties"}
          </p>
        </div>
      </div>

      {warrantyData.warranties.length > 0 ? (
        <DataTable
          columns={columns}
          data={warrantyData.warranties}
          searchColumn={["productName", "storeName"]}
          searchPlaceholder="Search by product or store"
          seperateFilters
          filters={warrantyFilters}
        />
      ) : (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-gray-500">
            No warranty information found. Products with warranty will appear
            here after purchase.
          </p>
        </div>
      )}
    </div>
  );
}
