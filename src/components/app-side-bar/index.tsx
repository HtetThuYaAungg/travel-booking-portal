"use client";

import * as React from "react";
import Image from "next/image";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { permission_routes } from "@/lib/constants";
import UWU from "../../../public/logo/uwu.png";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex justify-start items-center gap-3">
          {/* <Image
            width={55}
            height={55}
            src={UWU}
            alt={"uwu logo"}
            priority={false}
            className=" absolute top-0 left-0"
          /> */}
           <h3 className={`font-semibold pt-[7px] text-md text-nowrap ${isCollapsed ? "hidden" : ""}`}>
            Travel Booking Portal
          </h3>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={permission_routes} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
