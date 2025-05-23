"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { formatPrice } from "@workspace/ui/lib/utils";
import { ChevronDown, ChevronUp, Clock, Banknote } from "lucide-react";
import { format } from "date-fns";

// Types for our data
type Wallet = {
  id: string;
  shopName: string;
  balance: number;
  logoUrl?: string;
  lastTransaction?: string;
};

type Transaction = {
  id: string;
  shopId: string;
  shopName: string;
  date: string;
  amount: number;
  description: string;
  type: "credit" | "debit" | "refund";
  reference?: string;
};

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

type WalletsClientProps = {
  walletData: {
    shops: ShopData[];
    error: string | null;
  };
};

export default function WalletsClient({ walletData }: WalletsClientProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  // Process shop data into wallets
  const wallets: Wallet[] = [];
  const transactions: Transaction[] = [];

  // Process shops data
  walletData.shops.forEach((shop) => {
    if (shop.orderHistory && shop.orderHistory.wallet) {
      const wallet = shop.orderHistory.wallet;

      // Add wallet
      wallets.push({
        id: shop.shopId,
        shopName: shop.shopName,
        balance: wallet.balance || 0,
        logoUrl: shop.shopLogo || undefined,
        lastTransaction: wallet.updatedAt,
      });

      // Process transactions if available
      if (wallet.transactions && Array.isArray(wallet.transactions)) {
        wallet.transactions.forEach((tx) => {
          transactions.push({
            id: tx.id,
            shopId: shop.shopId,
            shopName: shop.shopName,
            date: tx.createdAt,
            amount: tx.amount,
            description:
              tx.description || getDefaultDescription(tx.type, tx.amount),
            type: getTransactionType(tx.type, tx.amount),
            reference: tx.reference || tx.id.substring(0, 8),
          });
        });
      }
    }
  });

  // Helper function to determine transaction type
  function getTransactionType(
    type: string,
    amount: number
  ): "credit" | "debit" | "refund" {
    if (type === "REFUND") return "refund";
    return amount >= 0 ? "credit" : "debit";
  }

  // Helper function to generate description if none is provided
  function getDefaultDescription(type: string, amount: number): string {
    if (type === "REFUND") return "Refund processed";
    if (amount >= 0) return "Credit added to account";
    return "Payment deducted from account";
  }

  // Calculate total balance across all wallets
  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

  // Get all transactions or filter by shop
  const filteredTransactions =
    activeTab === "all"
      ? transactions
      : transactions.filter((t) => t.shopId === activeTab);

  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Error state
  if (walletData.error) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Shop Wallets</h1>
          <p className="text-red-500 mt-1">Error: {walletData.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Shop Wallets</h1>
        <p className="text-muted-foreground mt-1">
          View your store credits and balances
        </p>
      </div>

      {wallets.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-gray-500">
            No wallet data available. Start shopping to create a wallet balance.
          </p>
        </div>
      ) : (
        <>
          {/* Wallet Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wallets.map((wallet) => (
              <Card
                key={wallet.id}
                className={`${wallet.balance < 0 ? "border-red-200" : ""} cursor-pointer`}
                onClick={() => setActiveTab(wallet.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center">
                    {wallet.logoUrl ? (
                      <img
                        src={wallet.logoUrl}
                        alt={`${wallet.shopName} logo`}
                        className="w-6 h-6 rounded-full mr-2 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-200 mr-2 flex-shrink-0" />
                    )}
                    {wallet.shopName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {wallet.balance > 0 ? (
                        <ChevronUp className="h-4 w-4 text-green-500" />
                      ) : wallet.balance < 0 ? (
                        <ChevronDown className="h-4 w-4 text-red-500" />
                      ) : (
                        <span className="h-4 w-4" />
                      )}
                      <span
                        className={`text-lg font-bold ${
                          wallet.balance > 0
                            ? "text-green-600"
                            : wallet.balance < 0
                              ? "text-red-600"
                              : ""
                        }`}
                      >
                        {formatPrice(wallet.balance)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Clock className="h-3 w-3" />
                      {wallet.lastTransaction ? (
                        <span>
                          {format(
                            new Date(wallet.lastTransaction),
                            "MMM d, yyyy"
                          )}
                        </span>
                      ) : (
                        <span>No activity</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

         
        </>
      )}
    </div>
  );
}
