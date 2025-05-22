"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow, format } from "date-fns";
import { TOrder } from "@workspace/ui/types/order";
import { formatPrice } from "@workspace/ui/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { DataTable } from "@workspace/ui/components/datatable/datatable";
import {
  Eye,
  MoreHorizontal,
  Printer,
  ReceiptText,
  XSquare,
  CreditCard,
  Wallet,
  Banknote,
} from "lucide-react";

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<
    string,
    {
      label: string;
      variant: "default" | "secondary" | "destructive" | "outline";
    }
  > = {
    COMPLETED: { label: "Completed", variant: "default" },
    REFUNDED: { label: "Refunded", variant: "secondary" },
    CANCELLED: { label: "Cancelled", variant: "destructive" },
    PENDING: { label: "Pending", variant: "outline" },
  };

  const config = statusConfig[status] || { label: status, variant: "default" };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

// Payment method badge component
const PaymentMethodBadge = ({ method }: { method: string }) => {
  const getIcon = () => {
    switch (method) {
      case "CASH":
        return <Banknote className="h-3 w-3 mr-1" />;
      case "CARD":
        return <CreditCard className="h-3 w-3 mr-1" />;
      case "WALLET":
        return <Wallet className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center">
      {getIcon()}
      {method}
    </div>
  );
};

// Order detail modal component
const OrderDetailModal = ({
  order,
  isOpen,
  onClose,
}: {
  order: TOrder | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!order) return null;

  const totalItems = order.orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const changeAmount = Math.max(0, order.paid - order.total);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ReceiptText className="h-5 w-5" />
            Receipt #{order.orderNumber}
          </DialogTitle>
          <DialogDescription>
            {format(new Date(order.createdAt), "PPpp")} •{" "}
            {formatDistanceToNow(new Date(order.createdAt), {
              addSuffix: true,
            })}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="details">Receipt Details</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Transaction Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Number:</span>
                    <span>{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shop:</span>
                    <span>{order.shopId}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {order.payments.length > 0 ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Method:</span>
                        <div className="flex flex-col items-end">
                          {order.payments.map((payment, index) => (
                            <div key={payment.id} className="flex items-center">
                              <PaymentMethodBadge method={payment.method} />
                              {order.payments.length > 1 && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  ({formatPrice(payment.amount)})
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Paid:</span>
                        <span>{formatPrice(order.paid)}</span>
                      </div>
                      {changeAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Change:</span>
                          <span>{formatPrice(changeAmount)}</span>
                        </div>
                      )}
                      {order.paymentDue > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground font-medium text-destructive">
                            Due:
                          </span>
                          <span className="text-destructive font-medium">
                            {formatPrice(order.paymentDue)}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-2 text-sm text-muted-foreground">
                      No payments recorded
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {order.customer && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Customer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{order.customer.name}</span>
                  </div>
                  {order.customer.email && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{order.customer.email}</span>
                    </div>
                  )}
                  {order.customer.contactNumber && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span>{order.customer.contactNumber}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  Items Purchased ({totalItems})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.orderItems.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-2 text-left font-medium">Item</th>
                        <th className="pb-2 text-center font-medium">Qty</th>
                        <th className="pb-2 text-right font-medium">Price</th>
                        <th className="pb-2 text-right font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems.map((item) => {
                        // Safely handle potentially undefined product
                        const productName =
                          item.product?.name || "Unknown Product";

                        return (
                          <tr key={item.id} className="border-b">
                            <td className="py-2">{productName}</td>
                            <td className="py-2 text-center">
                              {item.quantity}
                            </td>
                            <td className="py-2 text-right">
                              {formatPrice(item.sellingPrice)}
                            </td>
                            <td className="py-2 text-right">
                              {formatPrice(item.sellingPrice * item.quantity)}
                            </td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td
                          colSpan={3}
                          className="pt-3 text-right text-muted-foreground"
                        >
                          Subtotal:
                        </td>
                        <td className="pt-3 text-right">
                          {formatPrice(order.subtotal)}
                        </td>
                      </tr>
                      {order.discount > 0 && (
                        <tr>
                          <td
                            colSpan={3}
                            className="pt-1 text-right text-muted-foreground"
                          >
                            Discount:
                          </td>
                          <td className="pt-1 text-right text-green-600">
                            -{formatPrice(order.discount)}
                          </td>
                        </tr>
                      )}
                      {order.total === 0 && order.paid > 0 && (
                        <tr>
                          <td
                            colSpan={3}
                            className="pt-3 text-right font-medium"
                          >
                            Due Payment:
                          </td>
                          <td className="pt-3 text-right font-medium text-green-600">
                            {formatPrice(order.paid)}
                          </td>
                        </tr>
                      )}
                      <tr className="font-medium">
                        <td colSpan={3} className="pt-3 text-right border-t">
                          {order.total === 0 && order.paid > 0
                            ? "Total Paid:"
                            : "Total:"}
                        </td>
                        <td className="pt-3 text-right border-t">
                          {formatPrice(
                            order.total === 0 && order.paid > 0
                              ? order.paid
                              : order.total
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-2 text-sm text-muted-foreground">
                    No items in this order
                  </div>
                )}
              </CardContent>
              {order.note && (
                <CardFooter className="text-sm text-muted-foreground border-t pt-3">
                  <div>
                    <span className="font-medium">Notes:</span> {order.note}
                  </div>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="actions">
            <Card>
              <CardHeader>
                <CardTitle>Receipt Actions</CardTitle>
                <CardDescription>Manage this transaction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button className="w-full">
                    <Printer className="mr-2 h-4 w-4" />
                    Print Receipt
                  </Button>

                  <Button variant="outline" className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    View Full Details
                  </Button>

                  {order.status === "COMPLETED" && (
                    <>
                      <Button variant="outline" className="w-full">
                        <XSquare className="mr-2 h-4 w-4" />
                        Process Refund
                      </Button>

                      <Button variant="outline" className="w-full">
                        <ReceiptText className="mr-2 h-4 w-4" />
                        Email Receipt
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-muted-foreground border-t pt-3">
                <span>Order ID: {order.id}</span>
                <span>{format(new Date(order.createdAt), "yyyy-MM-dd")}</span>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export function OrdersDataTable({ orders }: { orders: TOrder[] }) {
  const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const showOrderDetails = (order: TOrder) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const columns: ColumnDef<TOrder>[] = [
    {
      accessorKey: "orderNumber",
      header: "Order #",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.orderNumber}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date & Time",
      cell: ({ row }) => {
        const rawDate = row.original.createdAt;

        // Check if the date exists and is valid
        if (!rawDate || rawDate === "undefined") {
          return <div className="text-muted-foreground">No date</div>;
        }

        try {
          // Use a safer date parsing approach
          const date = new Date(rawDate);

          // Verify the date is valid before formatting
          if (isNaN(date.getTime())) {
            return <div className="text-muted-foreground">Invalid date</div>;
          }

          // Format the date successfully
          return (
            <div className="flex flex-col">
              <div>{format(date, "MMM dd, yyyy")}</div>
              <div className="text-xs text-muted-foreground">
                {format(date, "h:mm a")}
              </div>
            </div>
          );
        } catch (error) {
          console.error("Date formatting error:", error, "Raw date:", rawDate);
          return <div className="text-muted-foreground">Date error</div>;
        }
      },
    },
    {
      accessorKey: "customer.name",
      header: "Customer",
      cell: ({ row }) => (
        <div>{row.original.customer?.name || "Anonymous"}</div>
      ),
    },
    {
      accessorKey: "total",
      header: "Amount",
      cell: ({ row }) => {
        const order = row.original;
        const totalPaid = order.paid || 0;

        // Check if this is a due payment transaction (total = 0 but paid amount > 0)
        const isDuePayment = order.total === 0 && totalPaid > 0;

        return (
          <div className="flex flex-col">
            {isDuePayment ? (
              // Due payment without new purchases
              <div className="font-medium">{formatPrice(totalPaid)}</div>
            ) : (
              // Regular order with items
              <>
                <div className="font-medium">{formatPrice(order.total)}</div>
                {order.paymentDue > 0 && (
                  <div className="text-xs text-destructive">
                    Due: {formatPrice(order.paymentDue)}
                  </div>
                )}
              </>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "payments",
      header: "Payment",
      cell: ({ row }) => {
        const payments = row.original.payments || [];
        if (payments.length === 0) {
          return <div className="text-muted-foreground">No payment</div>;
        }
        return payments.length === 1 ? (
          <PaymentMethodBadge method={payments[0]?.method || "UNKNOWN"} />
        ) : (
          <div className="flex flex-col">
            <div className="text-xs font-medium">Multiple</div>
            <div className="text-xs text-muted-foreground">
              {payments.length} payments
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => showOrderDetails(row.original)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Printer className="mr-2 h-4 w-4" />
                Print Receipt
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {row.original.status === "COMPLETED" && (
                <DropdownMenuItem>
                  <XSquare className="mr-2 h-4 w-4" />
                  Process Refund
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  // Add a filter for due payments and status
  const statusFilterOptions = [
    { label: "Completed", value: "COMPLETED" },
    { label: "Refunded", value: "REFUNDED" },
    { label: "Cancelled", value: "CANCELLED" },
    { label: "Pending", value: "PENDING" },
  ];

  // Add a custom column for payment due filter
  const columnsWithDueFilter: ColumnDef<TOrder>[] = [...columns];

  // Filter orders with due payments
  const [showDueOnly, setShowDueOnly] = useState(false);
  const filteredOrders = showDueOnly
    ? orders.filter((order) => order.paymentDue > 0)
    : orders;

  return (
    <div className="space-y-4">
      <DataTable
        columns={columnsWithDueFilter}
        data={filteredOrders}
        searchColumn="orderNumber"
        searchPlaceholder="Search orders..."
        filters={[
          {
            filterKey: "status",
            title: "Status",
            options: statusFilterOptions,
          },
        ]}
      />

      <OrderDetailModal
        order={selectedOrder}
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
    </div>
  );
}
