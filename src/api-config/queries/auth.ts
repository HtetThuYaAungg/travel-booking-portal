import { useMutation, useQuery } from "@tanstack/react-query";
import { getPermission, login, logout } from "../services/auth";
import { permissionKey } from "./key";
import { removeCookieStore } from "@/helper/store";

export function useLogin() {
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => login(data),
    
  });
}

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      window.location.href = "/login";
      localStorage.clear();
      removeCookieStore(
        process.env.NEXT_PUBLIC_USER_ACCESS_TOKEN as string
      );
      removeCookieStore(
        process.env.NEXT_PUBLIC_USER_REFRESH_TOKEN as string
    );
     
    },
    onError: (error: any) => {
      console.error("Logout failed:", error);
    },
  });
};

export function useGetPermissionByUser(id: string | number) {
  return useQuery({
    queryKey: permissionKey.userPermission,
    queryFn: () => getPermission(),
    enabled : !!id,
    staleTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
