"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { CheckCircle } from "lucide-react";
import { Transaction } from "@/types/cashflow";
import { Badge } from "@workspace/ui/components/badge";

interface ProcessedPaymentsProps {
  transactions: Transaction[];
  formatCurrency: (amount: number) => string;
}

export function ProcessedPayments({
  transactions,
  formatCurrency,
}: ProcessedPaymentsProps) {
  // Filter for processed payments - we'll identify them by looking at descriptions
  // that indicate a payment was made/processed
  const processedPayments = transactions
    .filter(
      (tx) =>
        tx.description.toLowerCase().includes("payment") &&
        !tx.description.includes("Order #ORD-")
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5); // Show only the 5 most recent

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
          Recently Processed Payments
        </CardTitle>
        <CardDescription>
          Payment transactions that have been successfully processed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[240px]">
          {processedPayments.length > 0 ? (
            <div className="space-y-4">
              {processedPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-2 border-b"
                >
                  <div>
                    <p className="text-sm font-medium">{payment.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs bg-green-50">
                        Processed
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(payment.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      {formatCurrency(parseFloat(payment.amount))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No processed payments found
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
