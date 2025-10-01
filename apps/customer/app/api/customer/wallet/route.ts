import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getCustomerOrderHistoryWithWallet } from "@/actions/order";

export async function GET() {
  try {
    // Get the customer ID from the session
    const session = await getSession();
    const customerId = session?.user.id;

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: No valid session found" },
        { status: 401 }
      );
    }

    // Get customer wallet data
    const response = await getCustomerOrderHistoryWithWallet(customerId);

    // Return the response
    if (response.success) {
      return NextResponse.json({
        success: true,
        data: response.data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: response.error || "Failed to fetch wallet data",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in wallet API route:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
