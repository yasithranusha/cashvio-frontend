import { NextRequest, NextResponse } from "next/server";
import { getAllAvailableRoutes } from "@/data/routes/admin-routes";
import {
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_NON_AUTHORIZED_REDIRECT,
  DEFAULT_NON_AUTH_REDIRECT,
  authRoutes,
} from "@/data/routes/default-routes";
import { middlewareRouteCheck } from "@/lib/role/functions";
import { getSession } from "@/lib/session";
import { Role } from "@workspace/ui/enum/user.enum";

export default async function middleware(req: NextRequest) {
  const session = await getSession();

  const userRole = session?.user?.role;
  const isAdminRole = userRole === Role.SHOP_OWNER || userRole === Role.SHOP_STAFF;

  const role = isAdminRole ? userRole : undefined;

  const pathname = req.nextUrl.pathname;

  //If the request is for landing page, skip the middleware
  if (pathname === "/") {
    return NextResponse.next();
  }

  // 1. Handle auth routes (login, register, etc.)
  // If user is already logged in, redirect away from auth pages
  if (role && authRoutes.some((route) => pathname === route.url)) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
  }

  // Allow public access to auth routes for non-logged in users
  if (authRoutes.some((route) => pathname === route.url)) {
    return NextResponse.next();
  }

  // 2. Handle non-authenticated users - redirect to login
  if (!session || !role) {
    return NextResponse.redirect(new URL(DEFAULT_NON_AUTH_REDIRECT, req.url));
  }

  // 3. Check route permissions for authenticated users
  const availableRoutes = getAllAvailableRoutes(role);

  // Check if the user has permission for this route
  const hasPermission = middlewareRouteCheck(availableRoutes, pathname);

  if (!hasPermission) {
    return NextResponse.redirect(
      new URL(DEFAULT_NON_AUTHORIZED_REDIRECT, req.url)
    );
  }

  // Allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
