import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { permissionKey } from "./key";
import {
  createPermission,
  deletePermission,
  getAllPermissionsByFilter,
  getPermissionById,
  updatePermission,
} from "../services/permission";
import { PermissionFormValues } from "@/app/(root)/setting/permissions/schema/create-permission";



export function useGetAllPermissionsByFilter(
  filters: Record<string, string | number>
) {
  return useQuery({
    queryKey: permissionKey.filters(filters || {}),
    queryFn: () => getAllPermissionsByFilter(filters),
    select: (data) => data.data,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

export function useCreatePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PermissionFormValues) => createPermission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionKey.filters({}) });
    },
  });
}

export function useUpdatePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PermissionFormValues) => updatePermission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionKey.filters({}) });
    },
  });
}

export function useGetPermissionById(id: string | null) {
  return useQuery({
    queryKey: permissionKey.detail(id),
    queryFn: () => {
      if (id) return getPermissionById(id);
    },
    select: (data) => data?.data,
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

export function useDeletePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePermission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionKey.filters({}) });
    },
  });
}
