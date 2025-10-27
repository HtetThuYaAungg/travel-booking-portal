"use client";

import type { Row } from "@tanstack/react-table";
import {
  CheckCircle,
  Copy,
  ExternalLink,
  Loader,
  MoreHorizontal,
  Trash,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApproveHotelBooking, useDeleteHotelBooking, useRejectHotelBooking } from "@/api-config/queries/hotel-booking";
import { useMessage } from "@/app/contexts/MessageContext";
import { useState } from "react";
import { RouteGuard } from "@/components/route-guard";
import { HotelBooking } from "@/api-config/services/hotel-booking";
import DetailsHotelBooking from "../detail-hotel-booking";

interface HotelBookingTableActionsProps<TData> {
  row: Row<TData>;
}

export function HotelBookingTableActions<TData>({
  row,
}: HotelBookingTableActionsProps<TData>) {
  const hotelBooking = row.original as HotelBooking;

  const message = useMessage();
  const { mutateAsync: mutateAsyncApproveHotelBooking, isPending: isPendingApproveHotelBooking } =
    useApproveHotelBooking();
  const { mutateAsync: mutateAsyncRejectHotelBooking, isPending: isPendingRejectHotelBooking } =
    useRejectHotelBooking();
  const { mutateAsync: mutateAsyncDeleteHotelBooking, isPending: isPendingDeleteHotelBooking } =
    useDeleteHotelBooking();

  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [hotelBookingId, setHotelBookingId] = useState<string | null>(null);

  const handleCloseDetailsHotelBooking = () => {
    setIsDetailsDrawerOpen(false);
  };

  const handleDetailHotelBooking = (hotelBookingId: string) => {
    setHotelBookingId(hotelBookingId);
    setIsDetailsDrawerOpen(true);
  };

  const handleApproveHotelBooking = async (id: string) => {
    const loadingId = message.loading("Approving...", 0);
    try {
      await mutateAsyncApproveHotelBooking(id);
      message.remove(loadingId);
      message.success("Hotel booking approved successfully!");
    } catch (error: unknown) {
      message.remove(loadingId);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any).response?.data?.message || "Failed to approve hotel booking"
        : "Failed to approve hotel booking";
      message.error(errorMessage);
    }
  };

  const handleRejectHotelBooking = async (id: string) => {
    const loadingId = message.loading("Rejecting...", 0);
    try {
      await mutateAsyncRejectHotelBooking(id);
      message.remove(loadingId);
      message.success("Hotel booking rejected successfully!");
    } catch (error: unknown) {
      message.remove(loadingId);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any).response?.data?.message || "Failed to reject hotel booking"
        : "Failed to reject hotel booking";
      message.error(errorMessage);
    }
  };

  const handleDeleteHotelBooking = async (id: string) => {
    const loadingId = message.loading("Deleting...", 0);
    try {
      await mutateAsyncDeleteHotelBooking(id);
      message.remove(loadingId);
      message.success("Delete hotel booking successful!");
    } catch (error: unknown) {
      message.remove(loadingId);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any).response?.data?.message || "Failed to delete hotel booking"
        : "Failed to delete hotel booking";
      message.error(errorMessage);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(hotelBooking.id)}
          >
            <Copy className="mr-2 h-4 w-4 text-gray-500" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(hotelBooking.customer_name)}>
            <Copy className="mr-2 h-4 w-4 text-gray-500" />
            Copy Customer Name
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <RouteGuard permissionType="read">
            <DropdownMenuItem onClick={() => handleDetailHotelBooking(hotelBooking.id)}>
              <ExternalLink className="mr-2 h-4 w-4 text-blue-500" />
              View Details
            </DropdownMenuItem>
          </RouteGuard>
          {hotelBooking.status === "PENDING" && (
            <>
              <RouteGuard permissionType="edit">
                <DropdownMenuItem
                  onClick={() => handleApproveHotelBooking(hotelBooking.id)}
                  className="text-green-600"
                >
                  {isPendingApproveHotelBooking ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  )}
                  Approve
                </DropdownMenuItem>
              </RouteGuard>
              <RouteGuard permissionType="edit">
                <DropdownMenuItem
                  onClick={() => handleRejectHotelBooking(hotelBooking.id)}
                  className="text-red-600"
                >
                  {isPendingRejectHotelBooking ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="mr-2 h-4 w-4 text-red-500" />
                  )}
                  Reject
                </DropdownMenuItem>
              </RouteGuard>
            </>
          )}
          <RouteGuard permissionType="delete">
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDeleteHotelBooking(hotelBooking.id)}
            >
              {isPendingDeleteHotelBooking ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash className="mr-2 h-4 w-4 text-red-500" />
              )}
              Delete
            </DropdownMenuItem>
          </RouteGuard>
        </DropdownMenuContent>
      </DropdownMenu>
      {isDetailsDrawerOpen && (
        <DetailsHotelBooking
          open={isDetailsDrawerOpen}
          onOpenChange={setIsDetailsDrawerOpen}
          hideDefaultTrigger={true}
          hotelBookingId={hotelBookingId}
          onSuccess={handleCloseDetailsHotelBooking}
        />
      )}
    </>
  );
}
