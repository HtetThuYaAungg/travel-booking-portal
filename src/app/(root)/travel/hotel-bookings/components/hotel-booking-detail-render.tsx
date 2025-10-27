import { HotelBooking } from "@/api-config/services/hotel-booking";
import { UniversalDetailsRenderer } from "@/components/details/detail-renderer";

interface HotelBookingDetailRenderProps {
  data: HotelBooking;
  customRenderers?: Record<string, (value: any) => React.ReactNode>;
}

export function HotelBookingDetailRender({
  data,
  customRenderers,
}: HotelBookingDetailRenderProps) {
  console.log("data", data);
  return (
    <UniversalDetailsRenderer
      data={{
        ...data,
              "Price": `${data.hotel.price}`,
         "Check In Date": `${data.check_in_date}`,
         "Check Out Date": `${data.check_out_date}`,
        "Created By": data.created_by?.full_name || "-",
        "Updated By": data.updated_by?.full_name || "-",
        "Created Date": data.created_at ? new Date(data.created_at).toLocaleDateString() : "-",
        "Updated Date": data.updated_at ? new Date(data.updated_at).toLocaleDateString() : "-",
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
          "hotel",
          "hotel_id",
          "user_id",
          "user"
            
      ]}
      customRenderers={{
          ...customRenderers,
      }}
    />
  );
}
