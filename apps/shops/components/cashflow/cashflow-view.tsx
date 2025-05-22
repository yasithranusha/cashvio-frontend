"use client";

import { useState } from "react";
import {
  AlertCircle,
  Calendar,
  PlusCircle,
  Repeat,
  CheckCircle,
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
import { Switch } from "@workspace/ui/components/switch";
import { format } from "date-fns";
import { CashflowData, ShopBalance } from "@/types/cashflow";
import { CustomerDuesResponse } from "@/types/customer-dues";
import { UpcomingPaymentsResponse } from "@/types/upcoming-payments";

import { CashflowSummary } from "@/components/cashflow/cashflow-summary";
import { DailyGoalTracker } from "@/components/cashflow/daily-goal-tracker";
import { TransactionTabs } from "@/components/cashflow/transaction-tabs";
import { RecurringPayments } from "@/components/cashflow/recurring-payments";
import { UpcomingPaymentsComponent } from "@/components/cashflow/upcoming-payments";
import { RecurringPaymentDialog } from "@/components/cashflow/dialog/recurring-payment-dialog";
import { ProcessedPayments } from "@/components/cashflow/processed-payments";
import { BalanceBreakdown } from "@/components/cashflow/balance-breakdown";

interface CashflowViewProps {
  cashflowData: CashflowData;
  customerDues: CustomerDuesResponse;
  upcomingPayments: UpcomingPaymentsResponse;
  shopBalance: ShopBalance;
  shopId: string;
}

export default function CashflowView({
  cashflowData,
  customerDues,
  upcomingPayments,
  shopBalance,
  shopId,
}: CashflowViewProps) {
  const [showLargePaymentAlert, setShowLargePaymentAlert] = useState(false);
  const [newPaymentAmount, setNewPaymentAmount] = useState("");

  // Calculate current balance as sum of all balance types
  const cashBalance = parseFloat(shopBalance?.cashBalance || "0");
  const cardBalance = parseFloat(shopBalance?.cardBalance || "0");
  const bankBalance = parseFloat(shopBalance?.bankBalance || "0");
  const currentBalance = cashBalance + cardBalance + bankBalance;

  const totalIncome = cashflowData?.totalIncome || 0;
  const totalExpenses = cashflowData?.totalExpenses || 0;
  const projectedBalance = cashflowData?.projectedBalance || 0;

  // Daily goals calculation
  const totalUpcoming =
    upcomingPayments?.data?.reduce(
      (sum, item) => sum + parseFloat(item.amount),
      0
    ) || 0;

  const daysUntilLastPayment = cashflowData?.daysUntilNextPayment || 22;
  const dailyTarget = totalUpcoming / daysUntilLastPayment;
  const dailyProgress = cashflowData?.dailyProgress || 50;

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
          <RecurringPaymentDialog shopId={shopId}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Upcoming Payment
            </Button>
          </RecurringPaymentDialog>
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
      <CashflowSummary
        currentBalance={currentBalance}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        projectedBalance={projectedBalance}
        formatCurrency={formatCurrency}
        transactions={cashflowData?.transactions?.recent}
      />

      {/* Balance Breakdown - Moved here from right column */}
      <div className="mb-6">
        <BalanceBreakdown
          balance={shopBalance}
          formatCurrency={formatCurrency}
        />
      </div>

      {/* Daily Goal Tracker
      <DailyGoalTracker
        dailyTarget={dailyTarget}
        dailyProgress={dailyProgress}
        formatCurrency={formatCurrency}
        daysUntilNextPayment={daysUntilLastPayment}
      /> */}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          {/* Cash Flow Tabs */}
          <TransactionTabs
            transactions={cashflowData?.transactions}
            formatCurrency={formatCurrency}
            shopId={shopId}
          />

          {/* Recurring Payments */}
          <RecurringPayments
            recurringPayments={
              cashflowData?.upcomingPayments.filter(
                (p) => p.paymentType === "RECURRING"
              ) || []
            }
            formatCurrency={formatCurrency}
            shopId={shopId}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Upcoming Payments Card */}
          <UpcomingPaymentsComponent
            upcomingPayments={upcomingPayments?.data || []}
            totalUpcoming={totalUpcoming}
            formatCurrency={formatCurrency}
            shopId={shopId}
          />

          {/* ProcessedPayments component */}
          {/* <ProcessedPayments
            transactions={cashflowData?.transactions?.recent || []}
            formatCurrency={formatCurrency}
          /> */}
        </div>
      </div>
    </div>
  );
}
