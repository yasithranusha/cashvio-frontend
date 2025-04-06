import Link from "next/link";
import { clientRoutes } from "@/data/routes/client-routes";

export type NavigationVariant = "navbar" | "footer";

interface NavigationLinksProps {
  className?: string;
  variant: NavigationVariant;
  linkClassName?: string;
}

export const NavigationLinks = ({ className, variant, linkClassName }: NavigationLinksProps) => {
  const filteredRoutes = variant === "navbar"
    ? clientRoutes.filter((item) => !item.showOnlyOn || item.showOnlyOn !== "footer")
    : clientRoutes;
  
  if (variant === "navbar") {
    return (
      <ul className={className}>
        {filteredRoutes.map((item, index) => (
          <li key={index}>
            <Link
              href={item.url}
              className={linkClassName || "text-muted-foreground hover:text-accent-foreground block duration-150"}
            >
              <span>{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    );
  }
  
  return (
    <div className={className || "my-8 flex flex-wrap justify-center gap-6 text-sm"}>
      {filteredRoutes.map((item, index) => (
        <Link
          key={index}
          href={item.url}
          className={linkClassName || "text-muted-foreground hover:text-primary block duration-150"}
        >
          <span>{item.title}</span>
        </Link>
      ))}
    </div>
  );
};