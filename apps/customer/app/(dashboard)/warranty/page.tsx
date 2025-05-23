import { getSession } from "@/lib/session";
import { getCustomerOrderHistoryWithWallet } from "@/actions/order";
import WarrantyClient from "@/components/warrenty/warranty-client";
import { addMonths } from "date-fns";
import { Warranty } from "@/components/warrenty/warrenty-columns";

// Type for the shop data coming from the API
type ShopData = {
  shopId: string;
  shopName: string;
  shopLogo: string | null;
  orderHistory: {
    orders: any[];
  };
};

type WarrantyDataResponse = {
  warranties: Warranty[];
  error: string | null;
};

export default async function WarrantyPage() {
  // Get the customer ID from session
  const session = await getSession();
  const customerId = session?.user.id;

  // Log session info for debugging
  console.log("Warranty Session info:", {
    hasSession: !!session,
    customerId: customerId || "undefined",
  });

  // Fetch order history data - this contains products with warranty info
  const response = await getCustomerOrderHistoryWithWallet(customerId);

  // Log response for debugging
  console.log("API Response Structure for Warranty:", {
    success: response.success,
    hasData: !!response.data,
    hasError: !!response.error,
    dataKeys: response.data ? Object.keys(response.data) : [],
  });

  // Initialize warranty data
  const warrantyData: WarrantyDataResponse = {
    warranties: [],
    error: null,
  };

  if (!response.success) {
    warrantyData.error = response.error || "Failed to fetch warranty data";
  } else if (response.data && response.data.shopData) {
    // Process order data from all shops to extract warranty information
    const warranties: Warranty[] = [];

    // Check if we have shop data
    if (Array.isArray(response.data.shopData)) {
      response.data.shopData.forEach((shop) => {
        if (shop.orderHistory && Array.isArray(shop.orderHistory.orders)) {
          // Process each order
          shop.orderHistory.orders.forEach((order) => {
            // Process each order item
            if (order.orderItems && Array.isArray(order.orderItems)) {
              order.orderItems.forEach((item) => {
                // If there's warranty info on the product, create a warranty entry
                if (item.product && item.product.warrantyMonths) {
                  const purchaseDate = new Date(order.createdAt);
                  const expiryDate = addMonths(
                    purchaseDate,
                    item.product.warrantyMonths
                  );

                  // Calculate warranty status
                  const now = new Date();
                  let status: "Active" | "Expired" | "Claimed" = "Active";
                  if (now > expiryDate) {
                    status = "Expired";
                  }

                  // Ensure numeric values for price
                  const price =
                    typeof item.sellingPrice === "string"
                      ? parseFloat(item.sellingPrice)
                      : item.sellingPrice || 0;

                  warranties.push({
                    id: `WAR-${item.id.substring(0, 8)}`,
                    productName:
                      item.product.name ||
                      item.product.displayName ||
                      "Product",
                    purchaseDate: order.createdAt,
                    expiryDate: expiryDate.toISOString(),
                    storeName: shop.shopName,
                    warrantyPeriod: item.product.warrantyMonths,
                    purchaseAmount: price,
                    status: status,
                    orderReference: order.orderNumber || order.id,
                  });
                }
              });
            }
          });
        }
      });

      warrantyData.warranties = warranties;
    }
  }

  return <WarrantyClient warrantyData={warrantyData} />;
}
