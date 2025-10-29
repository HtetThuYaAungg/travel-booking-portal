import * as z from "zod";

export const flightCreateSchema = z
  .object({
    id: z.string().optional(),
    flight_number: z.string().min(2, "Flight number must be at least 2 characters"),
    airline_name: z.string().min(2, "Airline name must be at least 2 characters"),
    airline_code: z.string().min(2, "Airline code must be at least 2 characters"),
    aircraft_type: z.string().min(2, "Aircraft type must be at least 2 characters"),
    departure_airport_code: z.string().min(3, "Departure airport code must be at least 3 characters"),
    departure_airport_name: z.string().min(2, "Departure airport name must be at least 2 characters"),
    departure_city: z.string().min(2, "Departure city must be at least 2 characters"),
    departure_country: z.string().min(2, "Departure country must be at least 2 characters"),
    arrival_airport_code: z.string().min(3, "Arrival airport code must be at least 3 characters"),
    arrival_airport_name: z.string().min(2, "Arrival airport name must be at least 2 characters"),
    arrival_city: z.string().min(2, "Arrival city must be at least 2 characters"),
    arrival_country: z.string().min(2, "Arrival country must be at least 2 characters"),
    departure_time: z.string().min(1, "Departure time is required"),
    arrival_time: z.string().min(1, "Arrival time is required"),
    duration_minutes: z.number().min(1, "Duration must be at least 1 minute"),
    base_price: z.number().min(0, "Base price must be a positive number"),
    currency: z.string().min(3, "Currency must be at least 3 characters"),
    available_seats: z.number().min(0, "Available seats must be a positive number"),
    total_seats: z.number().min(1, "Total seats must be at least 1"),
    class_type: z.string().min(1, "Class type is required"),
    has_wifi: z.boolean().optional(),
    has_meal: z.boolean().optional(),
    has_entertainment: z.boolean().optional(),
    has_luggage: z.boolean().optional(),
    is_domestic: z.boolean().optional(),
  });

export type FlightFormValues = z.infer<typeof flightCreateSchema>;

export default flightCreateSchema;

