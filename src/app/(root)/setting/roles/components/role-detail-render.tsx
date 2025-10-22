// components/user/user-details-renderer.tsx

import { Role } from "@/api-config/services/role";
import { UniversalDetailsRenderer } from "@/components/details/detail-renderer";
import PermissionTree from "@/components/permission-tree";
import { permission } from "process";

interface RoleDetailsRendererProps {
  data: Role;
  customRenderers?: Record<string, (value: any) => React.ReactNode>;
}

export function RoleDetailsRenderer({
  data,
  customRenderers,
}: RoleDetailsRendererProps) {
  return (
    <UniversalDetailsRenderer
      data={{
        ...data,
        "Created By": data.created_by?.full_name,
        "Updated By": data.updated_by?.full_name || "-",
        "Created Date": data.created_at,
        "Updated Date": data.updated_at,
      }}
      excludeFields={[
        "id",
        "updated_by_id",
        "created_by_id",
        "deleted_by_id",
        "created_at",
        "updated_at",
        "deleted_at",
        "created_by",
        "updated_by",
        "deleted_by",
      ]}
      customRenderers={{
        created_at: (value) => new Date(value).toLocaleDateString(),
        updated_at: (value) => new Date(value).toLocaleString(),
        permissions: (value) => (
          <PermissionTree
            defaultPermissions={value}
            name={"permission all"}
            disabled={true}
          />
        ),
        ...customRenderers,
      }}
    />
  );
}
