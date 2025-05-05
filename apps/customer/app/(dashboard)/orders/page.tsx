import { DataTable } from "@workspace/ui/components/datatable/datatable";
import { columns } from "@/components/order/order-column";

// Import the Order type from order-column.tsx for consistency
import { Order } from "@/components/order/order-column";

// Generate dummy order data with realistic values
const orders: Order[] = [
  {
    id: "INV2025001",
    date: "2025-05-01",
    storeName: "Electronics Hub",
    amount: 4800,
    items: 2,
    status: "Completed",
  },
  {
    id: "INV2025002",
    date: "2025-04-23",
    storeName: "Fashion Store",
    amount: 2100,
    items: 3,
    status: "Completed",
  },
  {
    id: "INV2025003",
    date: "2025-04-15",
    storeName: "Home Essentials",
    amount: 3450,
    items: 1,
    status: "Pending",
  },
  {
    id: "INV2025004",
    date: "2025-04-10",
    storeName: "Tech Gadgets",
    amount: 8750,
    items: 4,
    status: "Processing",
  },
  {
    id: "INV2025005",
    date: "2025-03-28",
    storeName: "Electronics Hub",
    amount: 1200,
    items: 1,
    status: "Completed",
  },
  {
    id: "INV2025006",
    date: "2025-03-15",
    storeName: "Furniture Palace",
    amount: 6200,
    items: 2,
    status: "Refunded",
  },
  {
    id: "INV2025007",
    date: "2025-03-02",
    storeName: "Fashion Store",
    amount: 2300,
    items: 5,
    status: "Completed",
  },
  {
    id: "INV2025008",
    date: "2025-02-18",
    storeName: "Home Essentials",
    amount: 1500,
    items: 3,
    status: "Completed",
  },
  {
    id: "INV2025009",
    date: "2025-02-10",
    storeName: "Tech Gadgets",
    amount: 5600,
    items: 2,
    status: "Partially Refunded",
  },
  {
    id: "INV2025010",
    date: "2025-01-25",
    storeName: "Furniture Palace",
    amount: 4200,
    items: 1,
    status: "Completed",
  },
];

// Define the filters that will appear in the DataTable
const orderFilters = [
  {
    title: "Status",
    filterKey: "status",
    options: [
      { label: "Completed", value: "Completed" },
      { label: "Pending", value: "Pending" },
      { label: "Processing", value: "Processing" },
      { label: "Refunded", value: "Refunded" },
      { label: "Partially Refunded", value: "Partially Refunded" },
    ],
  },
  {
    title: "Store",
    filterKey: "storeName",
    options: [
      { label: "Electronics Hub", value: "Electronics Hub" },
      { label: "Fashion Store", value: "Fashion Store" },
      { label: "Home Essentials", value: "Home Essentials" },
      { label: "Tech Gadgets", value: "Tech Gadgets" },
      { label: "Furniture Palace", value: "Furniture Palace" },
    ],
  },
];

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order History</h1>
      </div>
      
      <DataTable 
        columns={columns}
        data={orders}
        searchColumn={["id", "storeName"]}
        searchPlaceholder="Search by order ID or store name"
        seperateFilters
        filters={orderFilters}
      />
    </div>
  );
}