import apiInstance from "../instance";
import { ApiResponse } from "./type";
import qs from "query-string";

// Passenger interface
interface Passenger {
  age: number;
  type: string;
  full_name: string;
  meal_preference: string;
  seat_preference: string;
  special_requests: string;
}

// Flight interface (from the response)
interface Flight {
  id: string;
  flight_number: string;
  airline_name: string;
  airline_code: string;
  aircraft_type: string;
  departure_airport_code: string;
  departure_airport_name: string;
  departure_city: string;
  departure_country: string;
  arrival_airport_code: string;
  arrival_airport_name: string;
  arrival_city: string;
  arrival_country: string;
  departure_time: string;
  arrival_time: string;
  duration_minutes: number;
  base_price: number;
  currency: string;
  available_seats: number;
  total_seats: number;
  class_type: string;
  has_wifi: boolean;
  has_meal: boolean;
  has_entertainment: boolean;
  has_luggage: boolean;
  status: string;
  is_domestic: boolean;
  created_by_id: string;
  updated_by_id: string | null;
  deleted_by_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface User {
  id: string;
  full_name: string;
  email: string;
}

export interface FlightBooking {
  id: string;
  booking_reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  passengers: Passenger[];
  total_passengers: number;
  departure_date: string;
  return_date: string | null;
  total_price: number;
  currency: string;
  base_price: number;
  taxes_fees: number;
  discounts: number;
  seat_preferences: string[];
  meal_preferences: string[];
  special_requests: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  payment_status: "PENDING" | "PAID" | "REFUNDED";
  flight_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  flight: Flight;
  user: User;
  is_round_trip: boolean;
  total_passengers_formatted: string;
  price_formatted: string;
}

interface AllFlightBookings {
  items: FlightBooking[];
  total: number;
  page: number;
  limit: number;
}

export function getAllFlightBookingsByFilter(filters: Record<string, string | number>) {
  const queryString = qs.stringify(filters, {
    skipNull: true,
    skipEmptyString: true,
  });
  return apiInstance.get<ApiResponse<AllFlightBookings>>(`/flight-bookings?${queryString}`);
}

export function getFlightBookingById(id: string) {
  return apiInstance.get<ApiResponse<FlightBooking>>(`/flight-bookings/${id}`);
}

export function approveFlightBooking(id: string) {
  return apiInstance.patch<ApiResponse<FlightBooking>>(`/flight-bookings/${id}/approve`);
}

export function rejectFlightBooking(id: string) {
  return apiInstance.patch<ApiResponse<FlightBooking>>(`/flight-bookings/${id}/reject`);
}

export function deleteFlightBooking(id: string) {
  return apiInstance.delete<ApiResponse<FlightBooking>>(`/flight-bookings/${id}`);
}

