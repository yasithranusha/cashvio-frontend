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
import { MoreHorizontal, FileText, ShieldCheck, FilePlus, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Warranty } from "./warrenty-columns";

export default function WarrantyActions({ warranty }: { warranty: Warranty }) {
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
        <DropdownMenuLabel>Warranty Options</DropdownMenuLabel>
        
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(warranty.id)}
        >
          Copy warranty ID
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href={`/warranty/${warranty.id}`}>
            <FileText className="h-4 w-4 mr-2" />
            View warranty details
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href={`/orders/${warranty.orderReference}`}>
            <FileText className="h-4 w-4 mr-2" />
            View purchase details
          </Link>
        </DropdownMenuItem>
        
        {warranty.status === "Active" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => console.log("Claim warranty", warranty.id)}
              className="text-blue-600 hover:text-blue-800"
            >
              <ShieldCheck className="h-4 w-4 mr-2" />
              File warranty claim
            </DropdownMenuItem>
          </>
        )}
        
        {warranty.status === "Active" && (
          <DropdownMenuItem onClick={() => console.log("Extend warranty", warranty.id)}>
            <FilePlus className="h-4 w-4 mr-2" />
            Extend warranty
          </DropdownMenuItem>
        )}
        
        {warranty.status === "Expired" && (
          <DropdownMenuItem 
            className="text-muted-foreground"
            disabled
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Warranty expired
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}