import { HotelFormValues } from "@/app/(root)/hotels/schema/create-hotel";
import apiInstance from "../instance";
import { ApiResponse } from "./type";
import qs from "query-string";

// types/hotel.ts
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

export interface Hotel {
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

interface AllHotels {
  items: Hotel[];
  total: number;
  page: number;
  limit: number;
}

export function getAllHotelsByFilter(filters: Record<string, string | number>) {
  const queryString = qs.stringify(filters, {
    skipNull: true,
    skipEmptyString: true,
  });
  return apiInstance.get<ApiResponse<AllHotels>>(`/hotels?${queryString}`);
}

export function createHotel(data: HotelFormValues) {
  return apiInstance.post("/hotels", data);
}

export function deleteHotel(id: string) {
  return apiInstance.delete<ApiResponse<Hotel>>(`/hotels/${id}`);
}

export function getHotelById(id: string) {
  return apiInstance.get<ApiResponse<Hotel>>(`/hotels/${id}`);
}

export function updateHotel(data: HotelFormValues) {
  return apiInstance.patch(`/hotels/${data.id}`, data);
}
