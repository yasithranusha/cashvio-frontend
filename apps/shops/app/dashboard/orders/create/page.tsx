"use client";

import { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { formatPrice } from "@workspace/ui/lib/utils";
import { TProduct } from "@workspace/ui/types/product";
import { TStockItem } from "@workspace/ui/types/stock";
import { Badge } from "@workspace/ui/components/badge";
import { 
  Search, 
  Plus, 
  Trash2, 
  Percent, 
  Calculator, 
  Receipt,
  UserRound, 
  CreditCard,
  Wallet,
  Banknote,
  ShoppingCart
} from "lucide-react";
import { Textarea } from "@workspace/ui/components/textarea";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Checkbox } from "@workspace/ui/components/checkbox";

// Mock data - in a real application, this would come from API calls
const mockProducts: (TProduct & {stockItems?: TStockItem[]})[] = [
  {
    id: "prod-1",
    name: "Samsung Galaxy S23",
    displayName: "Samsung Galaxy S23 Ultra (256GB)",
    description: "The latest Samsung flagship smartphone with advanced features",
    imageUrls: ["/mock/s23.jpg"],
    status: "ACTIVE",
    keepingUnits: 15,
    categoryId: "cat-1",
    category: { id: "cat-1", name: "Smartphones" },
    shopId: "shop-1",
    supplierId: "supplier-1",
    warrantyMonths: 12,
    subCategoryId: "subcat-1",
    subSubCategoryId: "subsubcat-1",
    stockItems: [
      {
        id: "stock-1",
        productId: "prod-1",
        barcode: "8801643598532",
        broughtPrice: 175000,
        sellPrice: 225000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-2",
    name: "iPhone 15",
    displayName: "Apple iPhone 15 Pro (128GB)",
    description: "Apple's latest smartphone with powerful features",
    imageUrls: ["/mock/iphone15.jpg"],
    status: "ACTIVE",
    keepingUnits: 10,
    categoryId: "cat-1",
    category: { id: "cat-1", name: "Smartphones" },
    shopId: "shop-1",
    supplierId: "supplier-2",
    warrantyMonths: 12,
    subCategoryId: "subcat-1",
    subSubCategoryId: "subsubcat-1",
    stockItems: [
      {
        id: "stock-2",
        productId: "prod-2",
        barcode: "1902394561234",
        broughtPrice: 200000,
        sellPrice: 249900,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-3",
    name: "Sony Headphones",
    displayName: "Sony WH-1000XM5",
    description: "Premium noise-cancelling headphones",
    imageUrls: ["/mock/sony.jpg"],
    status: "ACTIVE",
    keepingUnits: 20,
    categoryId: "cat-2",
    category: { id: "cat-2", name: "Audio" },
    shopId: "shop-1",
    supplierId: "supplier-3",
    warrantyMonths: 6,
    subCategoryId: "subcat-2",
    subSubCategoryId: "subsubcat-2",
    stockItems: [
      {
        id: "stock-3",
        productId: "prod-3",
        barcode: "4548736067479",
        broughtPrice: 65000,
        sellPrice: 85000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-4",
    name: "USB-C Cable",
    displayName: "Fast Charging USB-C Cable",
    description: "High-quality charging cable with fast charging support",
    imageUrls: ["/mock/usbc.jpg"],
    status: "ACTIVE",
    keepingUnits: 50,
    categoryId: "cat-3",
    category: { id: "cat-3", name: "Accessories" },
    shopId: "shop-1",
    supplierId: "supplier-4",
    warrantyMonths: 3,
    subCategoryId: "subcat-3",
    subSubCategoryId: "subsubcat-3",
    stockItems: [
      {
        id: "stock-4",
        productId: "prod-4",
        barcode: "6923450657432",
        broughtPrice: 1500,
        sellPrice: 2500,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Order item type for the cart
type OrderItem = {
  id: string;
  product: TProduct;
  stockItem: TStockItem;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
};

// Schema for order form
const OrderSchema = z.object({
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  customerEmail: z.string().email().optional().or(z.literal('')),
  paymentMethod: z.string(),
  receiptNumber: z.string(),
  subTotal: z.number(),
  discount: z.number().min(0),
  discountType: z.enum(['percentage', 'fixed']),
  tax: z.number().min(0),
  total: z.number(),
  amountPaid: z.number().min(0),
  change: z.number(),
  notes: z.string().optional(),
  saveCustomer: z.boolean().optional(),
});

type OrderFormValues = z.infer<typeof OrderSchema>;

export default function CreateOrderPage() {
  const [isPending, startTransition] = useTransition();
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<(TProduct & {stockItems?: TStockItem[]})[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Generate receipt number (would typically be from backend)
  const receiptNumber = `R${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      paymentMethod: "cash",
      receiptNumber,
      subTotal: 0,
      discount: 0,
      discountType: "percentage",
      tax: 0,
      total: 0,
      amountPaid: 0,
      change: 0,
      notes: "",
      saveCustomer: false,
    },
  });

  // Calculate totals
  const subTotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const discountType = form.watch("discountType");
  const discountAmount = form.watch("discount") || 0;
  const taxRate = form.watch("tax") || 0;
  
  // Calculate final discount amount
  const finalDiscount = discountType === "percentage" 
    ? (subTotal * (discountAmount / 100)) 
    : discountAmount;
  
  // Calculate tax amount
  const taxAmount = ((subTotal - finalDiscount) * (taxRate / 100));
  
  // Calculate total
  const totalAmount = subTotal - finalDiscount + taxAmount;
  
  // Calculate change
  const amountPaid = form.watch("amountPaid") || 0;
  const change = Math.max(0, amountPaid - totalAmount);

  // Update form values when totals change
  useEffect(() => {
    form.setValue("subTotal", subTotal);
    form.setValue("total", totalAmount);
    form.setValue("change", change);
  }, [subTotal, finalDiscount, taxAmount, totalAmount, change, form]);

  // Handle search for products
  useEffect(() => {
    if (searchTerm) {
      const results = mockProducts.filter((product) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchLower) ||
          product.displayName.toLowerCase().includes(searchLower) ||
          product.stockItems?.some(item => item.barcode.includes(searchLower))
        );
      });
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  // Add item to cart
  const addToCart = (product: TProduct, stockItem: TStockItem) => {
    // Check if item is already in cart
    const existingItem = cartItems.find(item => item.stockItem.id === stockItem.id);
    
    if (existingItem) {
      // Update quantity if already in cart
      const updatedCart = cartItems.map(item => {
        if (item.stockItem.id === stockItem.id) {
          const newQuantity = item.quantity + 1;
          const newTotal = newQuantity * stockItem.sellPrice;
          return {
            ...item,
            quantity: newQuantity,
            total: newTotal,
          };
        }
        return item;
      });
      setCartItems(updatedCart);
    } else {
      // Add as new item
      const newItem: OrderItem = {
        id: `cart-${Date.now()}`,
        product,
        stockItem,
        quantity: 1,
        unitPrice: stockItem.sellPrice,
        discount: 0,
        total: stockItem.sellPrice,
      };
      setCartItems([...cartItems, newItem]);
    }
    
    setIsSearchOpen(false);
    setSearchTerm("");
  };

  // Update item quantity
  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    const updatedCart = cartItems.map(item => {
      if (item.id === itemId) {
        const newTotal = (quantity * item.unitPrice) - item.discount;
        return {
          ...item,
          quantity,
          total: newTotal,
        };
      }
      return item;
    });
    
    setCartItems(updatedCart);
  };

  // Update item discount
  const updateItemDiscount = (itemId: string, discount: number, isPercentage: boolean) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === itemId) {
        let discountAmount = discount;
        if (isPercentage) {
          discountAmount = (item.quantity * item.unitPrice) * (discount / 100);
        }
        
        const newTotal = (item.quantity * item.unitPrice) - discountAmount;
        
        return {
          ...item,
          discount: discountAmount,
          total: newTotal,
        };
      }
      return item;
    });
    
    setCartItems(updatedCart);
  };

  // Remove item from cart
  const removeItem = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Handle payment method change
  const handlePaymentMethodChange = (value: string) => {
    form.setValue("paymentMethod", value);
    
    // Reset change amount for non-cash payments
    if (value !== "cash") {
      form.setValue("amountPaid", totalAmount);
      form.setValue("change", 0);
    }
  };

  // Handle cash amount paid change
  const handleAmountPaidChange = (value: number) => {
    form.setValue("amountPaid", value);
    form.setValue("change", Math.max(0, value - totalAmount));
  };

  // Handle form submission
  const onSubmit = (values: OrderFormValues) => {
    if (cartItems.length === 0) {
      toast.error("Cannot create order with empty cart");
      return;
    }

    // In a real app, this would call an API endpoint
    const orderData = {
      ...values,
      items: cartItems,
      date: new Date(),
      cashier: "John Doe", // Would come from auth context in real app
    };
    
    const promise = () => new Promise((resolve) => {
      startTransition(() => {
        // Simulate API call delay
        setTimeout(() => {
          resolve(orderData);
          // Clear form and cart after successful submission
          clearCart();
          form.reset({
            ...form.getValues(),
            customerName: "",
            customerPhone: "",
            customerEmail: "",
            paymentMethod: "cash",
            receiptNumber: `R${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            discount: 0,
            tax: 0,
            notes: "",
            saveCustomer: false,
            amountPaid: 0,
            change: 0,
          });
        }, 1000);
      });
    });

    toast.promise(promise, {
      loading: "Processing transaction...",
      success: "Transaction completed successfully!",
      error: "Failed to process transaction",
    });
  };

  // Quick amount buttons for cash payments
  const QuickAmountButtons = () => (
    <div className="flex flex-wrap gap-2 mt-2">
      {[500, 1000, 5000, 10000].map(amount => (
        <Button 
          key={amount} 
          variant="outline" 
          size="sm"
          type="button"
          onClick={() => handleAmountPaidChange(amount)}
        >
          {formatPrice(amount)}
        </Button>
      ))}
      <Button 
        variant="outline" 
        size="sm"
        type="button"
        onClick={() => handleAmountPaidChange(Math.ceil(totalAmount / 100) * 100)}
      >
        Exact
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Order</h1>
        <p className="text-muted-foreground">Complete the transaction by adding products and processing payment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Product Selection and Cart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Search Bar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Product Search
              </CardTitle>
              <CardDescription>
                Search products by name or scan barcode
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Search products or scan barcode..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onClick={() => setIsSearchOpen(true)}
                      className="w-full"
                    />
                  </div>
                  <Button onClick={() => setIsSearchOpen(true)}>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>

                {/* Search Results Dialog */}
                <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
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
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full mb-4"
                        autoFocus
                      />
                      <ScrollArea className="h-[400px]">
                        {searchResults.length > 0 ? (
                          <div className="grid grid-cols-1 gap-4">
                            {searchResults.map((product) => (
                              product.stockItems?.map((stockItem) => (
                                <Card key={stockItem.id} className="overflow-hidden">
                                  <div className="flex">
                                    <div className="w-20 h-20 relative flex-shrink-0">
                                      {product.imageUrls && product.imageUrls.length > 0 ? (
                                        <div className="h-full w-full bg-muted flex items-center justify-center">
                                          <span className="text-xs text-muted-foreground">Image</span>
                                        </div>
                                      ) : (
                                        <div className="h-full w-full bg-muted flex items-center justify-center">
                                          <span className="text-xs text-muted-foreground">No image</span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="p-3 flex-1">
                                      <h3 className="font-medium line-clamp-1">
                                        {product.displayName}
                                      </h3>
                                      <div className="flex justify-between items-center mt-1">
                                        <p className="text-sm text-muted-foreground">
                                          {stockItem.barcode}
                                        </p>
                                        <Badge variant={product.keepingUnits > 0 ? "default" : "destructive"}>
                                          {product.keepingUnits > 0 ? `In stock: ${product.keepingUnits}` : "Out of stock"}
                                        </Badge>
                                      </div>
                                      <div className="flex justify-between items-center mt-2">
                                        <p className="font-bold">
                                          {formatPrice(stockItem.sellPrice)}
                                        </p>
                                        <Button 
                                          size="sm" 
                                          onClick={() => addToCart(product, stockItem)}
                                          disabled={product.keepingUnits <= 0}
                                        >
                                          <Plus className="h-4 w-4 mr-1" />
                                          Add
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </Card>
                              ))
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-10">
                            <p className="text-muted-foreground">
                              {searchTerm ? "No products found. Try a different search term." : "Type to search for products"}
                            </p>
                          </div>
                        )}
                      </ScrollArea>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsSearchOpen(false)}>
                        Close
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Shopping Cart */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Cart Items ({cartItems.length})
                </CardTitle>
                {cartItems.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearCart}
                    className="h-8"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {cartItems.length > 0 ? (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Discount</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.product.displayName}</div>
                              <div className="text-xs text-muted-foreground">{item.stockItem.barcode}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {formatPrice(item.unitPrice)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end">
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 1)}
                                className="w-16 text-right"
                                min="1"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-full flex justify-between">
                                  <span>{item.discount > 0 ? formatPrice(item.discount) : "-"}</span>
                                  <Percent className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-sm">
                                <DialogHeader>
                                  <DialogTitle>Apply Item Discount</DialogTitle>
                                  <DialogDescription>
                                    Item: {item.product.displayName}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                      <Input 
                                        type="number" 
                                        placeholder="Discount amount"
                                        min="0"
                                        step="0.01"
                                        id={`discount-${item.id}`}
                                        defaultValue={item.discount}
                                      />
                                      <Select defaultValue="percentage">
                                        <SelectTrigger className="w-[120px]">
                                          <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="percentage">Percentage</SelectItem>
                                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                      {[5, 10, 15, 20].map((percent) => (
                                        <Button
                                          key={percent}
                                          type="button"
                                          variant="outline"
                                          className="text-xs"
                                          onClick={() => {
                                            const input = document.getElementById(`discount-${item.id}`) as HTMLInputElement;
                                            input.value = percent.toString();
                                          }}
                                        >
                                          {percent}%
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" type="button">Cancel</Button>
                                  <Button type="button" onClick={() => {
                                    const input = document.getElementById(`discount-${item.id}`) as HTMLInputElement;
                                    const discount = parseFloat(input.value);
                                    const select = input.nextElementSibling?.querySelector('select');
                                    const isPercentage = select?.value === 'percentage';
                                    updateItemDiscount(item.id, discount, isPercentage);
                                  }}>
                                    Apply Discount
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatPrice(item.total)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={4} className="text-right">
                          Subtotal
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(subTotal)}
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center border rounded-md">
                  <ShoppingCart className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No items in cart</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Search for products to add them to the order
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Payment Processing */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Receipt className="h-5 w-5 mr-2" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Receipt Number */}
                <FormField
                  control={form.control}
                  name="receiptNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receipt Number</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly />
                      </FormControl>
                    </FormItem>
                  )}
                />

               

                {/* Customer Info Section */}
                <Card className="bg-muted/30 border-dashed">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center">
                      <UserRound className="h-4 w-4 mr-2" />
                      Customer Information (Optional)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Customer name" />
                          </FormControl>
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
                            <Input {...field} placeholder="Phone number" />
                          </FormControl>
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
                            <Input {...field} placeholder="Email address" type="email" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="saveCustomer"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Save customer for future orders</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Order Total Calculation */}
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center">
                      <Calculator className="h-4 w-4 mr-2" />
                      Order Total
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span>{formatPrice(subTotal)}</span>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm items-center mb-1">
                        <span className="text-muted-foreground">Discount:</span>
                        <div className="flex items-center space-x-2">
                          <FormField
                            control={form.control}
                            name="discountType"
                            render={({ field }) => (
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="h-8 w-[110px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="percentage">Percentage</SelectItem>
                                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="discount"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="h-8 w-[90px] text-right"
                                    value={field.value || ""}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      {/* Quick discount buttons */}
                      {discountType === "percentage" && (
                        <div className="flex gap-1 justify-end mb-2">
                          {[5, 10, 15, 20].map(percent => (
                            <Button
                              key={percent}
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-6 text-xs px-2"
                              onClick={() => form.setValue("discount", percent)}
                            >
                              {percent}%
                            </Button>
                          ))}
                        </div>
                      )}
                      
                      {finalDiscount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Discount amount:</span>
                          <span className="text-green-600">-{formatPrice(finalDiscount)}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between text-sm items-center">
                        <span className="text-muted-foreground">Tax:</span>
                        <div className="flex items-center space-x-2">
                          <FormField
                            control={form.control}
                            name="tax"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="flex items-center">
                                    <Input
                                      {...field}
                                      type="number"
                                      min="0"
                                      step="0.1"
                                      className="h-8 w-[90px] text-right"
                                      value={field.value || ""}
                                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    />
                                    <span className="ml-2">%</span>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      {taxAmount > 0 && (
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-muted-foreground">Tax amount:</span>
                          <span>{formatPrice(taxAmount)}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex justify-between font-medium text-base">
                        <span>Total:</span>
                        <span>{formatPrice(totalAmount)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <FormControl>
                        <Tabs
                          defaultValue={field.value}
                          onValueChange={handlePaymentMethodChange}
                          className="w-full"
                        >
                          <TabsList className="grid grid-cols-3 mb-2">
                            <TabsTrigger value="cash">
                              <Banknote className="h-4 w-4 mr-2" />
                              Cash
                            </TabsTrigger>
                            <TabsTrigger value="card">
                              <CreditCard className="h-4 w-4 mr-2" />
                              Card
                            </TabsTrigger>
                            <TabsTrigger value="wallet">
                              <Wallet className="h-4 w-4 mr-2" />
                              Wallet
                            </TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="cash">
                            <Card>
                              <CardContent className="pt-4 space-y-2">
                                <FormField
                                  control={form.control}
                                  name="amountPaid"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Amount Paid</FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          type="number"
                                          min="0"
                                          step="0.01"
                                          value={field.value || ""}
                                          onChange={(e) => handleAmountPaidChange(parseFloat(e.target.value) || 0)}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <QuickAmountButtons />

                                <div className="flex justify-between border-t pt-2 mt-2">
                                  <span className="font-medium">Change:</span>
                                  <span className="font-medium">
                                    {formatPrice(change)}
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          </TabsContent>
                          
                          <TabsContent value="card">
                            <Card>
                              <CardContent className="pt-4">
                                <p className="text-sm">Card payment will be processed for the exact amount.</p>
                              </CardContent>
                            </Card>
                          </TabsContent>
                          
                          <TabsContent value="wallet">
                            <Card>
                              <CardContent className="pt-4">
                                <p className="text-sm">Digital wallet payment will be processed for the exact amount.</p>
                              </CardContent>
                            </Card>
                          </TabsContent>
                        </Tabs>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Notes */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any notes about this order..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isPending || cartItems.length === 0}
                >
                  <Receipt className="mr-2 h-5 w-5" />
                  Complete Sale
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}