import * as z from "zod";

export const hotelCreateSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(2, "Hotel name must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    location: z.string().min(2, "Location must be at least 2 characters"),
    city: z.string().min(2, "City must be at least 2 characters"),
    country: z.string().min(2, "Country must be at least 2 characters"),
    price: z.number().min(0, "Price must be a positive number"),
    currency: z.string().min(3, "Currency must be at least 3 characters"),
    rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
    star_rating: z.number().min(1).max(5, "Star rating must be between 1 and 5"),
    amenities: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
    has_wifi: z.boolean().optional(),
    has_pool: z.boolean().optional(),
    has_spa: z.boolean().optional(),
    has_gym: z.boolean().optional(),
    has_restaurant: z.boolean().optional(),
    has_parking: z.boolean().optional(),
    has_pet_friendly: z.boolean().optional(),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    email: z.string().email("Invalid email format"),
    website: z.string().url("Invalid website URL").optional().or(z.literal("")),
    address: z.string().min(5, "Address must be at least 5 characters"),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  });

export type HotelFormValues = z.infer<typeof hotelCreateSchema>;

export default hotelCreateSchema;
