"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, Store } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import { ISessionUser, IShop } from "@workspace/ui/types/user";
import { setSelectedShopId } from "@/lib/shop";
import { BRAND } from "@workspace/ui/data/brand";

export function ShopSwitcher({
  user,
  selectedShopId,
}: {
  user: ISessionUser;
  selectedShopId: string | null;
}) {
  const { isMobile, open } = useSidebar();
  const router = useRouter();
  const shops = user.shops || [];

  // Find the active shop based on the selectedShopId
  const activeShop =
    shops.find((shop) => shop.id === selectedShopId) || shops[0];

  if (!activeShop || !shops.length) {
    return null;
  }

  const handleShopChange = async (shopId: string) => {
    await setSelectedShopId(shopId);
    router.refresh();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              tooltip={`Switch Shop`}
              className={`cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ${!open ? "bg-sidebar-primary" : ""}`}
            >
              <div
                className={`flex aspect-square size-8 items-center justify-center rounded-lg ${open ? "bg-sidebar-primary" : ""} text-sidebar-primary-foreground overflow-hidden`}
              >
                {activeShop.shopLogo ? (
                  <Image
                    src={activeShop.shopLogo}
                    alt={activeShop.businessName}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                ) : (
                  <Store className="size-4" />
                )}
              </div>
              {open && (
                <>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {activeShop.businessName}
                    </span>
                    <span className="truncate text-xs">
                      {activeShop.id === user.defaultShopId
                        ? "Default"
                        : "Shop"}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Your Shops
            </DropdownMenuLabel>
            {shops.map((shop) => (
              <DropdownMenuItem
                key={shop.id}
                onClick={() => handleShopChange(shop.id)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border overflow-hidden">
                  {shop.shopLogo ? (
                    <Image
                      src={shop.shopLogo}
                      alt={shop.businessName}
                      width={24}
                      height={24}
                      className="object-cover"
                    />
                  ) : (
                    <Store className="size-4 shrink-0" />
                  )}
                </div>
                <div className="flex-1 truncate">{shop.businessName}</div>

                {shop.id === user.defaultShopId && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    Default
                  </span>
                )}
              </DropdownMenuItem>
            ))}
            {user.role === "SHOP_OWNER" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 p-2"
                  onClick={() => router.push("/dashboard/shops/new")}
                >
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">
                    Add shop
                  </div>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
