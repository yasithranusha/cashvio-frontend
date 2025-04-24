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

  // Find the best matching top-level route (pathOne)
  const pathOne = availableRoutes.find((route: IMenueItem) =>
    pathname.startsWith(route.url)
  );

  if (!pathOne?.items?.length) {
    return { pathOne, pathTwo: undefined };
  }

  // For nested paths, search through the items for matches
  // We need to find the most specific match within the submenu items
  let bestMatch: ISubMenuItem | undefined = undefined;
  let bestMatchLength = 0;

  for (const item of pathOne.items) {
    if (pathname === item.url || pathname.startsWith(item.url)) {
      const matchLength = item.url.length;
      if (matchLength > bestMatchLength) {
        bestMatch = item;
        bestMatchLength = matchLength;
      }
    }
  }

  return { pathOne, pathTwo: bestMatch };
};