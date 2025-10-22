import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userKey } from "./key";
import {
  changePassword,
  createUser,
  deleteUser,
  getAllUsersByFilter,
  getCurrentLoginUser,
  getUserById,
  updateUser,
} from "../services/user";
import { UserFormValues } from "@/app/(root)/setting/users/schema/create-user";
import { UserEditFormValues } from "@/app/(root)/setting/users/schema/edit-user";
import { ChangePasswordFormValues } from "@/app/(root)/setting/users/schema/change-password";

export function useGetCurrentLoginUser() {
  return useQuery({
    queryKey: userKey.profile,
    queryFn: () => getCurrentLoginUser(),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useGetAllUsersByFilter(
  filters: Record<string, string | number>
) {
  return useQuery({
    queryKey: userKey.filters(filters || {}),
    queryFn: () => getAllUsersByFilter(filters),
    select: (data) => data.data,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

export function useGetUserById(id: string | null) {
  return useQuery({
    queryKey: userKey.detail(id),
    queryFn: () => {
      if (id) return getUserById(id);
    },
    select: (data) => data?.data,
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserFormValues) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKey.filters({}) });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserEditFormValues) => updateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKey.filters({}) });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKey.filters({}) });
    },
  });
}

export function useForgetPassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ChangePasswordFormValues) => changePassword(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKey.profile });
    },
  });
}
