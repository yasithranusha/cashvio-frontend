import { IMenueItem, ISubMenuItem } from "@workspace/ui/types/routes";

export const useAdminRoutes = (
  availableRoutes: IMenueItem[],
  pathname: string
) => {
  // Find exact match for the current pathname in top-level routes
  const exactMatch = availableRoutes.find((route) => route.url === pathname);

  if (exactMatch && pathname.includes("/") && pathname !== "/dashboard") {
    // Split the path to find the parent route
    const pathParts = pathname.split("/");
    const parentPath = "/" + pathParts[1];

    const parentRoute = availableRoutes.find(
      (route) => route.url === parentPath
    );

    if (parentRoute) {
      return {
        pathOne: parentRoute,
        pathTwo: exactMatch,
      };
    }
  }

  const pathOne = availableRoutes.find((route: IMenueItem) =>
    pathname.startsWith(route.url)
  );

  const pathTwo = pathOne?.items?.length
    ? pathOne.items.find(
        (route: ISubMenuItem) =>
          pathname === route.url || pathname.startsWith(route.url)
      )
    : undefined;

  return { pathOne, pathTwo };
};
