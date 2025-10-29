import * as z from "zod";

export const flightBookingFilterSchema = z.object({
  booking_reference: z.string().optional(),
  customer_name: z.string().optional(),
  customer_email: z.string().optional(),
  customer_phone: z.string().optional(),
  departure_date_from: z.date().optional(),
  departure_date_to: z.date().optional(),
  return_date_from: z.date().optional(),
  return_date_to: z.date().optional(),
  total_passengers: z.number().optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]).optional(),
  payment_status: z.enum(["PENDING", "PAID", "REFUNDED"]).optional(),
  is_round_trip: z.boolean().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(["asc", "desc"]).optional(),
});

export type FlightBookingFilterValues = z.infer<typeof flightBookingFilterSchema>;

export default flightBookingFilterSchema;

