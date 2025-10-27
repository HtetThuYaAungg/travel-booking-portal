import apiInstance from "../instance";
import { ApiResponse } from "./type";
import qs from "query-string";

// types/hotel-booking.ts
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

interface Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  city: string;
  country: string;
  price: number;
  currency: string;
  rating: number;
  star_rating: number;
  amenities: string[];
  images: string[];
  has_wifi: boolean;
  has_pool: boolean;
  has_spa: boolean;
  has_gym: boolean;
  has_restaurant: boolean;
  has_parking: boolean;
  has_pet_friendly: boolean;
  phone: string;
  email: string;
  website: string;
  address: string;
  latitude: number;
  longitude: number;
  created_by: CreatedBy;
  updated_by: UpdatedBy;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface HotelBooking {
  id: string;
  customer_name: string;
  customer_email: string;
  hotel_id: string;
  hotel: Hotel;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  rooms: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  total_price: number;
  currency: string;
  special_requests?: string;
  created_by: CreatedBy;
  updated_by: UpdatedBy;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

interface AllHotelBookings {
  items: HotelBooking[];
  total: number;
  page: number;
  limit: number;
}

export function getAllHotelBookingsByFilter(filters: Record<string, string | number>) {
  const queryString = qs.stringify(filters, {
    skipNull: true,
    skipEmptyString: true,
  });
  return apiInstance.get<ApiResponse<AllHotelBookings>>(`/hotel-bookings?${queryString}`);
}

export function getHotelBookingById(id: string) {
  return apiInstance.get<ApiResponse<HotelBooking>>(`/hotel-bookings/${id}`);
}

export function approveHotelBooking(id: string) {
  return apiInstance.patch<ApiResponse<HotelBooking>>(`/hotel-bookings/${id}/approve`);
}

export function rejectHotelBooking(id: string) {
  return apiInstance.patch<ApiResponse<HotelBooking>>(`/hotel-bookings/${id}/reject`);
}

export function deleteHotelBooking(id: string) {
  return apiInstance.delete<ApiResponse<HotelBooking>>(`/hotel-bookings/${id}`);
}
