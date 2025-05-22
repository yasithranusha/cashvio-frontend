"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ShopBalance } from "@/types/cashflow";
import { CreditCard, Coins, Building2 } from "lucide-react";

interface BalanceBreakdownProps {
  balance: ShopBalance;
  formatCurrency: (amount: number) => string;
}

export function BalanceBreakdown({
  balance,
  formatCurrency,
}: BalanceBreakdownProps) {
  const cashBalance = parseFloat(balance?.cashBalance || "0");
  const cardBalance = parseFloat(balance?.cardBalance || "0");
  const bankBalance = parseFloat(balance?.bankBalance || "0");

  // Calculate percentages for the visual bar
  const total = cashBalance + cardBalance + bankBalance;
  const cashPercent = total > 0 ? Math.round((cashBalance / total) * 100) : 0;
  const cardPercent = total > 0 ? Math.round((cardBalance / total) * 100) : 0;
  const bankPercent = total > 0 ? 100 - (cashPercent + cardPercent) : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Balance Breakdown</CardTitle>
            <CardDescription>
              Your total balance by payment method
            </CardDescription>
          </div>
          <div className="text-2xl font-bold">{formatCurrency(total)}</div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Single combined progress bar */}
        <div className="w-full h-3 bg-gray-200 rounded-full mb-4 flex">
          {cashPercent > 0 && (
            <div
              className="bg-amber-500 h-3 rounded-l-full"
              style={{ width: `${cashPercent}%` }}
            ></div>
          )}
          {cardPercent > 0 && (
            <div
              className="bg-blue-500 h-3"
              style={{
                width: `${cardPercent}%`,
                borderRadius: cashPercent === 0 ? "0.5rem 0 0 0.5rem" : "0",
              }}
            ></div>
          )}
          {bankPercent > 0 && (
            <div
              className="bg-green-500 h-3 rounded-r-full"
              style={{ width: `${bankPercent}%` }}
            ></div>
          )}
        </div>

        {/* Balance type indicators */}
        <div className="grid grid-cols-3 gap-4">
          {/* Cash Balance */}
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-1">
              <Coins className="h-4 w-4 mr-2 text-amber-500" />
              <span className="text-sm font-medium">Cash</span>
            </div>
            <span className="text-lg font-bold">
              {formatCurrency(cashBalance)}
            </span>
            <span className="text-xs text-muted-foreground">
              {cashPercent}% of total
            </span>
          </div>

          {/* Card Balance */}
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-1">
              <CreditCard className="h-4 w-4 mr-2 text-blue-500" />
              <span className="text-sm font-medium">Card</span>
            </div>
            <span className="text-lg font-bold">
              {formatCurrency(cardBalance)}
            </span>
            <span className="text-xs text-muted-foreground">
              {cardPercent}% of total
            </span>
          </div>

          {/* Bank Balance */}
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-1">
              <Building2 className="h-4 w-4 mr-2 text-green-500" />
              <span className="text-sm font-medium">Bank</span>
            </div>
            <span className="text-lg font-bold">
              {formatCurrency(bankBalance)}
            </span>
            <span className="text-xs text-muted-foreground">
              {bankPercent}% of total
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
