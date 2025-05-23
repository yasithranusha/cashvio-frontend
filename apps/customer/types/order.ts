// Customer information
export interface Customer {
  id: string;
  name: string;
  email: string;
  contactNumber: string | null;
}

// Basic warranty item information
export interface WarrantyItem {
  orderId: string;
  orderNumber: string;
  orderDate: string;
  productName: string;
  warrantyMonths: number;
  warrantyEndDate: string;
  isWarrantyActive: boolean;
}

// Shop-specific warranty data
export interface ShopWarrantyData {
  shopId: string;
  shopName: string;
  shopLogo: string | null;
  warrantyItems: {
    activeWarranty: WarrantyItem[];
    expiredWarranty: WarrantyItem[];
  };
}

// Extended warranty item with shop information
export interface ExtendedWarrantyItem extends WarrantyItem {
  shopId: string;
  shopName: string;
}

// Complete response type
export interface CustomerWarrantyResponse {
  customer: Customer;
  shopData: ShopWarrantyData[];
  allActiveWarranty: ExtendedWarrantyItem[];
  allExpiredWarranty: ExtendedWarrantyItem[];
  activeCount: number;
  expiredCount: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  contactNumber: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shopId: string;
  createdAt: string;
  updatedAt: string;
  displayName: string;
  imageUrls: string[];
  keepingUnits: number;
  warrantyMonths: number;
  loyaltyPoints: number | null;
  supplierId: string;
  categoryId: string;
  subCategoryId: string;
  subSubCategoryId: string;
  status: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  itemId: string;
  quantity: number;
  originalPrice: string | number;
  sellingPrice: string | number;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: string;
  reference: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WalletModifications {
  walletUsed: number;
  duePaid: number;
  extraAdded: number;
  loyaltyGained: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  shopId: string;
  customerId: string;
  status: string;
  subtotal: number;
  discount: number;
  discountType: string;
  total: number;
  paid: number;
  paymentDue: number;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  payments: Payment[];
  items: OrderItem[];
  walletModifications: WalletModifications;
}

export interface Wallet {
  customerId: string;
  shopId: string;
  balance: number;
  loyaltyPoints: number;
  createdAt: string;
  updatedAt: string;
  transactions: any[];
}

export interface OrderHistory {
  wallet: Wallet;
  orders: Order[];
}

export interface ShopData {
  shopId: string;
  shopName: string;
  shopLogo: string | null;
  orderHistory: OrderHistory;
}

export interface CustomerData {
  customer: Customer;
  shopData: ShopData[];
}