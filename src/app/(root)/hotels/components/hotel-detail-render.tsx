import { Hotel } from "@/api-config/services/hotel";
import { UniversalDetailsRenderer } from "@/components/details/detail-renderer";

interface HotelDetailRenderProps {
  data: Hotel;
  customRenderers?: Record<string, (value: any) => React.ReactNode>;
}

export function HotelDetailRender({
  data,
  customRenderers,
}: HotelDetailRenderProps) {
  return (
    <UniversalDetailsRenderer
      data={{
        ...data,
        "Price": `${data.currency} ${data.price}`,
        "Star Rating": `${data.star_rating} ⭐`,
        "Rating": `${data.rating}/5`,
        "Coordinates": `${data.latitude}, ${data.longitude}`,
        "Amenities": [
          data.has_wifi && "WiFi",
          data.has_pool && "Pool",
          data.has_spa && "Spa",
          data.has_gym && "Gym",
          data.has_restaurant && "Restaurant",
          data.has_parking && "Parking",
          data.has_pet_friendly && "Pet Friendly"
        ].filter(Boolean).join(", ") || "None",
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
        "has_wifi",
        "has_pool",
        "has_spa",
        "has_gym",
        "has_restaurant",
        "has_parking",
        "has_pet_friendly",
        "latitude",
        "longitude",
        "currency",
        "price",
        "rating",
        "star_rating",
      ]}
      customRenderers={{
        ...customRenderers,
      }}
    />
  );
}
