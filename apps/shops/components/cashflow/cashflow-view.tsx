"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  AlertCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  CreditCard,
  DollarSign,
  PlusCircle,
  Repeat,
  Target,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { Progress } from "@workspace/ui/components/progress";
import { Switch } from "@workspace/ui/components/switch";
import { Separator } from "@workspace/ui/components/separator";
import { Badge } from "@workspace/ui/components/badge";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { format } from "date-fns";

// Mock data
const mockIncome = [
  { id: 1, description: "In-Store Sales", amount: 45000, date: "2025-05-01" },
  { id: 5, description: "In-Store Sales", amount: 35000, date: "2025-05-01" },
  { id: 6, description: "In-Store Sales", amount: 5000, date: "2025-05-01" },
  { id: 7, description: "Service Fees", amount: 8500, date: "2025-05-03" },
  { id: 4, description: "Delivery Charges", amount: 3200, date: "2025-05-05" },
];

const mockExpenses = [
  { id: 1, description: "Shop Rent", amount: 25000, date: "2025-05-05" },
  {
    id: 2,
    description: "Electricity & Water",
    amount: 8500,
    date: "2025-05-08",
  },
  { id: 3, description: "Stock Purchase", amount: 35000, date: "2025-05-10" },
  { id: 4, description: "Staff Wages", amount: 42000, date: "2025-05-15" },
  { id: 5, description: "Facebook Ads", amount: 6500, date: "2025-05-20" },
];

const mockRecurringPayments = [
  {
    id: 1,
    description: "Shop Rent",
    amount: 25000,
    frequency: "Monthly",
    nextDate: "2025-06-05",
  },
  {
    id: 2,
    description: "Internet",
    amount: 3500,
    frequency: "Monthly",
    nextDate: "2025-06-10",
  },
  {
    id: 3,
    description: "Insurance",
    amount: 4500,
    frequency: "Monthly",
    nextDate: "2025-06-15",
  },
  {
    id: 4,
    description: "POS System Fee",
    amount: 2000,
    frequency: "Monthly",
    nextDate: "2025-06-20",
  },
];

const mockUpcomingPayments = [
  {
    id: 1,
    description: "Staff Wages",
    amount: 42000,
    dueDate: "2025-05-15",
    type: "recurring",
    isPriority: true,
  },
  {
    id: 2,
    description: "Supplier Invoice #1234",
    amount: 18000,
    dueDate: "2025-05-18",
    type: "one-time",
    isPriority: false,
  },
  {
    id: 3,
    description: "VAT Payment",
    amount: 12500,
    dueDate: "2025-05-20",
    type: "one-time",
    isPriority: true,
  },
  {
    id: 4,
    description: "Equipment Rental",
    amount: 7500,
    dueDate: "2025-05-22",
    type: "recurring",
    isPriority: false,
  },
];

export default function CashflowView() {
  const [showLargePaymentAlert, setShowLargePaymentAlert] = useState(false);
  const [newPaymentAmount, setNewPaymentAmount] = useState("");
  const [cashOnHand, setCashOnHand] = useState(25000);

  // Total income, expenses, and balance
  const totalIncome = mockIncome.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = mockExpenses.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const currentBalance = cashOnHand;
  const projectedBalance =
    currentBalance -
    mockUpcomingPayments.reduce((sum, item) => sum + item.amount, 0);

  // Daily goals calculation
  const totalUpcoming = mockUpcomingPayments.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const daysUntilLastPayment = 22; // Days until the furthest payment date
  const dailyTarget = totalUpcoming / daysUntilLastPayment;
  const dailyProgress = 50; // Mock progress percentage

  const handleSubmitNewPayment = () => {
    const paymentAmount = parseFloat(newPaymentAmount);

    // Check if the payment amount is too large
    if (paymentAmount > currentBalance * 0.7) {
      setShowLargePaymentAlert(true);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "lkr",
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Cash Flow Management
          </h1>
          <p className="text-muted-foreground">
            Monitor your business cash flow, upcoming payments, and financial
            goals
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
                <DialogDescription>
                  Record a new income or expense transaction
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="transaction-type" className="text-right">
                    Type
                  </Label>
                  <Select defaultValue="income">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    placeholder="Enter description"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="col-span-3"
                    value={newPaymentAmount}
                    onChange={(e) => setNewPaymentAmount(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    defaultValue={format(new Date(), "yyyy-MM-dd")}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="recurring" className="text-right">
                    Recurring
                  </Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch id="recurring" />
                    <Label htmlFor="recurring">
                      This is a recurring transaction
                    </Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleSubmitNewPayment}>
                  Save Transaction
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Show large payment alert if needed */}
      {showLargePaymentAlert && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Warning: Large Payment Amount</AlertTitle>
          <AlertDescription>
            This payment amount is over 70% of your current cash on hand and may
            impact your ability to meet other financial obligations.
          </AlertDescription>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => setShowLargePaymentAlert(false)}
          >
            Dismiss
          </Button>
        </Alert>
      )}

      {/* Cash Flow Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Cash Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(currentBalance)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Available for operational expenses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Income (This Month)
            </CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +{((totalIncome / 20000) * 100).toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses (This Month)
            </CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              -{((totalExpenses / 25000) * 100).toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Projected Balance
            </CardTitle>
            <AlertTriangle
              className={`h-4 w-4 ${projectedBalance < 0 ? "text-rose-500" : "text-muted-foreground"}`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${projectedBalance < 0 ? "text-rose-600" : ""}`}
            >
              {formatCurrency(projectedBalance)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              After all upcoming payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Goal Tracker */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Daily Cash Flow Goal
          </CardTitle>
          <CardDescription>
            Track your progress toward meeting upcoming payment obligations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium">Daily Target</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(dailyTarget)}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Today's Progress</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(dailyTarget * (dailyProgress / 100))}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Remaining</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    dailyTarget - dailyTarget * (dailyProgress / 100)
                  )}
                </div>
              </div>
            </div>
            <Progress value={dailyProgress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <div>{dailyProgress}% Complete</div>
              <div>Daily Goal: {formatCurrency(dailyTarget)}</div>
            </div>

            <div className="flex items-center justify-center mt-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Next payment due in 10 days</span>
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          {/* Cash Flow Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all" className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4" />
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <PlusCircle className="mr-2 h-3 w-3" />
                    Add New
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Transaction</DialogTitle>
                  </DialogHeader>
                  {/* Form content would go here */}
                </DialogContent>
              </Dialog>
            </div>

            {/* New "All Transactions" tab that combines both income and expenses */}
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
                      {/* Combine and sort both income and expenses by date */}
                      {[
                        ...mockIncome.map((item) => ({
                          ...item,
                          type: "income",
                        })),
                        ...mockExpenses.map((item) => ({
                          ...item,
                          type: "expense",
                        })),
                      ]
                        .sort(
                          (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                        )
                        .map((item) => (
                          <div
                            key={`${item.type}-${item.id}`}
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
                        ))}
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
                      {mockIncome.map((item) => (
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
                      ))}
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
                      {mockExpenses.map((item) => (
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
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Recurring Payments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Repeat className="mr-2 h-5 w-5" />
                  Recurring Payments
                </CardTitle>
                <CardDescription>
                  Manage your scheduled recurring payments
                </CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Recurring Payment</DialogTitle>
                  </DialogHeader>
                  {/* Form content would go here */}
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecurringPayments.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-3"
                  >
                    <div>
                      <p className="font-medium">{item.description}</p>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="mr-2 text-xs">
                          {item.frequency}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          Next: {item.nextDate}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(item.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Payments Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Upcoming Payments
              </CardTitle>
              <CardDescription>
                Scheduled payments due in the next 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {mockUpcomingPayments.map((payment) => (
                    <div key={payment.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium flex items-center">
                            {payment.description}
                            {payment.isPriority && (
                              <AlertCircle className="h-4 w-4 text-amber-500 ml-2" />
                            )}
                          </h4>
                          <div className="flex items-center mt-1 space-x-2">
                            <Badge
                              variant={
                                payment.type === "recurring"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {payment.type === "recurring" ? (
                                <Repeat className="h-3 w-3 mr-1" />
                              ) : (
                                <CreditCard className="h-3 w-3 mr-1" />
                              )}
                              {payment.type === "recurring"
                                ? "Recurring"
                                : "One-time"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Due: {payment.dueDate}
                            </span>
                          </div>
                        </div>
                        <span className="font-bold">
                          {formatCurrency(payment.amount)}
                        </span>
                      </div>
                      <div className="mt-2 flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Pay Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="mt-4">
                <Separator className="my-4" />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Upcoming</span>
                  <span className="font-bold">
                    {formatCurrency(totalUpcoming)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add New Payment Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PlusCircle className="h-5 w-5 mr-2" />
                Add Payment
              </CardTitle>
              <CardDescription>
                Schedule a new payment or expense
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-description">Description</Label>
                  <Input
                    id="payment-description"
                    placeholder="Enter payment description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-amount">Amount</Label>
                  <Input
                    id="payment-amount"
                    type="number"
                    placeholder="0.00"
                    value={newPaymentAmount}
                    onChange={(e) => setNewPaymentAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-date">Due Date</Label>
                  <Input id="payment-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-type">Payment Type</Label>
                  <Select defaultValue="one-time">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-time">One-time Payment</SelectItem>
                      <SelectItem value="recurring">
                        Recurring Payment
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="priority" />
                  <Label htmlFor="priority">Mark as priority payment</Label>
                </div>
                <Button className="w-full" onClick={handleSubmitNewPayment}>
                  Schedule Payment
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
