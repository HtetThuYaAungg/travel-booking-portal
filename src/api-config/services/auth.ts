import apiInstance from "../instance";

export async function login(data: Record<string, unknown>) {
  return apiInstance.post("/auth/login", data);
}

export async function logout() {
  return apiInstance.post("/auth/logout");
}

export function getPermission() {
  return apiInstance.get("/user/permissions");
}