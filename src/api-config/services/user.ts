import { UserFormValues } from "@/app/(root)/setting/users/schema/create-user";
import apiInstance from "../instance";
import { ApiResponse } from "./type";
import qs from "query-string";
import { UserEditFormValues } from "@/app/(root)/setting/users/schema/edit-user";
import { permission } from 'process';
import { ChangePasswordFormValues } from "@/app/(root)/setting/users/schema/change-password";

// types/user.ts
interface Department {
  id: string;
  department_code: string;
  department_name: string;
}

interface Role {
  id: string;
  role_code: string;
  role_name: string;
}

interface CreatedBy {
  id: string;
  email: string;
  full_name: string;
}

interface UpdatedBy {
  id: string;
  email: string;
  full_name: string;
}

export interface User {
  id: string;
  email: string;
  staff_id: string;
  full_name: string;
  status: string;
  department_id: string;
  role_id: string;
  department: Department;
  role: Role;
  created_by: CreatedBy;
  updated_by: UpdatedBy;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  user_type: string;
}

interface AllUser {
  items: User[];
  total: number;
  page: number;
  limit: number;
}

export function getCurrentLoginUser() {
  return apiInstance.get<ApiResponse<User>>("/user/profile");
}

export function getAllUsersByFilter(filters: Record<string, string | number>) {
  const queryString = qs.stringify(filters, {
    skipNull: true,
    skipEmptyString: true,
  });
  return apiInstance.get<ApiResponse<AllUser>>(`/user/all?${queryString}`);
}

export function createUser(data: UserFormValues) {
  return apiInstance.post("/user/register", data);
}

export function deleteUser(id: string) {
  return apiInstance.delete<ApiResponse<User>>(`/user/${id}`);
}

export function getUserById(id: string) {
  return apiInstance.get<ApiResponse<User>>(`/user/${id}`);
}

export function updateUser(data: UserEditFormValues) {
  return apiInstance.patch(`/user/${data.id}`, data);
}

export function changePassword(data: ChangePasswordFormValues) {
  return apiInstance.post("/user/me/change-password", data);
}
