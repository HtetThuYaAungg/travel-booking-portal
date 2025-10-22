"use client";

import { useGetPermissionByUser } from "@/api-config/queries/auth";
import { jwtDecode } from "jwt-decode";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { getCookieStore, removeCookieStore } from "@/helper/store";
import { useMessage } from "./MessageContext";

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

type AuthContextType = {
  permissions: MenuData;
  setPermissions: (permissions: MenuData) => void;
  userId: string | null;
  setUserId: (userId: string | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [permissions, setPermissions] = useState<MenuData>([]);
  const [userId, setUserId] = useState<string | null>("");
  const message = useMessage();

  useEffect(() => {
    async function fetchToken() {
      const token = await getCookieStore(
        process.env.NEXT_PUBLIC_USER_ACCESS_TOKEN as string
      );
      if (token) {
        const decodedToken = jwtDecode<{ sub: string }>(token);
        setUserId(decodedToken.sub || null);
      }
    }
    fetchToken();
  }, []);

  const { data: permission, isError } = useGetPermissionByUser(userId || "");

  useEffect(() => {
    if (permission) {
      setPermissions(permission.data.data);
    }
  }, [permission]);

  useEffect(() => {
    if (isError) {
      message.error("Failed to fetch permissions");
    }
  }, [isError]);

  const logout = async () => {
    await removeCookieStore(
      process.env.NEXT_PUBLIC_USER_ACCESS_TOKEN as string
    );
    await removeCookieStore(
      process.env.NEXT_PUBLIC_USER_REFRESH_TOKEN as string
    );
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{ permissions, setPermissions, setUserId, userId, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
