"use server";

import { cookies } from "next/headers";
import { getSession } from "./session";

export async function getSelectedShopId() {
  const selectedShopId = (await cookies()).get("selected-shop")?.value;
  
  if (selectedShopId) {
    return selectedShopId;
  }
  
  // If no selection in cookie, use default shop from session
  const session = await getSession();
  if (session?.user?.defaultShopId) {
    await setSelectedShopId(session.user.defaultShopId);
    return session.user.defaultShopId;
  }
  
  // If no default shop, try to use the first shop from shops array
  if (session?.user?.shops && session.user.shops.length > 0) {
    const firstShopId = session.user.shops[0]?.id;
    if (firstShopId) {
      await setSelectedShopId(firstShopId);
      return firstShopId;
    }
  }
  
  return null;
}

export async function setSelectedShopId(shopId: string) {
  // Setting cookie with the pattern used in session.ts
  (await cookies()).set("selected-shop", shopId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return shopId;
}

export async function clearSelectedShop() {
  // Deleting cookie with the pattern used in session.ts
  (await cookies()).delete("selected-shop");
}