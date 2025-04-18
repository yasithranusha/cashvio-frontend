import { IMenueItem } from "@/data/routes/admin-routes";
import { Role } from "@workspace/ui/enum/user.enum";

export function getAvailableRoutesForRole({
  role,
  routes,
}: {
  role: Role | undefined;
  routes: IMenueItem[];
}): IMenueItem[] {
  // Return empty array if no role which means non-logged in user no dashboard access
  if (!role) return [];

  return routes.reduce<IMenueItem[]>((acc, route) => {
    // Check if route is available for role
    const isRouteAvailable =
      !route.onlyForRoles || route.onlyForRoles.includes(role);

    if (isRouteAvailable) {
      // Filter sub-items if they exist
      const filteredRoute = { ...route };
      if (route.items) {
        filteredRoute.items = route.items.filter(
          (item) => !item.onlyForRoles || item.onlyForRoles.includes(role)
        );
      }
      acc.push(filteredRoute);
    }

    return acc;
  }, []);
}

export function middlewareRouteCheck(
  routes: IMenueItem[],
  pathname: string
): boolean {
  for (const route of routes) {
    // If route matches exactly
    if (pathname === route.url) {
      return true;
    }
    
    // If pathname starts with route url and it's a direct subfolder
    if (pathname.startsWith(route.url + '/')) {
      return true;
    }

    // If has sub-routes, check them
    if (route.items?.length) {
      // Find matching sub-route (exact match or starts with)
      const matchingSubRoute = route.items.find(
        (subRoute) => pathname === subRoute.url || pathname.startsWith(subRoute.url + '/')
      );

      if (matchingSubRoute) {
        return true;
      }
    }
  }
  return false;
}
