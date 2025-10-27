import * as z from "zod";

export const hotelBookingFilterSchema = z.object({
  customer_name: z.string().optional(),
  customer_email: z.string().optional(),
  check_in_date_from: z.date().optional(),
  check_in_date_to: z.date().optional(),
  check_out_date_from: z.date().optional(),
  check_out_date_to: z.date().optional(),
  guests: z.number().optional(),
  rooms: z.number().optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(["asc", "desc"]).optional(),
});

export type HotelBookingFilterValues = z.infer<typeof hotelBookingFilterSchema>;

export default hotelBookingFilterSchema;
