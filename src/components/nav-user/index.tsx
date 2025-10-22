"use client";

import {
  BadgeCheck,
  ChevronsUpDown,
  IdCard,
  LogOut,
  RotateCcwKey,
  Shapes,
  Sparkles,
  User,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useGetCurrentLoginUser } from "@/api-config/queries/user";
import { useMessage } from "@/app/contexts/MessageContext";
import packageJson from "../../../package.json";
import { ToggleMode } from "../toggle-mode";
import { Button } from "../ui/button";
import { useState } from "react";
import ChangePassword from "@/app/(root)/setting/users/change-password";
import { useLogout } from "@/api-config/queries/auth";

export function NavUser() {
  const { isMobile } = useSidebar();
  const message = useMessage();
   const { mutate: logoutApi } = useLogout();
  const { data, isError, error } = useGetCurrentLoginUser();

    const [showForgetPasswordModal, setShowForgetPasswordModal] =
      useState<boolean>(false);

    const handleCloseForgetPasswordModal = () => {
      setShowForgetPasswordModal(false);
    };

  if (isError) {
    message.error(error.message);
  }

  return (
    <>
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="items-start data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5 rounded-lg group-first:hover:text-active">
                  <User />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {data?.data.data.full_name}
                  </span>
                  <span className="truncate text-xs">
                    {data?.data.data.email}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-5 w-5 rounded-lg">
                  <User className="text-active" />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {data?.data.data.full_name}
                  </span>
                  <span className="truncate text-xs">
                    {" "}
                    {data?.data.data.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck className=" text-active opacity-80" />
                {data?.data.data.role.role_name || "root"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Sparkles className=" text-active opacity-80" />
                {data?.data.data.department.department_name || "root"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <IdCard className=" text-active opacity-80" />
                {data?.data.data.staff_id}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Shapes className=" text-active opacity-80" />
                Version: {packageJson.version}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer focus:bg-active"
                  
                onClick={() => setShowForgetPasswordModal(true)}
              >
                <RotateCcwKey className=" text-active opacity-80" />
                Change Password
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className=" flex justify-end group">
                <ToggleMode />
                <Button variant="ghost" size="icon" onClick={()=>logoutApi()}>
                  <LogOut className=" text-destructive" />
                  <span className="sr-only">Log out</span>
                </Button>
              </div>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
    <ChangePassword
        open={showForgetPasswordModal}
        onOpenChange={setShowForgetPasswordModal}
        hideDefaultTrigger={true}
        onSuccess={handleCloseForgetPasswordModal}
      />
    
    </>
  );
}
