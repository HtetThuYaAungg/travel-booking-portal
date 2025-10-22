import { ApiResponse } from "./type";
import apiInstance from "../instance";
import { DepartmentFormValues } from "@/app/(root)/setting/departments/schema/create-department";
import qs from "query-string";

export interface DepartmentCommon {
  department_code: string;
  department_name: string;
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

export interface Department {
  id: string;
  department_name: string;
  department_code: string;
  created_by: CreatedBy;
  updated_by: UpdatedBy;
  created_at: string;
  updated_at: string;
}

interface AllDepartment {
  items: Department[];
  total: number;
  page: number;
  limit: number;
}

export function getAllCommonDepartmentList() {
  return apiInstance.get<ApiResponse<DepartmentCommon[]>>(
    `/department/common/all`
  );
}

export function getAllDepartmentsByFilter(
  filters: Record<string, string | number>
) {
  const queryString = qs.stringify(filters, {
    skipNull: true,
    skipEmptyString: true,
  });
  return apiInstance.get<ApiResponse<AllDepartment>>(
    `/department/all?${queryString}`
  );
}

export function createDepartment(data: DepartmentFormValues) {
  return apiInstance.post("/department/new", data);
}

export function deleteDepartment(id: string) {
  return apiInstance.delete<ApiResponse<Department>>(`/department/${id}`);
}

export function updateDepartment(data: DepartmentFormValues) {
  return apiInstance.patch(`/department/${data.id}`, data);
}

export function getDepartmentById(id: string) {
  return apiInstance.get<ApiResponse<Department>>(`/department/${id}`);
}
