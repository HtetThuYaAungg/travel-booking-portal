import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { roleKey } from "./key";
import {
  createRole,
  deleteRole,
  getAllCommonRoleList,
  getAllRolesByFilter,
  getRoleById,
  updateRole,
} from "../services/role";
import { RoleFormValues } from "@/app/(root)/setting/roles/schema/create-role";

export function useGetAllCommonRoleList() {
  return useQuery({
    queryKey: roleKey.common,
    queryFn: () => getAllCommonRoleList(),
    refetchOnWindowFocus: false,
    select: (data) => data.data,
    refetchOnMount: true,
  });
}

export function useGetAllRolesByFilter(
  filters: Record<string, string|number>
) {
  return useQuery({
    queryKey: roleKey.filters(filters || {}),
    queryFn: () => getAllRolesByFilter(filters),
    select: (data) => data.data,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RoleFormValues) => createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKey.filters({}) });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RoleFormValues) => updateRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKey.filters({}) });
    },
  });
}

export function useGetRoleById(id: string | null) {
  return useQuery({
    queryKey: roleKey.detail(id),
    queryFn: () => {
      if (id) return getRoleById(id);
    },
    enabled: !!id,
    select: (data) => data?.data,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKey.filters({}) });
    },
  });
}
