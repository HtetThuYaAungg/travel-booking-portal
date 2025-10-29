import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { flightKey } from "./key";
import {
  createFlight,
  deleteFlight,
  getAllFlightsByFilter,
  getFlightById,
  updateFlight,
} from "../services/flight";
import { FlightFormValues } from "@/app/(root)/travel/flights/schema/create-flight";

export function useGetAllFlightsByFilter(
  filters: Record<string, string | number>
) {
  return useQuery({
    queryKey: flightKey.filters(filters || {}),
    queryFn: () => getAllFlightsByFilter(filters),
    select: (data) => data.data,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

export function useGetFlightById(id: string | null) {
  return useQuery({
    queryKey: flightKey.detail(id),
    queryFn: () => {
      if (id) return getFlightById(id);
    },
    select: (data) => data?.data,
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

export function useCreateFlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FlightFormValues) => createFlight(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flightKey.filters({}) });
    },
  });
}

export function useUpdateFlight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FlightFormValues) => updateFlight(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flightKey.filters({}) });
    },
  });
}

export function useDeleteFlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFlight(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flightKey.filters({}) });
    },
  });
}

