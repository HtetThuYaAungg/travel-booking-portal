

export const userKey = {
  all: ["user"] as const,
  profile: ["profile"] as const,
  detail: (id: string | null) => [...userKey.all, id, "detail"] as const,
  filters: (filters: Record<string, string | number>) =>
    [...userKey.all, "list", ...Object.values(filters)] as const,
};

export const departmentKey = {
  all: ["department"] as const,
  common: ["department-common"] as const,
  detail: (id: string | null) => [...departmentKey.all, id, "detail"] as const,
  filters: (filters: Record<string, string | number>) =>
    [...departmentKey.all, "list", ...Object.values(filters)] as const,
};

export const roleKey = {
  all: ["role"] as const,
  common: ["role-common"] as const,
  detail: (id: string | null) => [...roleKey.all, id, "detail"] as const,
  filters: (filters: Record<string, string | number>) =>
    [...roleKey.all,"list", ...Object.values(filters)] as const,
};

export const permissionKey = {
  all: ["permission"] as const,
  userPermission: ["user-permission"] as const,
  detail: (id: string | null) => [...permissionKey.all, id, "detail"] as const,
  filters: (filters: Record<string, string | number>) =>
    [...permissionKey.all, "list", ...Object.values(filters)] as const,
};