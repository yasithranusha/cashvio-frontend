import {TPaginatedResponse} from "@workspace/ui/types/common";

export type TSupplier = {
  id: string;
  name: string;
  email?: string;
  contactNumber: string;
  haveWhatsApp: boolean;
  shopId: string;
  createdAt: Date;
  updatedAt: Date;
};


export type TSupplierResponse = TPaginatedResponse<TSupplier>;
