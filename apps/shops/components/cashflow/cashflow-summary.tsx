import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { Transaction } from "@/types/cashflow";

interface CashflowSummaryProps {
  currentBalance: number;
  totalIncome?: number;
  totalExpenses?: number;
  projectedBalance: number;
  formatCurrency: (amount: number) => string;
  transactions?: Transaction[];
}

export function CashflowSummary({
  currentBalance,
  totalIncome: propsTotalIncome,
  totalExpenses: propsTotalExpenses,
  projectedBalance,
  formatCurrency,
  transactions = [],
}: CashflowSummaryProps) {
  // Calculate income and expenses using the logic based on transaction types
  const calculatedTotals =
    transactions.length > 0
      ? transactions.reduce(
          (acc, transaction) => {
            const amount = parseFloat(transaction.amount);
            // Income: DUE_PAYMENT or ORDER_PAYMENT with "Order #ORD-" in description
            const isIncome =
              transaction.type === "DUE_PAYMENT" ||
              (transaction.type === "ORDER_PAYMENT" &&
                transaction.description.includes("Order #ORD-"));

            if (isIncome) {
              return {
                income: acc.income + amount,
                expenses: acc.expenses,
              };
            } else {
              return {
                income: acc.income,
                expenses: acc.expenses + amount,
              };
            }
          },
          { income: 0, expenses: 0 }
        )
      : { income: 0, expenses: 0 };

  // Use calculated values when transactions are available, otherwise fall back to provided props
  const totalIncome =
    transactions.length > 0 ? calculatedTotals.income : propsTotalIncome || 0;
  const totalExpenses =
    transactions.length > 0
      ? calculatedTotals.expenses
      : propsTotalExpenses || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(currentBalance)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total across all payment methods
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
            {totalIncome > 0 ? "+" : ""}
            {((totalIncome / (totalIncome || 1)) * 100).toFixed(1)}% from last
            month
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
            {totalExpenses > 0 ? "-" : ""}
            {((totalExpenses / (totalExpenses || 1)) * 100).toFixed(1)}% from
            last month
          </p>
        </CardContent>
      </Card>
      {/* <Card>
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
      </Card> */}
    </div>
  );
}
