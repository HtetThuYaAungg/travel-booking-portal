import { FlightBooking } from "@/api-config/services/flight-booking";
import { UniversalDetailsRenderer } from "@/components/details/detail-renderer";

interface FlightBookingDetailRenderProps {
  data: FlightBooking;
  customRenderers?: Record<string, (value: any) => React.ReactNode>;
}

export function FlightBookingDetailRender({
  data,
  customRenderers,
}: FlightBookingDetailRenderProps) {
  console.log("data", data);
  
  // Format passengers list
  const passengersList = data.passengers?.map((p, idx) => 
    `${idx + 1}. ${p.full_name} (${p.type}, Age: ${p.age})`
  ).join("\n") || "None";

  return (
    <UniversalDetailsRenderer
      data={{
        ...data,
        "Booking Reference": data.booking_reference,
        "Customer Name": data.customer_name,
        "Customer Email": data.customer_email,
        "Customer Phone": data.customer_phone,
        "Flight Number": data.flight?.flight_number || "-",
        "Airline": data.flight?.airline_name || "-",
        "Route": `${data.flight?.departure_airport_code} → ${data.flight?.arrival_airport_code}`,
        "Departure Airport": `${data.flight?.departure_airport_name} (${data.flight?.departure_city}, ${data.flight?.departure_country})`,
        "Arrival Airport": `${data.flight?.arrival_airport_name} (${data.flight?.arrival_city}, ${data.flight?.arrival_country})`,
        "Departure Date": data.departure_date ? new Date(data.departure_date).toLocaleString() : "-",
        "Return Date": data.return_date ? new Date(data.return_date).toLocaleString() : "N/A",
        "Trip Type": data.is_round_trip ? "Round Trip" : "One Way",
        "Total Passengers": `${data.total_passengers} (${data.total_passengers_formatted || ""})`,
        "Passengers": passengersList,
        "Total Price": data.price_formatted || `${data.currency} ${data.total_price.toFixed(2)}`,
        "Base Price": `${data.currency} ${data.base_price.toFixed(2)}`,
        "Taxes & Fees": `${data.currency} ${data.taxes_fees.toFixed(2)}`,
        "Discounts": `${data.currency} ${data.discounts.toFixed(2)}`,
        "Status": data.status,
        "Payment Status": data.payment_status,
        "Special Requests": data.special_requests || "None",
        "User": data.user?.full_name || "-",
        "User Email": data.user?.email || "-",
        "Created Date": data.created_at ? new Date(data.created_at).toLocaleString() : "-",
        "Updated Date": data.updated_at ? new Date(data.updated_at).toLocaleString() : "-",
      }}
      excludeFields={[
        "id",
        "booking_reference",
        "customer_name",
        "customer_email",
        "customer_phone",
        "departure_date",
        "return_date",
        "is_round_trip",
        "total_passengers",
        "total_passengers_formatted",
        "passengers",
        "total_price",
        "price_formatted",
        "base_price",
        "taxes_fees",
        "discounts",
        "status",
        "payment_status",
        "special_requests",
        "updated_at",
        "created_at",
        "flight",
        "flight_id",
        "user",
        "user_id",
        "seat_preferences",
        "meal_preferences",
        "currency",
      ]}
      customRenderers={{
        ...customRenderers,
      }}
    />
  );
}

