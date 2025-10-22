import { Permission } from "@/api-config/services/permission";
import { UniversalDetailsRenderer } from "@/components/details/detail-renderer";

interface PermissionDetailsRenderProps {
  data: Permission;
  customRenderers?: Record<string, (value: any) => React.ReactNode>;
}

export function PermissionDetailsRender({
  data,
  customRenderers,
}: PermissionDetailsRenderProps) {
  return (
    <UniversalDetailsRenderer
      data={{
        ...data,
        "Created By": data.created_by?.full_name,
        "Updated By": data.updated_by?.full_name || "-",
        "Created Date": data.created_at,
        "Updated Date": data.updated_at || "-",
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
        ...customRenderers,
      }}
    />
  );
}
