import { IMenueItem, ISubMenuItem } from "@workspace/ui/types/routes";

export const useAdminRoutes = (
  availableRoutes: IMenueItem[],
  pathname: string
) => {
  const pathOne = availableRoutes.find((route: IMenueItem) => 
    pathname.startsWith(route.url)
  );

  const pathTwo = pathOne?.items?.length
    ? pathOne.items.find((route: ISubMenuItem) => 
        pathname === route.url || pathname.startsWith(route.url)
      )
    : undefined;

  return { pathOne, pathTwo };
};