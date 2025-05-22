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
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Separator } from "@workspace/ui/components/separator";
import { Calendar, AlertCircle, Repeat, CreditCard } from "lucide-react";
import { UpcomingPayment } from "@/types/upcoming-payments";
import { deleteUpcomingPayment } from "@/actions/cashflow";
import { toast } from "sonner";
import { EditPaymentDialog } from "@/components/cashflow/dialog/edit-payment-dialog";
import { PaymentConfirmDialog } from "@/components/cashflow/dialog/payment-confirm-dialog";

interface UpcomingPaymentsComponentProps {
  upcomingPayments: UpcomingPayment[];
  totalUpcoming: number;
  formatCurrency: (amount: number) => string;
  shopId: string;
}

export function UpcomingPaymentsComponent({
  upcomingPayments,
  totalUpcoming,
  formatCurrency,
  shopId,
}: UpcomingPaymentsComponentProps) {
  const [paymentToEdit, setPaymentToEdit] = useState<UpcomingPayment | null>(
    null
  );

  // Handle delete payment
  const handleDeletePayment = async (paymentId: string) => {
    const promise = deleteUpcomingPayment(paymentId);

    toast.promise(promise, {
      loading: "Deleting payment...",
      success: "Payment deleted successfully!",
      error: "Failed to delete payment",
    });
  };

  // Handle payment edit
  const handleEditPayment = (payment: UpcomingPayment) => {
    setPaymentToEdit(payment);
  };

  // Handle payment completion
  const handlePaymentComplete = () => {
    // Refresh the data or update the UI as needed
    // This could trigger a refetch or update the local state
    toast.info("Payment list updated");
  };

  return (
    <>
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
              {upcomingPayments.length > 0 ? (
                upcomingPayments.map((payment) => (
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
                              payment.paymentType === "RECURRING"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {payment.paymentType === "RECURRING" ? (
                              <Repeat className="h-3 w-3 mr-1" />
                            ) : (
                              <CreditCard className="h-3 w-3 mr-1" />
                            )}
                            {payment.paymentType === "RECURRING"
                              ? "Recurring"
                              : "One-time"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Due:{" "}
                            {new Date(payment.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold">
                        {formatCurrency(parseFloat(payment.amount))}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditPayment(payment)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePayment(payment.id)}
                      >
                        Delete
                      </Button>
                      <PaymentConfirmDialog
                        payment={payment}
                        formatCurrency={formatCurrency}
                        onPaymentComplete={handlePaymentComplete}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming payments
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="mt-4">
            <Separator className="my-4" />
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Upcoming</span>
              <span className="font-bold">{formatCurrency(totalUpcoming)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {paymentToEdit && (
        <EditPaymentDialog
          payment={paymentToEdit}
          onOpenChange={() => setPaymentToEdit(null)}
          shopId={shopId}
        />
      )}
    </>
  );
}
