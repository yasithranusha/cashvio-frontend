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

// Mock data for wallets with adjusted balances
const wallets: Wallet[] = [
  {
    id: "wal_1",
    shopName: "Electronics Hub",
    balance: 45,
    logoUrl: "https://placehold.co/30",
    lastTransaction: "2025-04-28",
  },
  {
    id: "wal_2",
    shopName: "Fashion Store",
    balance: -15, // Negative balance
    logoUrl: "https://placehold.co/30",
    lastTransaction: "2025-04-15",
  },
  {
    id: "wal_3",
    shopName: "Home Essentials",
    balance: 2830, // Updated to account for the 2800 refund
    logoUrl: "https://placehold.co/30",
    lastTransaction: "2025-05-01",
  },
  {
    id: "wal_4",
    shopName: "Tech Gadgets",
    balance: 0,
    logoUrl: "https://placehold.co/30",
    lastTransaction: "2025-03-22",
  },
  {
    id: "wal_5",
    shopName: "Furniture Palace",
    balance: -35, // Negative balance
    logoUrl: "https://placehold.co/30",
    lastTransaction: "2025-04-10",
  },
];

// Mock data for transactions with adjusted amounts
const transactions: Transaction[] = [
  {
    id: "trx_101",
    shopId: "wal_1",
    shopName: "Electronics Hub",
    date: "2025-04-28",
    amount: 15,
    description: "Store credit for product return",
    type: "credit",
    reference: "RET25042801",
  },
  {
    id: "trx_102",
    shopId: "wal_1",
    shopName: "Electronics Hub",
    date: "2025-04-25",
    amount: 30,
    description: "Initial deposit for preorder",
    type: "credit",
    reference: "PRE25042501",
  },
  {
    id: "trx_103",
    shopId: "wal_2",
    shopName: "Fashion Store",
    date: "2025-04-15",
    amount: -15,
    description: "Purchase balance due",
    type: "debit",
    reference: "INV2025002",
  },
  {
    id: "trx_104",
    shopId: "wal_3",
    shopName: "Home Essentials",
    date: "2025-05-01",
    amount: 2800, // Keeping refund as original value
    description: "Refund for damaged product",
    type: "refund",
    reference: "RF25050101",
  },
  {
    id: "trx_105",
    shopId: "wal_5",
    shopName: "Furniture Palace",
    date: "2025-04-10",
    amount: -35,
    description: "Remaining payment for sofa",
    type: "debit",
    reference: "INV2025019",
  },
  {
    id: "trx_106",
    shopId: "wal_3",
    shopName: "Home Essentials",
    date: "2025-04-22",
    amount: -12,
    description: "Purchase of kitchen appliances",
    type: "debit",
    reference: "INV2025022",
  },
  {
    id: "trx_107",
    shopId: "wal_3",
    shopName: "Home Essentials",
    date: "2025-04-15",
    amount: 42,
    description: "Store credit for loyalty program",
    type: "credit",
    reference: "LOY25041501",
  },
  {
    id: "trx_108",
    shopId: "wal_4",
    shopName: "Tech Gadgets",
    date: "2025-03-22",
    amount: -50,
    description: "Purchase of smartphone",
    type: "debit",
    reference: "INV2025004",
  },
  {
    id: "trx_109",
    shopId: "wal_4",
    shopName: "Tech Gadgets",
    date: "2025-03-20",
    amount: 50,
    description: "Deposit for smartphone",
    type: "credit",
    reference: "DEP25032001",
  },
];

export default function WalletsPage() {
  const [activeTab, setActiveTab] = useState<string>("all");

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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Shop Wallets</h1>
        <p className="text-muted-foreground mt-1">
          View your store credits and balances
        </p>
      </div>

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
                <div className="w-6 h-6 rounded-full bg-gray-200 mr-2 flex-shrink-0" />
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
                      {format(new Date(wallet.lastTransaction), "MMM d, yyyy")}
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

      {/* Transactions */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Transaction History</h2>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Shops</TabsTrigger>
            {wallets.map((wallet) => (
              <TabsTrigger key={wallet.id} value={wallet.id}>
                {wallet.shopName}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Shop</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTransactions.length > 0 ? (
                      sortedTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            {format(new Date(transaction.date), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-5 h-5 rounded-full bg-gray-200 mr-2" />
                              {transaction.shopName}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center">
                              {transaction.type === "credit" && (
                                <Banknote className="h-3 w-3 mr-1 text-green-500" />
                              )}
                              {transaction.type === "refund" && (
                                <Banknote className="h-3 w-3 mr-1 text-blue-500" />
                              )}
                              {transaction.description}
                            </span>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {transaction.reference}
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${
                              transaction.amount > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.amount > 0 ? "+" : ""}
                            {formatPrice(transaction.amount)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-6 text-muted-foreground"
                        >
                          No transactions found for this shop.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
