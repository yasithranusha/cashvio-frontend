export type CustomerDue = {
  customerId: string;
  customerName: string;
  contactInfo: string;
  balance: number;
  dueAmount: number;
  isDue: boolean;
};

export type CustomerDuesResponse = {
  totalDues: number;
  duesList: CustomerDue[];
  count: number;
};
