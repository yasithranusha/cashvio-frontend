"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { MoreHorizontal, Receipt, FileText, Download, ExternalLink } from "lucide-react";
import Link from "next/link";

// Use the Order type defined in order-column.tsx
type Order = {
  id: string;
  date: string;
  storeName: string;
  amount: number;
  status: "Completed" | "Pending" | "Processing" | "Refunded" | "Partially Refunded";
  items?: number;
};

export default function OrderActions({ order }: { order: Order }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
        
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(order.id)}
        >
          Copy order ID
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href={`/orders/${order.id}`}>
            <FileText className="h-4 w-4 mr-2" />
            View order details
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => console.log("Download receipt", order.id)}>
          <Download className="h-4 w-4 mr-2" />
          Download receipt
        </DropdownMenuItem>
        
        {order.status !== "Completed" && order.status !== "Refunded" && (
          <DropdownMenuItem 
            onClick={() => console.log("Track order", order.id)}
            className="text-blue-600 hover:text-blue-800"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Track order status
          </DropdownMenuItem>
        )}
        
        {order.status === "Completed" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/warranty/register/${order.id}`}>
                <Receipt className="h-4 w-4 mr-2" />
                Register warranty
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}