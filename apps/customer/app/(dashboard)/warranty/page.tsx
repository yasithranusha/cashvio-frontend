import { DataTable } from "@workspace/ui/components/datatable/datatable";
import { columns, Warranty } from "@/components/warrenty/warrenty-columns";
import { Button } from "@workspace/ui/components/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { addMonths } from "date-fns";

// Helper function to create date that's a certain number of months from today
const monthsFromNow = (months: number) => {
  return addMonths(new Date(), months).toISOString();
};

// Generate dummy warranty data
const warranties: Warranty[] = [
  {
    id: "WAR2025001",
    productName: "Samsung 55\" OLED TV",
    purchaseDate: "2025-01-15",
    expiryDate: "2027-01-15", // 24 months warranty
    storeName: "Electronics Hub",
    warrantyPeriod: 24,
    purchaseAmount: 45000,
    status: "Active",
    orderReference: "INV2025001",
  },
  {
    id: "WAR2025002",
    productName: "Apple MacBook Pro 14\"",
    purchaseDate: "2024-11-20",
    expiryDate: "2025-11-20", // 12 months warranty
    storeName: "Tech Gadgets",
    warrantyPeriod: 12,
    purchaseAmount: 95000,
    status: "Active",
    orderReference: "INV2024015",
  },
  {
    id: "WAR2025003",
    productName: "Dyson V15 Vacuum",
    purchaseDate: "2024-09-05",
    expiryDate: monthsFromNow(-1), // Expired 1 month ago
    storeName: "Home Essentials",
    warrantyPeriod: 6,
    purchaseAmount: 28000,
    status: "Expired",
    orderReference: "INV2024008",
  },
  {
    id: "WAR2025004",
    productName: "Sony WH-1000XM5 Headphones",
    purchaseDate: "2025-03-10",
    expiryDate: monthsFromNow(0.5), // Expiring in 2 weeks
    storeName: "Electronics Hub",
    warrantyPeriod: 6,
    purchaseAmount: 12000,
    status: "Active",
    orderReference: "INV2025005",
  },
  {
    id: "WAR2025005",
    productName: "LG Refrigerator",
    purchaseDate: "2024-12-05",
    expiryDate: "2026-12-05", // 24 months warranty
    storeName: "Home Essentials",
    warrantyPeriod: 24,
    purchaseAmount: 56000,
    status: "Active",
    orderReference: "INV2024020",
  },
  {
    id: "WAR2025006",
    productName: "Bose SoundBar 700",
    purchaseDate: "2023-06-15",
    expiryDate: "2024-06-15", // 12 months warranty
    storeName: "Electronics Hub",
    warrantyPeriod: 12,
    purchaseAmount: 32000,
    status: "Expired",
    orderReference: "INV2023045",
  },
  {
    id: "WAR2025007",
    productName: "iPhone 17 Pro",
    purchaseDate: "2025-02-25",
    expiryDate: "2026-02-25", // 12 months warranty
    storeName: "Tech Gadgets",
    warrantyPeriod: 12,
    purchaseAmount: 89000,
    status: "Claimed",
    orderReference: "INV2025003",
  },
];

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
    options: [
      { label: "Electronics Hub", value: "Electronics Hub" },
      { label: "Tech Gadgets", value: "Tech Gadgets" },
      { label: "Home Essentials", value: "Home Essentials" },
    ],
  },
  {
    title: "Warranty Period",
    filterKey: "warrantyPeriod",
    options: [
      // Convert number values to strings
      { label: "6 Months", value: "6" },
      { label: "12 Months", value: "12" },
      { label: "24 Months", value: "24" },
    ],
  }
];

export default function WarrantyPage() {
  // Count active warranties
  const activeWarranties = warranties.filter(w => w.status === "Active").length;
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Warranty Tracker</h1>
          <p className="text-muted-foreground mt-1">
            You have {activeWarranties} active {activeWarranties === 1 ? 'warranty' : 'warranties'}
          </p>
        </div>
        
      </div>
      
      <DataTable 
        columns={columns}
        data={warranties}
        searchColumn={["productName", "storeName"]}
        searchPlaceholder="Search by product or store"
        seperateFilters
        filters={warrantyFilters}
      />
    </div>
  );
}