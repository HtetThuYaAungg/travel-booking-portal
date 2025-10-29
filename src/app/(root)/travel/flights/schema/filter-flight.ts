import * as z from "zod";

export const flightFilterSchema = z.object({
  search: z.string().optional(),
  departure_airport_code: z.string().optional(),
  arrival_airport_code: z.string().optional(),
  departure_city: z.string().optional(),
  arrival_city: z.string().optional(),
  airline_name: z.string().optional(),
  airline_code: z.string().optional(),
  departure_date: z.string().optional(),
  min_price: z.string().optional(),
  max_price: z.string().optional(),
  class_type: z.string().optional(),
  has_wifi: z.boolean().optional(),
  has_meal: z.boolean().optional(),
  is_domestic: z.boolean().optional(),
  min_available_seats: z.string().optional(),
  status: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
  sort_by: z.string().optional(),
  sort_order: z.string().optional(),
});

export type FlightFilterValues = z.infer<typeof flightFilterSchema>;

export default flightFilterSchema;

