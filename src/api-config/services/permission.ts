import { ApiResponse } from "./type";
import apiInstance from "../instance";
import { PermissionFormValues } from "@/app/(root)/setting/permissions/schema/create-permission";
import qs from "query-string";



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

export interface Permission {
  id: string;
  name: string;
  description?: string;
  module: string;
  action: string;
  created_by: CreatedBy;
  updated_by: UpdatedBy;
  created_at: string;
  updated_at: string;
}

interface AllPermission {
  items: Permission[];
  total: number;
  page: number;
  limit: number;
}


export function getAllPermissionsByFilter(
  filters: Record<string, string | number>
) {
  const queryString = qs.stringify(filters, {
    skipNull: true,
    skipEmptyString: true,
  });
  return apiInstance.get<ApiResponse<AllPermission>>(
    `/permission/all?${queryString}`
  );
}

export function createPermission(data: PermissionFormValues) {
  return apiInstance.post("/permission/new", data);
}

export function deletePermission(id: string) {
  return apiInstance.delete<ApiResponse<Permission>>(`/permission/${id}`);
}

export function updatePermission(data: PermissionFormValues) {
  return apiInstance.patch(`/permission/${data.id}`, data);
}

export function getPermissionById(id: string) {
  return apiInstance.get<ApiResponse<Permission>>(`/permission/${id}`);
}
