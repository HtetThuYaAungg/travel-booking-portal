import { ApiResponse } from "./type";
import apiInstance from "../instance";
import qs from "query-string";
import { RoleFormValues } from "@/app/(root)/setting/roles/schema/create-role";

export interface RoleCommon {
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

interface DeletedBy {
  id: string;
  email: string;
  full_name: string;
}

export interface Role {
  id: string;
  role_code: string;
  role_name: string;
  permissions: [];
  created_by: CreatedBy;
  updated_by: UpdatedBy;
  deleted_by: DeletedBy;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

interface AllRole {
  items: Role[];
  total: number;
  page: number;
  limit: number;
}

export function getAllCommonRoleList() {
  return apiInstance.get<ApiResponse<RoleCommon[]>>(`/role/common/all`);
}

export function getAllRolesByFilter(filters: Record<string, string|number>) {
  const queryString = qs.stringify(filters, {
    skipNull: true,
    skipEmptyString: true,
  });
  return apiInstance.get<ApiResponse<AllRole>>(`/role/all?${queryString}`);
}

export function createRole(data: RoleFormValues) {
  return apiInstance.post("/role/new", data);
}

export function deleteRole(id: string) {
  return apiInstance.delete<ApiResponse<Role>>(`/role/${id}`);
}

export function updateRole(data: RoleFormValues) {
  return apiInstance.patch(`/role/${data.id}`, data);
}

export function getRoleById(id: string) {
  return apiInstance.get<ApiResponse<Role>>(`/role/${id}`);
}
