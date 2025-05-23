import { getSession } from "@/lib/session";
import { getCustomerOrderHistoryWithWallet } from "@/actions/order";
import WalletsClient from "@/components/wallet/wallets-client";

// Type for the shop data coming from the API
type ShopData = {
  shopId: string;
  shopName: string;
  shopLogo: string | null;
  orderHistory: {
    wallet: {
      customerId: string;
      shopId: string;
      balance: number;
      loyaltyPoints: number;
      createdAt: string;
      updatedAt: string;
      transactions: any[];
    };
    orders: any[];
  };
};

type WalletDataResponse = {
  shops: ShopData[];
  error: string | null;
};

export default async function WalletsPage() {
  // Get the customer ID from session
  const session = await getSession();
  const customerId = session?.user.id;

  // Log session info for debugging
  console.log("Session info:", {
    hasSession: !!session,
    customerId: customerId || "undefined",
  });

  // Fetch wallet data directly from server component
  const response = await getCustomerOrderHistoryWithWallet(customerId);

  // Log response for debugging
  console.log("API Response Structure:", {
    success: response.success,
    hasData: !!response.data,
    hasError: !!response.error,
    dataKeys: response.data ? Object.keys(response.data) : [],
  });

  // Initialize wallet data
  const walletData: WalletDataResponse = {
    shops: [],
    error: null,
  };

  if (!response.success) {
    walletData.error = response.error || "Failed to fetch wallet data";
  } else if (response.data && response.data.shopData) {
    walletData.shops = response.data.shopData;
  }

  return <WalletsClient walletData={walletData} />;
}
