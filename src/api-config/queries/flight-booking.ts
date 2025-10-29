import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { flightBookingKey } from "./key";
import {
  approveFlightBooking,
  deleteFlightBooking,
  getAllFlightBookingsByFilter,
  getFlightBookingById,
  rejectFlightBooking,
} from "../services/flight-booking";

export function useGetAllFlightBookingsByFilter(
  filters: Record<string, string | number>
) {
  return useQuery({
    queryKey: flightBookingKey.filters(filters || {}),
    queryFn: () => getAllFlightBookingsByFilter(filters),
    select: (data) => data.data,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

export function useGetFlightBookingById(id: string | null) {
  return useQuery({
    queryKey: flightBookingKey.detail(id),
    queryFn: () => {
      if (id) return getFlightBookingById(id);
    },
    select: (data) => data?.data,
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

export function useApproveFlightBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveFlightBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flightBookingKey.filters({}) });
    },
  });
}

export function useRejectFlightBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rejectFlightBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flightBookingKey.filters({}) });
    },
  });
}

export function useDeleteFlightBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFlightBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flightBookingKey.filters({}) });
    },
  });
}

