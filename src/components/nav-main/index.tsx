"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/app/contexts/AuthContext";
import { static_route_type, static_routes } from "@/lib/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type ActionPermissions = {
  create: boolean;
  delete: boolean;
  edit: boolean;
  list: boolean;
};

type SubMenu = {
  menuName: string;
  actions: ActionPermissions;
};

type MenuItem = {
  menuName: string;
  subMenus?: SubMenu[];
  actions?: ActionPermissions;
};

type MenuData = MenuItem[];

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [sidebarItems, setSidebarItems] = useState<any[]>([]);
  const { permissions } = useAuth();

  useEffect(() => {
    const filteredItems = transformPermissionsToSidebarItems(
      permissions,
      items
    );
    setSidebarItems(filteredItems);
  }, [items, permissions]);

  function transformPermissionsToSidebarItems(
    permissions: MenuData,
    originalSidebarItems: {
      title: string;
      url: string;
      icon?: LucideIcon;
      items?: { title: string; url: string }[];
    }[]
  ) {
    return permissions
      .filter(
        (menu) =>
          menu.actions?.list === true ||
          menu.subMenus?.some((subMenu) => subMenu.actions.list === true)
      )
      .map((menu) => {
        // Find the corresponding menu in the original sidebar items
        const originalMenu = originalSidebarItems.find(
          (item) => item.title.toLowerCase() === menu.menuName.toLowerCase()
        );

        return {
          title: menu.menuName,
          url: `/${menu.menuName.toLowerCase().replace(/\s+/g, '-')}`, // Convert spaces to hyphens
          icon: originalMenu?.icon, // Preserve the icon from the original data
                      items: menu.subMenus
            ?.filter((subMenu) => subMenu.actions.list === true)
            .map((subMenu) => ({
              title: subMenu.menuName,
              url: `/${menu.menuName.toLowerCase().replace(/\s+/g, '-')}/${subMenu.menuName.toLowerCase().replace(/\s+/g, '-')}`, // Convert spaces to hyphens
            })),
        };
      });
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {static_routes.map((route) => (
          <SidebarMenuItem key={route.title}>
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    className={`${
                      pathname === route.url ? " text-primary" : ""
                    }`}
                  >
                    <Link href={route.url}>
                      {route.icon && <route.icon />}
                      <span>{route.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                {isCollapsed && !isMobile && (
                  <TooltipContent
                    side="right"
                    className="w-48 p-2 ml-2 bg-sidebar-accent"
                  >
                    <h2 className="sr-only">{route.title}</h2>
                    <div className="flex flex-col py-1 text-primary">
                      <Link
                        key={route.title}
                        href={route.url}
                        className={`px-2 py-1.5 hover:bg-foreground/5 rounded-md ${
                          route.url === pathname
                            ? "bg-primary text-white hover:text-foreground"
                            : ""
                        }`}
                      >
                        {route.title}
                      </Link>
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </SidebarMenuItem>
        ))}

        {/* Permission routes */}
        {sidebarItems.map((item) => {
          const isActive =
            item.url === pathname ||
            item.items?.some((subItem: any) => subItem.url === pathname);

          // Check if the item has subitems
          const hasSubItems = item.items && item.items.length > 0;

          // If no subitems, render a direct link instead of a collapsible
          if (!hasSubItems) {
            return (
              <SidebarMenuItem key={item.title}>
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        asChild
                        className={`${isActive ? "text-primary" : ""}`}
                      >
                        <Link href={item.url}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    {isCollapsed && !isMobile && (
                      <TooltipContent
                        side="right"
                        className="w-48 p-2 ml-2 bg-sidebar-accent"
                      >
                        <h2 className="sr-only">{item.title}</h2>
                        <div className="flex flex-col py-1 text-primary">
                          <Link
                            key={item.title}
                            href={item.url}
                            className={`px-2 py-1.5 hover:bg-foreground/5 rounded-md ${
                              item.url === pathname
                                ? " bg-primary text-white hover:text-foreground"
                                : ""
                            }`}
                          >
                            {item.title}
                          </Link>
                        </div>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </SidebarMenuItem>
            );
          }
          // Otherwise, render a collapsible menu item with subitems
          return (
            <Collapsible
              key={item.title}
              defaultOpen={isActive}
              className="group/collapsible"
            >
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          className={`${isActive ? "text-primary" : ""}`}
                        >
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </CollapsibleTrigger>
                  </TooltipTrigger>

                  {isCollapsed && !isMobile && (
                    <TooltipContent
                      side="right"
                      className="w-48 p-2 ml-2 bg-sidebar-accent"
                    >
                      <h2 className="sr-only">{item.title}</h2>
                      <div className="flex flex-col py-1 text-accent-foreground">
                        <span className="px-2 pt-1 pb-3 font-semibold">
                          {item.title}
                        </span>
                        {item.items.map((subItem: any) => (
                          <Link
                            key={subItem.title}
                            href={subItem.url}
                            className={`px-2 py-1.5 my-0.5 hover:bg-foreground/5 rounded-md ${
                              subItem.url === pathname
                                ? " bg-primary text-white hover:text-foreground"
                                : ""
                            }`}
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items.map((subItem: any) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={subItem.url === pathname}
                      >
                        <Link href={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
