export type PaymentType = "ONE_TIME" | "RECURRING";

export type UpcomingPayment = {
  id: string;
  description: string;
  amount: string;
  dueDate: string;
  paymentType: PaymentType;
  isPriority: boolean;
  shopId: string;
  createdAt: string;
  updatedAt: string;
};

export type UpcomingPaymentsResponse = {
  data: UpcomingPayment[];
  count: number;
};
