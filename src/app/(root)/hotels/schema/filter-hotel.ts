import * as z from "zod";

export const hotelFilterSchema = z.object({
  search: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  min_price: z.number().optional(),
  max_price: z.number().optional(),
  min_star_rating: z.number().optional(),
  min_rating: z.number().optional(),
  has_wifi: z.boolean().optional(),
  has_pool: z.boolean().optional(),
  has_spa: z.boolean().optional(),
  has_gym: z.boolean().optional(),
  has_restaurant: z.boolean().optional(),
  has_parking: z.boolean().optional(),
  has_pet_friendly: z.boolean().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(["asc", "desc"]).optional(),
});

export type HotelFilterValues = z.infer<typeof hotelFilterSchema>;

export default hotelFilterSchema;
