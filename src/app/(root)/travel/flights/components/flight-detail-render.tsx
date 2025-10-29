  import { Flight } from "@/api-config/services/flight";
import { Hotel } from "@/api-config/services/hotel";
import { UniversalDetailsRenderer } from "@/components/details/detail-renderer";

interface FlightDetailRenderProps {
  data: Flight;
  customRenderers?: Record<string, (value: any) => React.ReactNode>;
}

export function FlightDetailRender({
  data,
  customRenderers,
}: FlightDetailRenderProps) {
  console.log("data", data);
  return (
    <UniversalDetailsRenderer
      data={{
        ...data,

      
        
            
        "Created By": data.created_by?.full_name || "-",
        "Updated By": data.updated_by?.full_name || "-",
        "Created Date": data.created_at || "-",
        "Updated Date": data.updated_at || "-",
      }}
      excludeFields={[
        "id",
        "created_by_id",
        "updated_by_id",
        "updated_at",
        "created_at",
        "deleted_at",
        "created_by",
        "updated_by",
      
      ]}
      customRenderers={{
        ...customRenderers,
      }}
    />
  );
}
