import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  DollarSign,
  PlusCircle,
} from "lucide-react";
import { TransactionCollection, Transaction } from "@/types/cashflow";
import { AddTransactionDialog } from "@/components/cashflow/dialog/add-transaction-dialog";

interface TransactionTabsProps {
  transactions?: TransactionCollection;
  formatCurrency: (amount: number) => string;
  shopId: string;
}

export function TransactionTabs({
  transactions,
  formatCurrency,
  shopId,
}: TransactionTabsProps) {
  // Use real transactions or empty array as fallback
  const recentTransactions = transactions?.recent || [];
  // Format transactions for display with updated income/expense categorization logic
  const displayTransactions = recentTransactions.map((transaction) => ({
    id: transaction.id,
    description: transaction.description,
    amount: parseFloat(transaction.amount),
    date: transaction.date,
    // Income:
    // - If type is DUE_PAYMENT
    // - If type is ORDER_PAYMENT and description contains "Order #ORD-"
    // Expenses: All other transactions
    type:
      transaction.type === "DUE_PAYMENT" ||
      (transaction.type === "ORDER_PAYMENT" &&
        transaction.description.includes("Order #ORD-"))
        ? "income"
        : "expense",
  }));

  return (
    <Tabs defaultValue="all" className="w-full">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="all" className="flex items-center">
            <DollarSign className="mr-2 h-4 w-full" />
            All Transactions
          </TabsTrigger>
          <TabsTrigger value="income" className="flex items-center">
            <ArrowUpCircle className="mr-2 h-4 w-4 text-emerald-500" />
            Income
          </TabsTrigger>
          <TabsTrigger value="expenses" className="flex items-center">
            <ArrowDownCircle className="mr-2 h-4 w-4 text-rose-500" />
            Expenses
          </TabsTrigger>
        </TabsList>
      </div>

      {/* All Transactions tab */}
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>All Financial Transactions</CardTitle>
            <CardDescription>
              View all income and expense transactions in a single list
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[320px]">
              <div className="space-y-4">
                {/* Display all transactions */}
                {displayTransactions.length > 0 ? (
                  displayTransactions
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 border-b"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`${item.type === "income" ? "bg-emerald-100" : "bg-rose-100"} p-2 rounded-full`}
                          >
                            {item.type === "income" ? (
                              <ArrowUpCircle className="h-5 w-5 text-emerald-600" />
                            ) : (
                              <ArrowDownCircle className="h-5 w-5 text-rose-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {item.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.date}
                            </p>
                          </div>
                        </div>
                        <p
                          className={`font-medium ${item.type === "income" ? "text-emerald-600" : "text-rose-600"}`}
                        >
                          {item.type === "income" ? "+" : "-"}
                          {formatCurrency(item.amount)}
                        </p>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No transactions found
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="income">
        <Card>
          <CardHeader>
            <CardTitle>Incoming Funds</CardTitle>
            <CardDescription>
              Track all sources of income for your business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[280px]">
              <div className="space-y-4">
                {displayTransactions.filter((item) => item.type === "income")
                  .length > 0 ? (
                  displayTransactions
                    .filter((item) => item.type === "income")
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 border-b"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-emerald-100 p-2 rounded-full">
                            <ArrowUpCircle className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {item.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.date}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium text-emerald-600">
                          +{formatCurrency(item.amount)}
                        </p>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No income transactions found
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="expenses">
        <Card>
          <CardHeader>
            <CardTitle>Expense Tracking</CardTitle>
            <CardDescription>
              Monitor all business expenses and outgoing payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[280px]">
              <div className="space-y-4">
                {displayTransactions.filter((item) => item.type === "expense")
                  .length > 0 ? (
                  displayTransactions
                    .filter((item) => item.type === "expense")
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 border-b"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-rose-100 p-2 rounded-full">
                            <ArrowDownCircle className="h-5 w-5 text-rose-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {item.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.date}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium text-rose-600">
                          -{formatCurrency(item.amount)}
                        </p>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No expense transactions found
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
