import { Role } from "@workspace/ui/enum/user.enum";
import { TlinkTarget } from "@workspace/ui/types/common";
import { type LucideIcon as TLucideIcon } from "lucide-react";

interface IBaseRoute {
  title: string;
  url: string;
  linkTarget?: TlinkTarget;
}

export interface IClientRoute extends IBaseRoute {
  showOnlyOn?:"navbar" | "footer";
}

export interface IBaseMenuItem extends IBaseRoute {
  icon?: TLucideIcon;
  onlyForRoles?: Role[];
}

export interface ISubMenuItem extends IBaseMenuItem {
  seperator?: boolean;
}

export interface IMenueItem extends IBaseMenuItem {
  items?: ISubMenuItem[];
}
