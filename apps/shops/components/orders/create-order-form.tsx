"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { TCustomers, TProducts } from "@workspace/ui/types/order";
import { createOrder, getCustomerWalletBalance } from "@/actions/order";
import { OrderFormSchema, OrderFormValues } from "@/schemas/order";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Trash,
  Banknote,
  CreditCard,
  Wallet,
  Pencil,
  Plus,
  X,
} from "lucide-react";
import { formatPrice } from "@workspace/ui/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Textarea } from "@workspace/ui/components/textarea";

interface CreateOrderFormProps {
  products: TProducts[];
  customers: TCustomers[] | undefined;
}

type OrderItem = {
  productId: string;
  barcodes: string[];
  customPrice?: number;
  productName: string;
  quantity: number;
  originalPrice: number;
};

type PaymentEntry = {
  id: string;
  method: "CASH" | "CARD" | "WALLET" | "BANK";
  amount: number;
  reference?: string;
};

export default function CreateOrderForm({
  products,
  customers,
}: CreateOrderFormProps) {
  const router = useRouter();
  const [barcodeInput, setBarcodeInput] = useState("");
  const [barcodeResults, setBarcodeResults] = useState<TProducts[]>([]);
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerResults, setCustomerResults] = useState<TCustomers[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProductSearchOpen, setIsProductSearchOpen] = useState(false);
  const [isCustomerSearchOpen, setIsCustomerSearchOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState<{
    balance: number;
    loyaltyPoints: number;
  } | null>(null);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "CASH" | "CARD" | "WALLET" | "BANK"
  >("CASH");
  const [currentPaymentAmount, setCurrentPaymentAmount] = useState<number>(0);
  const [payments, setPayments] = useState<PaymentEntry[]>([]);
  const [addToWallet, setAddToWallet] = useState<boolean>(false);
  const [customPriceItem, setCustomPriceItem] = useState<{
    index: number;
    price: number;
  } | null>(null);
  const [createDue, setCreateDue] = useState<boolean>(false);
  const [addingPayment, setAddingPayment] = useState<boolean>(false);
  const [addChangeToWallet, setAddChangeToWallet] = useState<boolean>(false);
  const [walletChangeAmount, setWalletChangeAmount] = useState<number>(0);

  // Initialize form with ALL fields having defined values
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(OrderFormSchema),
    defaultValues: {
      shopId: "e2de2c02-2d2a-4f69-a9f2-317557bff078", // Static shop ID for now
      customerId: "",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      items: [],
      payments: [], // Start with empty payments
      discount: 0,
      discountType: "FIXED",
      draft: false,
      sendReceiptEmail: false,
      extraWalletAmount: 0,
      note: "",
      duePaidAmount: 0,
    },
  });

  // Calculate totals
  const subtotal = selectedItems.reduce((total, item) => {
    return total + (item.customPrice || item.originalPrice) * item.quantity;
  }, 0);

  const discountType = form.watch("discountType");
  const discount = form.watch("discount") || 0;
  const discountAmount =
    discountType === "FIXED" ? discount : (subtotal * discount) / 100;
  const total = Math.max(0, subtotal - discountAmount);

  // Calculate due amount
  const remainingToPay = Math.max(
    0,
    total - payments.reduce((acc, p) => acc + p.amount, 0)
  );
  const duePaidAmount =
    walletBalance && (walletBalance?.balance || 0) < 0
      ? Math.abs(walletBalance?.balance || 0)
      : 0;
  const finalTotal = total + duePaidAmount;
  const totalPaid = payments.reduce((acc, payment) => acc + payment.amount, 0);
  const changeAmount = Math.max(0, totalPaid - finalTotal);

  // Calculate physical change to return to customer, accounting for wallet amounts
  const physicalChangeAmount = Math.max(
    0,
    changeAmount - (addChangeToWallet ? walletChangeAmount : 0)
  );

  // Calculate the amount needed to cover just the new items
  const newItemsTotal = subtotal - discountAmount;
  const sufficientPaymentForNewItems = totalPaid >= newItemsTotal;

  // Update form payments when payments list changes
  useEffect(() => {
    if (!isSubmitting) {
      // Convert our payment entries to the format expected by the API
      const formattedPayments = payments.map((payment) => ({
        amount: payment.amount,
        method: payment.method,
        reference: payment.reference,
      }));

      form.setValue("payments", formattedPayments);

      // Calculate the final wallet amount considering all sources
      let finalWalletAmount = 0;

      // Special handling for due payment (no items, existing due)
      const isPayingExistingDue =
        walletBalance &&
        walletBalance.balance < 0 &&
        selectedItems.length === 0 &&
        payments.length > 0;

      if (isPayingExistingDue) {
        // For due payments, set extraWalletAmount to the total of all payments (positive)
        const totalPaymentAmount = payments.reduce(
          (sum, payment) => sum + payment.amount,
          0
        );
        finalWalletAmount = totalPaymentAmount; // positive for paying dues
        console.log("Setting due payment amount:", totalPaymentAmount);
      } else if (createDue) {
        // Negative value creates a due on the wallet for the full amount
        finalWalletAmount = -finalTotal;
      } else if (addToWallet && remainingToPay > 0) {
        // Negative value for the remaining amount to pay
        finalWalletAmount = -remainingToPay;
      } else if (addChangeToWallet && walletChangeAmount > 0) {
        // Positive value adds the change to the wallet as credit
        finalWalletAmount = walletChangeAmount;
      }

      // Set the final calculated value
      form.setValue("extraWalletAmount", finalWalletAmount);
      console.log("Setting wallet amount:", finalWalletAmount);
    }
  }, [
    payments,
    finalTotal,
    form,
    isSubmitting,
    walletBalance,
    createDue,
    addToWallet,
    remainingToPay,
    total,
    changeAmount,
    addChangeToWallet,
    walletChangeAmount,
    selectedItems.length,
  ]);

  // Handle barcode search
  useEffect(() => {
    if (barcodeInput.length > 0 && products && Array.isArray(products)) {
      const results = products.filter((product) => {
        if (product.name.toLowerCase().includes(barcodeInput.toLowerCase())) {
          return true;
        }
        return product.items.some((item) =>
          item.barcode.toLowerCase().includes(barcodeInput.toLowerCase())
        );
      });
      setBarcodeResults(results);
    } else {
      setBarcodeResults([]);
    }
  }, [barcodeInput, products]);

  // Handle customer search
  useEffect(() => {
    if (customerSearch.length > 0 && customers && Array.isArray(customers)) {
      const results = customers.filter((customer) => {
        if (
          customer.name.toLowerCase().includes(customerSearch.toLowerCase())
        ) {
          return true;
        }
        if (
          customer.email.toLowerCase().includes(customerSearch.toLowerCase())
        ) {
          return true;
        }
        return false;
      });
      setCustomerResults(results);
    } else {
      setCustomerResults([]);
    }
  }, [customerSearch, customers]);

  // Handle barcode search dialog close
  const handleProductDialogClose = () => {
    setIsProductSearchOpen(false);
    // Don't clear the input so the user can continue searching
  };

  // Handle customer search dialog close
  const handleCustomerDialogClose = () => {
    setIsCustomerSearchOpen(false);
    // Don't clear the input so the user can continue searching
  };

  // Handle product selection
  const handleProductSelect = (product: TProducts, barcode: string) => {
    const item = product.items.find((item) => item.barcode === barcode);

    if (!item) {
      toast.error("Item not found for this barcode");
      return;
    }

    const existingItemIndex = selectedItems.findIndex(
      (i) => i.productId === product.id
    );

    if (existingItemIndex >= 0) {
      const updatedItems = [...selectedItems];
      const existingItem = updatedItems[existingItemIndex];

      if (existingItem) {
        if (!existingItem.barcodes.includes(barcode)) {
          existingItem.barcodes.push(barcode);
          existingItem.quantity += 1;
        }
      }

      setSelectedItems(updatedItems);
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          productId: product.id,
          productName: product.name,
          barcodes: [barcode],
          originalPrice: item.sellPrice,
          customPrice: item.sellPrice,
          quantity: 1,
        },
      ]);
    }

    setBarcodeInput("");
    setBarcodeResults([]);
    setIsProductSearchOpen(false);
  };

  // Handle customer selection
  const handleCustomerSelect = async (customer: TCustomers) => {
    form.setValue("customerId", customer.id);
    form.setValue("customerName", customer.name);
    form.setValue("customerEmail", customer.email || ""); // Ensure it's never undefined
    setCustomerSearch("");
    setCustomerResults([]);
    setIsCustomerSearchOpen(false);

    // Reset any wallet-related values before loading new data
    setWalletChangeAmount(0);
    setAddChangeToWallet(false);
    setAddToWallet(false);
    setCreateDue(false);

    // Get wallet balance
    setIsLoadingWallet(true);
    setWalletBalance(null);

    try {
      const shopId = form.getValues("shopId");
      const result = await getCustomerWalletBalance(shopId, customer.id);

      if (result.success && result.data) {
        setWalletBalance({
          balance: result.data.balance || 0,
          loyaltyPoints: result.data.loyaltyPoints || 0,
        });
      } else {
        toast.error(result.error || "Failed to get wallet balance");
      }
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      toast.error("Failed to get wallet balance");
    } finally {
      setIsLoadingWallet(false);
    }
  };

  // Remove an item from the order
  const removeItem = (index: number) => {
    const newItems = [...selectedItems];
    newItems.splice(index, 1);
    setSelectedItems(newItems);
  };

  // Update form with selected items
  useEffect(() => {
    form.setValue(
      "items",
      selectedItems.map((item) => ({
        productId: item.productId,
        barcodes: item.barcodes,
        customPrice: item.customPrice,
      }))
    );
  }, [selectedItems, form]);

  // Set custom price for an item
  const setItemCustomPrice = (index: number, price: number) => {
    const updatedItems = [...selectedItems];
    if (updatedItems[index]) {
      updatedItems[index].customPrice = price;
      setSelectedItems(updatedItems);
    }
    setCustomPriceItem(null);
  };

  // Add a new payment
  const addPayment = () => {
    if (currentPaymentAmount <= 0) {
      toast.error("Payment amount must be greater than 0");
      return;
    }

    // Allow both CASH and CARD to exceed the remaining amount
    // Only restrict WALLET and BANK payments
    if (
      (selectedPaymentMethod === "WALLET" ||
        selectedPaymentMethod === "BANK") &&
      currentPaymentAmount > remainingToPay
    ) {
      toast.error(
        `Payment amount exceeds remaining amount (${formatPrice(remainingToPay)})`
      );
      return;
    }

    // Special handling for wallet payments
    if (selectedPaymentMethod === "WALLET") {
      if (!walletBalance) {
        toast.error("No wallet balance information available");
        return;
      }

      if (currentPaymentAmount > Math.max(0, walletBalance?.balance || 0)) {
        toast.error(
          `Payment amount exceeds available wallet balance (${formatPrice(Math.max(0, walletBalance?.balance || 0))})`
        );
        return;
      }
    }

    const newPayment: PaymentEntry = {
      id: `payment-${Date.now()}`,
      method: selectedPaymentMethod,
      amount: currentPaymentAmount,
    };

    setPayments([...payments, newPayment]);
    setCurrentPaymentAmount(0);
    setAddingPayment(false);
    toast.success(
      `Added ${formatPrice(currentPaymentAmount)} payment via ${selectedPaymentMethod}`
    );
  };

  // Remove a payment
  const removePayment = (id: string) => {
    setPayments(payments.filter((p) => p.id !== id));
  };

  // Reset all payments
  const clearPayments = () => {
    setPayments([]);
    setCurrentPaymentAmount(0);
  };

  // Create a specialized submit handler for due payments
  const handleDuePaymentSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Get the current form values
      const values = form.getValues();

      if (!values.customerId) {
        toast.error("Customer is required for due payments");
        setIsSubmitting(false);
        return;
      }

      if (payments.length === 0) {
        toast.error("At least one payment is required");
        setIsSubmitting(false);
        return;
      }

      // Set the payment amount to the total of all payments
      const totalPaymentAmount = payments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );

      // Create a request object with all required properties
      const duePaymentRequest: OrderFormValues = {
        shopId: values.shopId,
        customerId: values.customerId,
        customerName: values.customerName || "",
        customerEmail: values.customerEmail || "",
        customerPhone: values.customerPhone || "",
        payments: payments.map((payment) => ({
          amount: payment.amount,
          method: payment.method,
          reference: payment.reference,
        })),
        // For due payments, we use a positive extraWalletAmount instead of duePaidAmount
        extraWalletAmount: totalPaymentAmount,
        items: [] as {
          productId: string;
          barcodes: string[];
          customPrice?: number;
        }[],
        discount: 0,
        discountType: "FIXED" as "FIXED" | "PERCENTAGE",
        note: values.note || "",
        draft: false,
        sendReceiptEmail: values.sendReceiptEmail || false,
      };

      console.log("Processing due payment with request:", duePaymentRequest);

      // Call the API directly
      const result = await createOrder(duePaymentRequest);

      if (result.success) {
        toast.success("Due payment processed successfully!");
        router.push("/dashboard/orders");
      } else {
        toast.error(result.error || "Failed to process payment");
      }
    } catch (error) {
      console.error("Error processing due payment:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Regular form submission handler
  const onSubmit = async (values: OrderFormValues) => {
    try {
      setIsSubmitting(true);

      const hasItems = selectedItems.length > 0;

      // Regular order must have items
      if (!hasItems) {
        toast.error("Please add at least one item to the order");
        setIsSubmitting(false);
        return;
      }

      // If creating a due or adding to wallet, make sure customer is selected
      if (
        (createDue || addToWallet || addChangeToWallet) &&
        !values.customerId
      ) {
        toast.error("You must select a customer to add amounts to wallet");
        setIsSubmitting(false);
        return;
      }

      // If both createDue and addToWallet are true, we'll prioritize createDue
      // The useEffect above handles setting the extraWalletAmount field

      const result = await createOrder(values);

      if (result.success) {
        toast.success("Order created successfully!");
        router.push("/dashboard/orders");
      } else {
        toast.error(result.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Product Search */}
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>
              Search products by name or barcode
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Label htmlFor="barcodeInput">Barcode or Product Name</Label>
                <div className="flex space-x-2">
                  <Input
                    id="barcodeInput"
                    placeholder="Scan or type barcode/product name"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    className="mt-1 flex-1"
                    autoFocus
                    onClick={() => setIsProductSearchOpen(true)}
                  />
                  <Button
                    type="button"
                    onClick={() => setIsProductSearchOpen(true)}
                    className="mt-1"
                  >
                    Search
                  </Button>
                </div>

                {/* Product Search Dialog */}
                <Dialog
                  open={isProductSearchOpen}
                  onOpenChange={setIsProductSearchOpen}
                >
                  <DialogContent className="max-w-3xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>Search Products</DialogTitle>
                      <DialogDescription>
                        Find products to add to the current order
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-2">
                      <Input
                        placeholder="Search products by name or barcode..."
                        value={barcodeInput}
                        onChange={(e) => setBarcodeInput(e.target.value)}
                        className="w-full mb-4"
                        autoFocus
                      />
                      <ScrollArea className="h-[400px]">
                        {barcodeResults.length > 0 ? (
                          <div className="grid grid-cols-1 gap-4">
                            {barcodeResults.map((product) => (
                              <div
                                key={product.id}
                                className="border rounded-md p-3"
                              >
                                <div className="font-medium text-lg">
                                  {product.name}
                                </div>
                                <div className="text-sm text-muted-foreground mb-2">
                                  Stock: {product.stock}
                                </div>
                                <div className="space-y-2">
                                  {product.items.map((item) => (
                                    <div
                                      key={item.id}
                                      className="border rounded p-2 flex justify-between items-center bg-background hover:bg-accent"
                                    >
                                      <div>
                                        <div className="text-sm">
                                          Barcode: {item.barcode}
                                        </div>
                                        <div className="font-medium">
                                          {formatPrice(item.sellPrice)}
                                        </div>
                                      </div>
                                      <Button
                                        type="button"
                                        onClick={() =>
                                          handleProductSelect(
                                            product,
                                            item.barcode
                                          )
                                        }
                                        size="sm"
                                      >
                                        Add
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-10">
                            <p className="text-muted-foreground">
                              {barcodeInput.length > 0
                                ? "No products found. Try a different search term."
                                : "Type to search for products"}
                            </p>
                          </div>
                        )}
                      </ScrollArea>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={handleProductDialogClose}
                      >
                        Close
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Selected Items */}
              {selectedItems.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Selected Items</h3>
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted hover:bg-muted">
                          <TableHead className="font-medium">Product</TableHead>
                          <TableHead className="text-center font-medium">
                            Quantity
                          </TableHead>
                          <TableHead className="text-right font-medium">
                            Price
                          </TableHead>
                          <TableHead className="text-right font-medium">
                            Total
                          </TableHead>
                          <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedItems.map((item, index) => (
                          <TableRow key={index} className="hover:bg-muted/50">
                            <TableCell className="font-medium">
                              <div>
                                <div>{item.productName}</div>
                                <div className="text-xs text-muted-foreground">
                                  Barcodes: {item.barcodes.join(", ")}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <span>{item.quantity}</span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <span>
                                  {formatPrice(
                                    item.customPrice || item.originalPrice
                                  )}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() =>
                                    setCustomPriceItem({
                                      index,
                                      price:
                                        item.customPrice || item.originalPrice,
                                    })
                                  }
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatPrice(
                                (item.customPrice || item.originalPrice) *
                                  item.quantity
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => removeItem(index)}
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Custom Price Dialog */}
        {customPriceItem !== null && (
          <Dialog
            open={customPriceItem !== null}
            onOpenChange={(open) => !open && setCustomPriceItem(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Custom Price</DialogTitle>
                <DialogDescription>
                  Enter a custom price for this item
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="customPrice">Price</Label>
                <Input
                  id="customPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={customPriceItem?.price || 0}
                  onChange={(e) =>
                    setCustomPriceItem({
                      ...customPriceItem!,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setCustomPriceItem(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() =>
                    customPriceItem &&
                    setItemCustomPrice(
                      customPriceItem.index,
                      customPriceItem.price
                    )
                  }
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>
              Search for existing customer or enter new customer details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Label htmlFor="customerSearch">Search Customer</Label>
                <div className="flex space-x-2">
                  <Input
                    id="customerSearch"
                    placeholder="Search by name or email"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="mt-1 flex-1"
                    onClick={() => setIsCustomerSearchOpen(true)}
                  />
                  <Button
                    type="button"
                    onClick={() => setIsCustomerSearchOpen(true)}
                    className="mt-1"
                  >
                    Search
                  </Button>
                </div>

                {/* Customer Search Dialog */}
                <Dialog
                  open={isCustomerSearchOpen}
                  onOpenChange={setIsCustomerSearchOpen}
                >
                  <DialogContent className="max-w-3xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>Search Customers</DialogTitle>
                      <DialogDescription>
                        Find existing customers to add to the order
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-2">
                      <Input
                        placeholder="Search customers by name or email..."
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        className="w-full mb-4"
                        autoFocus
                      />
                      <ScrollArea className="h-[400px]">
                        {customerResults.length > 0 ? (
                          <div className="grid grid-cols-1 gap-4">
                            {customerResults.map((customer) => (
                              <div
                                key={customer.id}
                                className="border rounded-md p-3 hover:bg-muted cursor-pointer"
                                onClick={() => handleCustomerSelect(customer)}
                              >
                                <div className="font-medium text-lg">
                                  {customer.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {customer.email}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Orders: {customer.orderCount}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-10">
                            <p className="text-muted-foreground">
                              {customerSearch.length > 0
                                ? "No customers found. Try a different search term."
                                : "Type to search for customers"}
                            </p>
                          </div>
                        )}
                      </ScrollArea>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={handleCustomerDialogClose}
                      >
                        Close
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Customer Details Fields - ensure value is always defined */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Customer name"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Customer email"
                          type="email"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Customer phone"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Customer Wallet Information */}
              {form.watch("customerId") && (
                <div className="mt-4">
                  {isLoadingWallet ? (
                    <div className="text-center p-4 bg-muted/30 rounded-md">
                      <span className="text-sm text-muted-foreground">
                        Loading wallet information...
                      </span>
                    </div>
                  ) : walletBalance ? (
                    <div className="p-4 bg-card border rounded-md">
                      <h4 className="text-sm font-medium mb-2">
                        Wallet Information
                      </h4>
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="text-sm">
                            Wallet Balance:{" "}
                            {formatPrice(walletBalance?.balance || 0)}
                          </div>
                          <div className="text-sm">
                            Loyalty Points: {walletBalance?.loyaltyPoints || 0}
                          </div>
                        </div>

                        {(walletBalance?.balance || 0) < 0 && (
                          <div className="bg-destructive/10 text-destructive p-2 rounded text-sm">
                            Outstanding:{" "}
                            {formatPrice(Math.abs(walletBalance?.balance || 0))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <div>Payment Methods</div>
              {payments.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearPayments}
                >
                  Clear All Payments
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              {createDue
                ? "Order will be created as due on customer wallet"
                : "Add one or more payment methods"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Full Due Option */}
            {form.watch("customerId") && (
              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="createDue"
                    checked={createDue}
                    onCheckedChange={(checked) => {
                      setCreateDue(!!checked);
                      if (checked) {
                        // When creating a full due, reset other payment options
                        setAddToWallet(false);
                        clearPayments();
                        setAddingPayment(false);
                      }
                    }}
                  />
                  <Label htmlFor="createDue" className="text-sm">
                    Create full amount ({formatPrice(finalTotal)}) as due on
                    customer wallet
                  </Label>
                </div>
              </div>
            )}

            {/* Payment list */}
            {!createDue && (
              <>
                {payments.length > 0 && (
                  <div className="border rounded-md overflow-hidden mb-4">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>Method</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>
                              <div className="flex items-center">
                                {payment.method === "CASH" && (
                                  <Banknote className="h-4 w-4 mr-2" />
                                )}
                                {payment.method === "CARD" && (
                                  <CreditCard className="h-4 w-4 mr-2" />
                                )}
                                {payment.method === "WALLET" && (
                                  <Wallet className="h-4 w-4 mr-2" />
                                )}
                                {payment.method}
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatPrice(payment.amount)}
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removePayment(payment.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-t">
                          <TableCell className="font-medium">
                            Total Paid
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatPrice(totalPaid)}
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            {totalPaid < finalTotal ? "Remaining" : "Change"}
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${totalPaid < finalTotal ? "text-destructive" : "text-green-600"}`}
                          >
                            {totalPaid < finalTotal
                              ? formatPrice(finalTotal - totalPaid)
                              : formatPrice(totalPaid - finalTotal)}
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Change to Wallet Option */}
                {changeAmount > 0 && form.watch("customerId") && !createDue && (
                  <div className="p-3 border rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-sm">Customer Change</h3>
                        <p className="text-sm text-muted-foreground">
                          Total change: {formatPrice(changeAmount)}
                        </p>
                      </div>
                      <span className="text-green-600 font-medium">
                        {formatPrice(changeAmount)}
                      </span>
                    </div>

                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="addChangeToWallet"
                          checked={addChangeToWallet}
                          onCheckedChange={(checked) => {
                            setAddChangeToWallet(!!checked);
                            if (checked) {
                              // If adding change to wallet, we cannot also add a due
                              setAddToWallet(false);
                              // Initialize with full change amount
                              setWalletChangeAmount(changeAmount);
                            } else {
                              setWalletChangeAmount(0);
                            }
                          }}
                        />
                        <Label htmlFor="addChangeToWallet" className="text-sm">
                          Add change to customer wallet as credit
                        </Label>
                      </div>

                      {addChangeToWallet && (
                        <div className="pl-6 space-y-2">
                          <div>
                            <Label
                              htmlFor="walletChangeAmount"
                              className="text-xs"
                            >
                              Amount to add to wallet:
                            </Label>
                            <div className="flex space-x-2">
                              <Input
                                id="walletChangeAmount"
                                type="number"
                                min="0"
                                max={changeAmount}
                                value={walletChangeAmount}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value) || 0;
                                  // Ensure value doesn't exceed change amount
                                  setWalletChangeAmount(
                                    value <= changeAmount ? value : changeAmount
                                  );
                                }}
                                className="h-8 text-sm"
                              />
                              <Button
                                type="button"
                                size="sm"
                                onClick={() =>
                                  setWalletChangeAmount(changeAmount)
                                }
                                variant="outline"
                                className="h-8 text-xs"
                              >
                                Max
                              </Button>
                            </div>
                          </div>

                          <div className="flex justify-between text-xs p-2 rounded-md">
                            <span>Credit to Wallet:</span>
                            <span className="font-medium">
                              {formatPrice(walletChangeAmount)}
                            </span>
                          </div>

                          <div className="flex justify-between text-xs bg-background p-2 rounded-md">
                            <span>Cash Change to Return:</span>
                            <span className="font-medium">
                              {formatPrice(physicalChangeAmount)}
                            </span>
                          </div>

                          <div className="p-2 rounded-md text-blue-800 text-green-600 text-sm">
                            <p>
                              The selected amount (
                              {formatPrice(walletChangeAmount)}) will be added
                              as credit to the customer's wallet.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Add payment form */}
                {addingPayment ? (
                  <div className="border rounded-md p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Add Payment</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setAddingPayment(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Payment Method</Label>
                        <div className="flex space-x-2 mt-1">
                          <Button
                            type="button"
                            variant={
                              selectedPaymentMethod === "CASH"
                                ? "default"
                                : "outline"
                            }
                            className="flex-1"
                            onClick={() => setSelectedPaymentMethod("CASH")}
                          >
                            <Banknote className="mr-2 h-4 w-4" />
                            Cash
                          </Button>
                          <Button
                            type="button"
                            variant={
                              selectedPaymentMethod === "CARD"
                                ? "default"
                                : "outline"
                            }
                            className="flex-1"
                            onClick={() => setSelectedPaymentMethod("CARD")}
                          >
                            <CreditCard className="mr-2 h-4 w-4" />
                            Card
                          </Button>
                          <Button
                            type="button"
                            variant={
                              selectedPaymentMethod === "WALLET"
                                ? "default"
                                : "outline"
                            }
                            className="flex-1"
                            onClick={() => setSelectedPaymentMethod("WALLET")}
                            disabled={
                              !walletBalance ||
                              (walletBalance?.balance || 0) <= 0
                            }
                          >
                            <Wallet className="mr-2 h-4 w-4" />
                            Wallet
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="paymentAmount">Amount</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            id="paymentAmount"
                            type="number"
                            min="0"
                            step="0.01"
                            value={currentPaymentAmount}
                            onChange={(e) =>
                              setCurrentPaymentAmount(
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            onClick={() =>
                              setCurrentPaymentAmount(remainingToPay)
                            }
                          >
                            Full Amount
                          </Button>
                        </div>
                      </div>

                      {/* Quick amount buttons */}
                      {selectedPaymentMethod === "CASH" && (
                        <div className="flex flex-wrap gap-2">
                          {[1000, 2000, 5000, 10000].map((amount) => (
                            <Button
                              key={amount}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPaymentAmount(amount)}
                            >
                              {formatPrice(amount)}
                            </Button>
                          ))}
                        </div>
                      )}

                      {/* Handle wallet-related conditional checks safely */}
                      {selectedPaymentMethod === "WALLET" && walletBalance && (
                        <div className="p-3 border rounded-md">
                          <div className="flex justify-between text-sm">
                            <span>Available Balance:</span>
                            <span className="font-medium">
                              {formatPrice(
                                Math.max(0, walletBalance?.balance || 0)
                              )}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button
                        type="button"
                        onClick={addPayment}
                        disabled={currentPaymentAmount <= 0}
                      >
                        Add Payment
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setAddingPayment(true)}
                      className="w-full"
                      disabled={
                        // Enable when:
                        // 1. There's a remaining amount to pay from added items, OR
                        // 2. A customer with negative wallet balance is selected (has existing due)
                        !(
                          remainingToPay > 0 ||
                          (walletBalance && walletBalance.balance < 0)
                        )
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {selectedItems.length === 0 &&
                      walletBalance &&
                      walletBalance.balance < 0
                        ? "Add Payment for Due"
                        : "Add Payment Method"}
                    </Button>
                  </div>
                )}

                {/* Due Amount Handling */}
                {remainingToPay > 0 &&
                  form.watch("customerId") &&
                  !createDue &&
                  !addingPayment &&
                  payments.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="addToWallet"
                          checked={addToWallet}
                          onCheckedChange={(checked) =>
                            setAddToWallet(!!checked)
                          }
                        />
                        <Label htmlFor="addToWallet" className="text-sm">
                          Add remaining {formatPrice(remainingToPay)} to
                          customer wallet as due
                        </Label>
                      </div>
                    </div>
                  )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Order Summary and Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Discount */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          value={field.value || 0}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Ensure Select components have defined values */}
                <FormField
                  control={form.control}
                  name="discountType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value || "FIXED"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="FIXED">
                            Fixed Amount (Rs)
                          </SelectItem>
                          <SelectItem value="PERCENTAGE">
                            Percentage (%)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Order Totals */}
              <div className="bg-card border rounded-md p-4 mt-4 space-y-3">
                <div className="flex justify-between py-1 text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between py-1 text-sm">
                  <span className="text-muted-foreground">
                    Discount (
                    {discountType === "PERCENTAGE"
                      ? `${discount}%`
                      : formatPrice(discount)}
                    ):
                  </span>
                  <span className="font-medium text-destructive">
                    -{formatPrice(discountAmount)}
                  </span>
                </div>

                {duePaidAmount > 0 && (
                  <div className="flex justify-between py-1 text-sm">
                    <span className="text-muted-foreground">
                      Previous Balance Due:
                    </span>
                    <span className="font-medium">
                      {formatPrice(duePaidAmount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between py-1 font-medium text-lg border-t mt-2 pt-2">
                  <span>Total:</span>
                  <span className="text-primary">
                    {formatPrice(finalTotal)}
                  </span>
                </div>

                {totalPaid > 0 && (
                  <div className="flex justify-between py-1 text-sm">
                    <span className="text-muted-foreground">Total Paid:</span>
                    <span className="font-medium">
                      {formatPrice(totalPaid)}
                    </span>
                  </div>
                )}

                {addChangeToWallet && walletChangeAmount > 0 && (
                  <div className="flex justify-between py-1 text-sm rounded-md p-2 mt-1">
                    <span>Change to wallet credit:</span>
                    <span className="font-medium text-green-600">
                      {formatPrice(walletChangeAmount)}
                    </span>
                  </div>
                )}

                {physicalChangeAmount > 0 && (
                  <div className="flex justify-between py-1 text-sm bg-background border rounded-md p-2 mt-1">
                    <span>Cash change to return:</span>
                    <span className="font-medium">
                      {formatPrice(physicalChangeAmount)}
                    </span>
                  </div>
                )}

                {(form.watch("extraWalletAmount") ?? 0) < 0 && (
                  <div className="flex justify-between py-1 text-sm bg-destructive/10 rounded-md p-2 mt-1">
                    <span>Amount to be added as due:</span>
                    <span className="font-medium">
                      {formatPrice(
                        Math.abs(form.watch("extraWalletAmount") ?? 0)
                      )}
                    </span>
                  </div>
                )}

                {/* Handle other wallet credit scenarios not covered by the change interface */}
                {(form.watch("extraWalletAmount") ?? 0) > 0 &&
                  !addChangeToWallet && (
                    <div className="flex justify-between py-1 text-sm rounded-md p-2 mt-1">
                      <span>Amount to be added as credit:</span>
                      <span className="font-medium text-green-600">
                        {formatPrice(form.watch("extraWalletAmount") ?? 0)}
                      </span>
                    </div>
                  )}
              </div>

              {/* Options */}
              <div className="flex items-center space-x-4 mt-4">
                <FormField
                  control={form.control}
                  name="draft"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Save as Draft</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sendReceiptEmail"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={!form.watch("customerEmail")}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Send Receipt Email</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Add order note field */}
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Note</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any notes about this order..."
                          className="resize-none"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/orders")}
            >
              Cancel
            </Button>

            {/* Conditional rendering for due payment button */}
            {walletBalance &&
            walletBalance.balance < 0 &&
            selectedItems.length === 0 &&
            payments.length > 0 ? (
              <Button
                type="button"
                onClick={handleDuePaymentSubmit}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">⏳</span> Processing...
                  </span>
                ) : (
                  <>
                    Pay Due (
                    {formatPrice(
                      payments.reduce((sum, p) => sum + p.amount, 0)
                    )}
                    )
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  (selectedItems.length === 0 &&
                    !(
                      form.watch("customerId") &&
                      walletBalance &&
                      walletBalance.balance < 0 &&
                      payments.length > 0
                    )) ||
                  (!createDue &&
                    !sufficientPaymentForNewItems &&
                    !addToWallet &&
                    !addChangeToWallet)
                }
                title={
                  selectedItems.length === 0 &&
                  !(
                    form.watch("customerId") &&
                    walletBalance &&
                    walletBalance.balance < 0 &&
                    payments.length > 0
                  )
                    ? "Add items or select a customer with existing due to make a payment"
                    : !createDue &&
                        !sufficientPaymentForNewItems &&
                        !addToWallet &&
                        !addChangeToWallet &&
                        !(
                          walletBalance &&
                          walletBalance.balance < 0 &&
                          selectedItems.length === 0
                        )
                      ? "Either pay the full amount for new items, create a due, or add remaining as due to wallet"
                      : ""
                }
              >
                {isSubmitting
                  ? "Processing..."
                  : createDue
                    ? "Create Due Order"
                    : addChangeToWallet
                      ? "Create Order & Add Credit"
                      : "Create Order"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
