import { User } from "@/api-config/services/user";
import { UniversalDetailsRenderer } from "@/components/details/detail-renderer";

interface UserDetailsRendererProps {
  data: User;
  customRenderers?: Record<string, (value: any) => React.ReactNode>;
}

export function UserDetailsRenderer({
  data,
  customRenderers,
}: UserDetailsRendererProps) {
  return (
    <UniversalDetailsRenderer
      data={{
        ...data,
        "Role Code": data.role?.role_code,
        "Role Name": data.role?.role_name,
        "Department Code": data.department?.department_code,
        "Department Name": data.department?.department_name,
        "Created By": data.created_by?.full_name || "-",
        "Updated By": data.updated_by?.full_name || "-",
        "Created Date": data.created_at,
        "Updated Date": data.updated_at,
        "User Type": data.user_type?.toString().toLowerCase() || "-",
      }}
      excludeFields={[
        "id",
        "role_id",
        "department_id",
        "password",
        "created_by_id",
        "updated_by_id",
        "role",
        "department",
        "updated_at",
        "created_at",
        "deleted_at",
        "created_by",
        "updated_by",
      ]}
      customRenderers={{
        staff_id: (value) => String(value),
        user_type: (value) => (
          <span className="capitalize">{value?.toString().toLowerCase()}</span>
        ),
        status: (value) => (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              value === "ACTIVE"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {value}
          </span>
        ),
        ...customRenderers,
      }}
    />
  );
}
