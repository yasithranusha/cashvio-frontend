"use client";

import { useState } from "react";
import { DataTable } from "@workspace/ui/components/datatable/datatable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { format, formatDistanceToNow } from "date-fns";
import { 
  Eye, 
  MoreHorizontal, 
  Printer, 
  ReceiptText, 
  XSquare,
  CreditCard,
  Wallet,
  Banknote
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@workspace/ui/components/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";

// Order statuses specific to a POS system
type OrderStatus = 'COMPLETED' | 'REFUNDED' | 'PARTIALLY_REFUNDED' | 'VOIDED';

// Define transaction type for a POS system
type Transaction = {
  id: string;
  receiptNumber: string;
  cashier: string;
  customer?: {
    name: string;
    phone?: string;
    email?: string;
  };
  date: Date;
  status: OrderStatus;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
    discount?: number;
  }[];
  paymentMethod: string;
  subTotal: number;
  discount?: number;
  tax?: number;
  totalAmount: number;
  amountPaid: number;
  change?: number;
  register: string; // Ensure register is always a string, not undefined
  notes?: string;
};

// Transaction detail modal component
const TransactionDetailModal = ({ 
  transaction, 
  isOpen, 
  onClose 
}: { 
  transaction: Transaction | null, 
  isOpen: boolean, 
  onClose: () => void 
}) => {
  if (!transaction) return null;
  
  const totalItems = transaction.items.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ReceiptText className="h-5 w-5" /> 
            Receipt #{transaction.receiptNumber}
          </DialogTitle>
          <DialogDescription>
            {format(new Date(transaction.date), "PPpp")} • {formatDistanceToNow(new Date(transaction.date), { addSuffix: true })}
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
                  <CardTitle className="text-sm font-medium">Transaction Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <StatusBadge status={transaction.status} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cashier:</span>
                    <span>{transaction.cashier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Register:</span>
                    <span>{transaction.register}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Method:</span>
                    <PaymentMethodBadge method={transaction.paymentMethod} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paid:</span>
                    <span>Rs. {transaction.amountPaid.toLocaleString()}</span>
                  </div>
                  {transaction.change !== undefined && transaction.change > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Change:</span>
                      <span>Rs. {transaction.change.toLocaleString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {transaction.customer && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Customer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{transaction.customer.name}</span>
                  </div>
                  {transaction.customer.phone && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span>{transaction.customer.phone}</span>
                    </div>
                  )}
                  {transaction.customer.email && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{transaction.customer.email}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Items Purchased ({totalItems})</CardTitle>
              </CardHeader>
              <CardContent>
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
                    {transaction.items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2">{item.name}</td>
                        <td className="py-2 text-center">{item.quantity}</td>
                        <td className="py-2 text-right">Rs. {item.price.toLocaleString()}</td>
                        <td className="py-2 text-right">Rs. {item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3} className="pt-3 text-right text-muted-foreground">Subtotal:</td>
                      <td className="pt-3 text-right">Rs. {transaction.subTotal.toLocaleString()}</td>
                    </tr>
                    {transaction.discount && transaction.discount > 0 && (
                      <tr>
                        <td colSpan={3} className="pt-1 text-right text-muted-foreground">Discount:</td>
                        <td className="pt-1 text-right text-green-600">-Rs. {transaction.discount.toLocaleString()}</td>
                      </tr>
                    )}
                    {transaction.tax && transaction.tax > 0 && (
                      <tr>
                        <td colSpan={3} className="pt-1 text-right text-muted-foreground">Tax:</td>
                        <td className="pt-1 text-right">Rs. {transaction.tax.toLocaleString()}</td>
                      </tr>
                    )}
                    <tr className="font-medium">
                      <td colSpan={3} className="pt-3 text-right border-t">Total:</td>
                      <td className="pt-3 text-right border-t">Rs. {transaction.totalAmount.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
              {transaction.notes && (
                <CardFooter className="text-sm text-muted-foreground border-t pt-3">
                  <div>
                    <span className="font-medium">Notes:</span> {transaction.notes}
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

                  {transaction.status === 'COMPLETED' && (
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
                <span>Transaction ID: {transaction.id}</span>
                <span>{format(new Date(transaction.date), "yyyy-MM-dd")}</span>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

// Status badge component
const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const statusConfig = {
    COMPLETED: { label: "Completed", variant: "default" as const },
    REFUNDED: { label: "Refunded", variant: "secondary" as const },
    PARTIALLY_REFUNDED: {
      label: "Partially Refunded",
      variant: "destructive" as const,
    },
    VOIDED: { label: "Voided", variant: "outline" as const },
  };

  const { label, variant } = statusConfig[status];

  return <Badge variant={variant}>{label}</Badge>;
};

// Payment method badge component
const PaymentMethodBadge = ({ method }: { method: string }) => {
  const getIcon = () => {
    switch (method) {
      case "Cash":
        return <Banknote className="h-3 w-3 mr-1" />;
      case "Credit Card":
      case "Debit Card":
        return <CreditCard className="h-3 w-3 mr-1" />;
      case "Wallet":
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

// Generate mock transaction data
const generateMockTransactions = (count: number): Transaction[] => {
  const statuses: OrderStatus[] = ['COMPLETED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'VOIDED'];
  const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Wallet'];
  const registers = ['Register 1', 'Register 2', 'Register 3'];
  const cashiers = ['Malini Perera', 'Amal Silva', 'Sanduni Fernando', 'Rajitha Bandara'];
  
  const products = [
    { name: 'Samsung Galaxy S23', price: 185000 },
    { name: 'iPhone 15', price: 225000 },
    { name: 'Sony Headphones', price: 35000 },
    { name: 'Wireless Mouse', price: 6500 },
    { name: 'USB-C Cable', price: 2500 },
    { name: 'Bluetooth Speaker', price: 15000 },
    { name: 'Power Bank', price: 8500 },
    { name: 'Phone Case', price: 3500 },
    { name: 'Screen Protector', price: 2000 },
    { name: 'External SSD', price: 25000 },
  ];
  
  const result: Transaction[] = [];
  
  for (let i = 0; i < count; i++) {
    const transactionDate = new Date();
    transactionDate.setDate(transactionDate.getDate() - Math.floor(Math.random() * 30)); // Random date within the last month
    
    // Generate random time for the transaction
    transactionDate.setHours(Math.floor(Math.random() * 12) + 8); // Between 8 AM and 8 PM
    transactionDate.setMinutes(Math.floor(Math.random() * 60));
    
    const status = statuses[Math.floor(Math.random() * statuses.length)] as OrderStatus;
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)] || 'Cash';
    const register = registers[Math.floor(Math.random() * registers.length)] || 'Register 1';
    const cashier = cashiers[Math.floor(Math.random() * cashiers.length)] || 'Unknown';
    
    // 70% chance of having customer info for a transaction
    const hasCustomerInfo = Math.random() < 0.7;
    const customer = hasCustomerInfo ? {
      name: ['Saman Kumara', 'Kumari Senanayake', 'Nimal Perera', 'Chamari de Silva', 'Lakshman Bandara'][Math.floor(Math.random() * 5)] || 'Customer',
      phone: Math.random() < 0.8 ? `07${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}` : undefined,
      email: Math.random() < 0.5 ? `customer${Math.floor(Math.random() * 1000)}@example.com` : undefined,
    } : undefined;
    
    // Generate between 1 and 5 items
    const itemCount = Math.floor(Math.random() * 5) + 1;
    const selectedProducts = new Set<number>();
    
    while (selectedProducts.size < itemCount) {
      selectedProducts.add(Math.floor(Math.random() * products.length));
    }
    
    const items = Array.from(selectedProducts).map((index, i) => {
      const product = products[index];
      if (!product) {
        throw new Error(`Product at index ${index} is undefined`);
      }
      
      const quantity = Math.floor(Math.random() * 3) + 1;
      // 25% chance of having a discount on an item
      const hasDiscount = Math.random() < 0.25;
      const discount = hasDiscount ? Math.floor(product.price * quantity * 0.1) : 0;
      
      return {
        id: `item-${i}`,
        name: product.name,
        quantity,
        price: product.price,
        total: (product.price * quantity) - discount,
        discount: hasDiscount ? discount : undefined,
      };
    });
    
    const subTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Sometimes apply store-wide discount
    const hasDiscount = Math.random() < 0.3;
    const discount = hasDiscount ? Math.floor(subTotal * (Math.random() * 0.15)) : 0;
    
    // Sometimes apply tax
    const hasTax = Math.random() < 0.5; 
    const tax = hasTax ? Math.floor(subTotal * 0.15) : 0;
    
    const totalAmount = subTotal - (discount || 0) + (tax || 0);
    
    // For cash payments, sometimes have change
    let amountPaid = totalAmount;
    let change;
    
    if (paymentMethod === 'Cash') {
      // Round up to nearest 100 or 500
      const roundingFactor = Math.random() < 0.5 ? 100 : 500;
      amountPaid = Math.ceil(totalAmount / roundingFactor) * roundingFactor;
      change = amountPaid - totalAmount;
    }
    
    // Add notes sometimes
    const notes = Math.random() < 0.2 ? 
      ["Customer requested fast service", "Item has 3-month warranty", "Referred by another customer"][Math.floor(Math.random() * 3)] 
      : undefined;
    
    result.push({
      id: `txn-${format(transactionDate, "yyyyMMdd")}-${i + 1}`,
      receiptNumber: `R${format(transactionDate, "yyyyMMdd")}${(i + 1).toString().padStart(3, '0')}`,
      cashier,
      customer,
      date: transactionDate,
      status,
      items,
      paymentMethod,
      subTotal,
      discount: discount > 0 ? discount : undefined,
      tax: tax > 0 ? tax : undefined,
      totalAmount,
      amountPaid,
      change: change && change > 0 ? change : undefined,
      register, // This will never be undefined
      notes,
    });
  }
  
  return result;
};

export default function OrdersPage() {
  const [mockTransactions] = useState<Transaction[]>(() => generateMockTransactions(50));
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const showTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailsOpen(true);
  };

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "receiptNumber",
      header: "Receipt #",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.receiptNumber}</div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date & Time",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div>{format(new Date(row.original.date), "MMM dd, yyyy")}</div>
          <div className="text-xs text-muted-foreground">
            {format(new Date(row.original.date), "h:mm a")}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "cashier",
      header: "Cashier",
    },
    {
      accessorKey: "totalAmount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="font-medium">Rs. {row.original.totalAmount.toLocaleString()}</div>
      ),
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment",
      cell: ({ row }) => (
        <PaymentMethodBadge method={row.original.paymentMethod} />
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.original.status} />
      ),
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
              <DropdownMenuItem onClick={() => showTransactionDetails(row.original)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Printer className="mr-2 h-4 w-4" />
                Print Receipt
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {row.original.status === 'COMPLETED' && (
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

  const statusFilterOptions = [
    {
      label: "Completed",
      value: "COMPLETED",
    },
    {
      label: "Refunded",
      value: "REFUNDED",
    },
    {
      label: "Partially Refunded",
      value: "PARTIALLY_REFUNDED",
    },
    {
      label: "Voided",
      value: "VOIDED",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <DataTable
          columns={columns}
          data={mockTransactions}
          searchColumn="receiptNumber"
          searchPlaceholder="Search receipts..."
          filters={[
            {
              filterKey: "status",
              title: "Status",
              options: statusFilterOptions,
            },
          ]}
        />

        <TransactionDetailModal
          transaction={selectedTransaction}
          isOpen={detailsOpen}
          onClose={() => setDetailsOpen(false)}
        />
      </div>
    </div>
  );
}