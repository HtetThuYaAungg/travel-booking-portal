import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { departmentKey } from "./key";
import {
  createDepartment,
  deleteDepartment,
  getAllCommonDepartmentList,
  getAllDepartmentsByFilter,
  getDepartmentById,
  updateDepartment,
} from "../services/department";
import { DepartmentFormValues } from "@/app/(root)/setting/departments/schema/create-department";

export function useGetAllCommonDepartmentList() {
  return useQuery({
    queryKey: departmentKey.common,
    queryFn: () => getAllCommonDepartmentList(),
    refetchOnWindowFocus: false,
    select: (data) => data.data,
    refetchOnMount: true,
  });
}

export function useGetAllDepartmentsByFilter(
  filters: Record<string, string | number>
) {
  return useQuery({
    queryKey: departmentKey.filters(filters || {}),
    queryFn: () => getAllDepartmentsByFilter(filters),
    select: (data) => data.data,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DepartmentFormValues) => createDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKey.filters({}) });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DepartmentFormValues) => updateDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKey.filters({}) });
    },
  });
}

export function useGetDepartmentById(id: string | null) {
  return useQuery({
    queryKey: departmentKey.detail(id),
    queryFn: () => {
      if (id) return getDepartmentById(id);
    },
    select: (data) => data?.data,
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKey.filters({}) });
    },
  });
}
