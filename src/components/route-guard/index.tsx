"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { Loader } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

type PermissionType = "list" | "delete" | "edit" | "create" | "read";

interface RouteGuardProps {
  children: React.ReactNode;
  permissionType: PermissionType;
}

export function RouteGuard({ children, permissionType }: RouteGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { permissions } = useAuth();
  const [isAllowed, setIsAllowed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (permissions.length > 0) {
      setIsLoading(false);
      checkPermission();
    } else {
      setIsLoading(true); // Show loading state until permissions are fetched
    }
  }, [permissions, pathname]);

  const checkPermission = () => {
    const parts = pathname.split("/").filter(Boolean);

    // If the route is just "/setting" (no submenu)
    if (parts.length === 1) {
      const mainMenu: any = permissions.find(
        (menu) =>
          menu.menuName.toLowerCase().replace(/\s+/g, "-") ===
          parts[0]?.toLowerCase().replace(/\s+/g, "-")
      );

      // If the main menu doesn't exist, redirect to /not-found
      if (!mainMenu) {
        router.push("/not-found");
        setIsAllowed(false);
        return;
      }

      // If the permission type is "list" and the user doesn't have list permission, redirect
      if (permissionType === "list" && !mainMenu.actions?.list) {
        router.push("/not-found");
        setIsAllowed(false);
        return;
      }

      // For other permission types (edit, delete, create), allow access if the user has the required permission
      if (permissionType !== "list") {
        setIsAllowed(!!mainMenu.actions?.[permissionType]);
        return;
      }

      // If the main menu exists and has submenus, it's invalid (e.g., /category)
      if (mainMenu.subMenus && mainMenu.subMenus.length > 0) {
        router.push("/not-found");
        setIsAllowed(false);
        return;
      }

      // If all checks pass, allow access (e.g., /setting)
      setIsAllowed(true);
      return;
    }

    // If the route has a submenu (e.g., /category/new_product)
    if (parts.length === 2) {
      const mainMenu = permissions.find(
        (menu) =>
          menu.menuName.toLowerCase().replace(/\s+/g, "-") ===
          parts[0]?.toLowerCase().replace(/\s+/g, "-")
      );

      // Ensure the main menu has submenus
      if (!mainMenu || !mainMenu.subMenus || mainMenu.subMenus.length === 0) {
        router.push("/not-found");
        setIsAllowed(false);
        return;
      }

      // Check if the submenu exists
      const subMenu: any = mainMenu.subMenus.find(
        (sub) =>
          sub.menuName.toLowerCase().replace(/\s+/g, "-") ===
          parts[1]?.toLowerCase().replace(/\s+/g, "-")
      );

      // If the submenu doesn't exist, redirect to /not-found
      if (!subMenu) {
        router.push("/not-found");
        setIsAllowed(false);
        return;
      }

      // If the permission type is "list" and the user doesn't have list permission, redirect
      if (permissionType === "list" && !subMenu.actions.list) {
        router.push("/not-found");
        setIsAllowed(false);
        return;
      }

      // For other permission types (edit, delete, create,read), allow access if the user has the required permission
      if (permissionType !== "list") {
        setIsAllowed(!!subMenu.actions[permissionType]);
        return;
      }

      // If all checks pass, allow access (e.g., /category/new_product)
      setIsAllowed(true);
      return;
    }

    // If the route doesn't match any valid pattern, redirect to /not-found
    router.push("/not-found");
    setIsAllowed(false);
  };

  if (isLoading) {
    return (
      <>
        {permissionType === "list" ? (
          <div className="flex h-[80vh] items-center justify-center w-full px-16">
            <DotLottieReact
              loop
              src="/loading.json"
              autoplay
              className="w-[80px] h-[80px]"
            />
          </div>
        ) : (
          <Loader className="h-4 w-4 animate-spin" />
        )}
      </>
    );
  }

  if (isAllowed) {
    return <>{children}</>;
  }

  return null;
}
