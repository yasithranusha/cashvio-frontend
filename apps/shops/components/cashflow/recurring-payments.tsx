import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Repeat, PlusCircle } from "lucide-react";
import { UpcomingPayment } from "@/types/cashflow";
import { RecurringPaymentDialog } from "@/components/cashflow/dialog/recurring-payment-dialog";

interface RecurringPaymentsProps {
  recurringPayments: UpcomingPayment[];
  formatCurrency: (amount: number) => string;
  shopId: string;
}

export function RecurringPayments({
  recurringPayments,
  formatCurrency,
  shopId,
}: RecurringPaymentsProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
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
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowAddDialog(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New
        </Button>

        <RecurringPaymentDialog
          open={showAddDialog}
          setOpen={setShowAddDialog}
          shopId={shopId}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recurringPayments.length > 0 ? (
            recurringPayments.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-3"
              >
                <div>
                  <p className="font-medium">{item.description}</p>
                  <div className="flex items-center mt-1">
                    <Badge variant="outline" className="mr-2 text-xs">
                      Monthly
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Next: {new Date(item.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatCurrency(parseFloat(item.amount))}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No recurring payments found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
