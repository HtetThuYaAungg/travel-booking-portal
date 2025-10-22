import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { hotelKey } from "./key";
import {
  createHotel,
  deleteHotel,
  getAllHotelsByFilter,
  getHotelById,
  updateHotel,
} from "../services/hotel";
import { HotelFormValues } from "@/app/(root)/hotels/schema/create-hotel";

export function useGetAllHotelsByFilter(
  filters: Record<string, string | number>
) {
  return useQuery({
    queryKey: hotelKey.filters(filters || {}),
    queryFn: () => getAllHotelsByFilter(filters),
    select: (data) => data.data,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

export function useGetHotelById(id: string | null) {
  return useQuery({
    queryKey: hotelKey.detail(id),
    queryFn: () => {
      if (id) return getHotelById(id);
    },
    select: (data) => data?.data,
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}

export function useCreateHotel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: HotelFormValues) => createHotel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hotelKey.filters({}) });
    },
  });
}

export function useUpdateHotel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: HotelFormValues) => updateHotel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hotelKey.filters({}) });
    },
  });
}

export function useDeleteHotel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteHotel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hotelKey.filters({}) });
    },
  });
}
