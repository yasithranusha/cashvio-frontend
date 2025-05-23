import { DataTable } from "@workspace/ui/components/datatable/datatable";
import { columns } from "@/components/order/order-column";
import { getSession } from "@/lib/session";
import { getCustomerOrderHistoryWithWallet } from "@/actions/order";
import { Order } from "@/components/order/order-column";
import { format } from "date-fns";

export default async function OrdersPage() {
  const session = await getSession();
  const customerId = session?.user.id;

  // Log session and customerId for debugging
  console.log("Session info:", {
    hasSession: !!session,
    customerId: customerId || "undefined",
  });

  // Fetch real order data
  const orderResponse = await getCustomerOrderHistoryWithWallet(customerId);

  // More detailed logging of the response
  console.log("API Full Response:", JSON.stringify(orderResponse, null, 2));
  console.log("API Response Structure:", {
    success: orderResponse.success,
    hasData: !!orderResponse.data,
    hasError: !!orderResponse.error,
    errorMessage: orderResponse.error || "No error",
    dataKeys: orderResponse.data ? Object.keys(orderResponse.data) : [],
  });

  // Initialize orders array
  let orders: Order[] = [];

  // Check if shopData exists and has content
  if (
    orderResponse.data &&
    orderResponse.data.shopData &&
    Array.isArray(orderResponse.data.shopData)
  ) {
    console.log("Shop data count:", orderResponse.data.shopData.length);
    console.log(
      "First shop data:",
      orderResponse.data.shopData[0] || "No shops"
    );

    // Process data if request was successful
    if (orderResponse.success) {
      // Flatten orders from all shops
      orders = orderResponse.data.shopData.flatMap((shop) => {
        // Make sure shop has orderHistory and orders
        if (!shop.orderHistory || !Array.isArray(shop.orderHistory.orders)) {
          console.log("Shop missing orderHistory or orders:", shop.shopName);
          return [];
        }

        return shop.orderHistory.orders.map((order) => ({
          id: order.orderNumber || order.id,
          date: order.createdAt,
          storeName: shop.shopName,
          amount: order.total,
          items: order.orderItems?.length || 0,
          status:
            (order.status as
              | "Completed"
              | "Pending"
              | "Processing"
              | "Refunded"
              | "Partially Refunded") || "Processing",
        }));
      });

      console.log("Processed orders count:", orders.length);
    }
  } else {
    // If API returns unexpected data, use an empty array
    console.error(
      "API error or unexpected data structure:",
      JSON.stringify(orderResponse)
    );

    // Check if backend URL is configured correctly
    console.log("Check if endpoint URL is correct:", {
      customerId,
      hasErrorResponse: !!orderResponse.error,
    });

    // For testing, add some mock data if there's no real data
    if (customerId) {
      console.log("Adding mock data for testing UI");
      orders = [
        {
          id: "TEST-ORDER-001",
          date: new Date().toISOString(),
          storeName: "Test Store",
          amount: 1000,
          items: 2,
          status: "Processing",
        },
      ];
    }
  }

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
      options: Array.from(new Set(orders.map((order) => order.storeName)))
        .filter(Boolean) // Remove undefined/null values
        .map((storeName) => ({ label: storeName, value: storeName })),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order History</h1>
      </div>

      {orders.length > 0 ? (
        <DataTable
          columns={columns}
          data={orders}
          searchColumn={["id", "storeName"]}
          searchPlaceholder="Search by order ID or store name"
          seperateFilters
          filters={orderFilters}
        />
      ) : (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-gray-500">
            No orders found.{" "}
            {orderResponse.error ? `Error: ${orderResponse.error}` : ""}
          </p>
        </div>
      )}
    </div>
  );
}
