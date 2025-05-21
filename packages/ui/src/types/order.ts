
export type TCustomers = {
  id: string;
  name: string;
  email: string;
  dob?: string;
  orderCount: number;
};

export type TCustomerResponse = {
  data: TCustomers[];
}

export type TItems = {
  id: string;
  barcode: string;
  broughtPrice: number;
  sellPrice: number;
  productId: string;
};

export type TProductResponse = {
  data: TProducts[];
}

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
