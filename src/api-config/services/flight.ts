import { FlightFormValues } from "@/app/(root)/travel/flights/schema/create-flight";
import apiInstance from "../instance";
import { ApiResponse } from "./type";
import qs from "query-string";

// types/flight.ts
interface CreatedBy {
  id: string;
  email: string;
  full_name: string;
}

interface UpdatedBy {
  id: string;
  email: string;
  full_name: string;
}

export interface Flight {
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
  is_domestic: boolean;
  created_by: CreatedBy;
  updated_by: UpdatedBy;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

interface AllFlights {
  items: Flight[];
  total: number;
  page: number;
  limit: number;
}

export function getAllFlightsByFilter(filters: Record<string, string | number>) {
  const queryString = qs.stringify(filters, {
    skipNull: true,
    skipEmptyString: true,
  });
  return apiInstance.get<ApiResponse<AllFlights>>(`/flights?${queryString}`);
}

export function createFlight(data: FlightFormValues) {
  return apiInstance.post("/flights", data);
}

export function deleteFlight(id: string) {
  return apiInstance.delete<ApiResponse<Flight>>(`/flights/${id}`);
}

export function getFlightById(id: string) {
  return apiInstance.get<ApiResponse<Flight>>(`/flights/${id}`);
}

export function updateFlight(data: FlightFormValues) {
  return apiInstance.patch(`/flights/${data.id}`, data);
}

