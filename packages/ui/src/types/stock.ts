import { TPaginatedResponse } from "@workspace/ui/types/common";

export type TStockItem = {
  id: string;
  barcode: string;
  broughtPrice: number;
  sellPrice: number;
  productId: string;
  createdAt: string;
  updatedAt: string;
};

export type TStockItemResponse = TPaginatedResponse<TStockItem>;

export type TStockItemCreate = {
  barcode: string;
  broughtPrice: number;
  sellPrice: number;
  productId: string;
};

export type TStockItemUpdate = Partial<TStockItemCreate>;