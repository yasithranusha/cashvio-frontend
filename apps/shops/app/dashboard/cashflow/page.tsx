import { Metadata } from "next";
import {
  getShopCashFlow,
  getCustomerDues,
  getUpcomingPayments,
  getShopBaBalance,
} from "@/actions/cashflow";
import { getSelectedShopId } from "@/lib/shop";
import CashflowView from "@/components/cashflow/cashflow-view";

export const metadata: Metadata = {
  title: "Cash Flow | Cashvio",
  description:
    "Monitor your business cash flow, upcoming payments, and financial goals",
};

export default async function CashflowPage() {
  const selectedShopId = await getSelectedShopId();

  if (!selectedShopId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No shop selected. Please select a shop or contact support.</p>
      </div>
    );
  }

  const [
    cashflowData,
    customerDuesData,
    upcomingPaymentsData,
    shopBalanceData,
  ] = await Promise.all([
    getShopCashFlow(selectedShopId),
    getCustomerDues(selectedShopId),
    getUpcomingPayments(selectedShopId),
    getShopBaBalance(selectedShopId),
  ]);

  // Check for errors in any of the data fetches
  if (
    cashflowData.error ||
    customerDuesData.error ||
    upcomingPaymentsData.error ||
    shopBalanceData.error
  ) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>
          {cashflowData.error ||
            customerDuesData.error ||
            upcomingPaymentsData.error ||
            shopBalanceData.error ||
            "Failed to load cashflow data"}
        </p>
      </div>
    );
  }

  return (
    <CashflowView
      cashflowData={cashflowData.data!}
      customerDues={customerDuesData.data!}
      upcomingPayments={upcomingPaymentsData.data!}
      shopBalance={shopBalanceData.data!}
      shopId={selectedShopId}
    />
  );
}
