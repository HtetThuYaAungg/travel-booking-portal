import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { hotelBookingKey } from "./key";
import {
  approveHotelBooking,
  deleteHotelBooking,
  getAllHotelBookingsByFilter,
  getHotelBookingById,
  rejectHotelBooking,
} from "../services/hotel-booking";

export function useGetAllHotelBookingsByFilter(
  filters: Record<string, string | number>
) {
  return useQuery({
    queryKey: hotelBookingKey.filters(filters || {}),
    queryFn: () => getAllHotelBookingsByFilter(filters),
    select: (data) => data.data,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

export function useGetHotelBookingById(id: string | null) {
  return useQuery({
    queryKey: hotelBookingKey.detail(id),
    queryFn: () => {
      if (id) return getHotelBookingById(id);
    },
    select: (data) => data?.data,
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

export function useApproveHotelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveHotelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hotelBookingKey.filters({}) });
    },
  });
}

export function useRejectHotelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rejectHotelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hotelBookingKey.filters({}) });
    },
  });
}

export function useDeleteHotelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteHotelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hotelBookingKey.filters({}) });
    },
  });
}
