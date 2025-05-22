export type TCustomers = {
  id: string;
  name: string;
  email: string;
  dob?: string;
  orderCount: number;
};

export type TCustomerResponse = {
  data: TCustomers[];
};

export type TItems = {
  id: string;
  barcode: string;
  broughtPrice: number;
  sellPrice: number;
  productId: string;
};

export type TProductResponse = {
  data: TProducts[];
};

export type TProducts = {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  imageUrls: string[];
  warrantyMonths?: number;
  loyaltyPoints?: number;
  items: TItems[];
};

// New order API response types
export type TOrderCustomer = {
  id: string;
  name: string;
  email: string;
  contactNumber: string | null;
};

export type TOrderProduct = {
  name: string;
  imageUrls: string[];
};

export type TOrderItem = {
  id: string;
  orderId: string;
  productId: string;
  itemId: string;
  quantity: number;
  originalPrice: number;
  sellingPrice: number;
  createdAt: string;
  updatedAt: string;
  product: TOrderProduct;
};

export type TOrderPayment = {
  id: string;
  orderId: string;
  amount: number;
  method: "CASH" | "CARD" | "WALLET" | "BANK";
  reference: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TOrder = {
  id: string;
  orderNumber: string;
  shopId: string;
  customerId: string | null;
  status: "COMPLETED" | "REFUNDED" | "CANCELLED" | "PENDING";
  subtotal: number;
  discount: number;
  discountType: "FIXED" | "PERCENTAGE";
  total: number;
  paid: number;
  paymentDue: number;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  customer: TOrderCustomer | null;
  orderItems: TOrderItem[];
  payments: TOrderPayment[];
};

export type TOrdersResponse = TOrder[];
