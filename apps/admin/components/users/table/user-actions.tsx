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
import { MoreHorizontal, User, Shield, Key, Ban } from "lucide-react";
import { TUser } from "@workspace/ui/types/user";
import Link from "next/link";

export default function UserActions({ user }: { user: TUser }) {
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
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(user.id)}
        >
          Copy user ID
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => console.log("Edit user", user.id)}>
          <User className="h-4 w-4 mr-2" />
          Edit user details
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => console.log("Reset password", user.id)}>
          <Key className="h-4 w-4 mr-2" />
          Reset password
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href={`/admin-users/permissions/${user.id}`}>
            <Shield className="h-4 w-4 mr-2" />
            Manage permissions
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={() => console.log("Toggle status", user.id)}
          className="text-destructive hover:text-destructive"
        >
          <Ban className="h-4 w-4 mr-2" />
          {user.status === "ACTIVE" ? "Deactivate user" : "Activate user"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}