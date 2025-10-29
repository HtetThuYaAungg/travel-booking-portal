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
import { useApproveFlightBooking, useDeleteFlightBooking, useRejectFlightBooking } from "@/api-config/queries/flight-booking";
import { useMessage } from "@/app/contexts/MessageContext";
import { useState } from "react";
import { RouteGuard } from "@/components/route-guard";
import { FlightBooking } from "@/api-config/services/flight-booking";
import DetailsFlightBooking from "../detail-flight-booking";

interface FlightBookingTableActionsProps<TData> {
  row: Row<TData>;
}

export function FlightBookingTableActions<TData>({
  row,
}: FlightBookingTableActionsProps<TData>) {
  const flightBooking = row.original as FlightBooking;

  const message = useMessage();
  const { mutateAsync: mutateAsyncApproveFlightBooking, isPending: isPendingApproveFlightBooking } =
    useApproveFlightBooking();
  const { mutateAsync: mutateAsyncRejectFlightBooking, isPending: isPendingRejectFlightBooking } =
    useRejectFlightBooking();
  const { mutateAsync: mutateAsyncDeleteFlightBooking, isPending: isPendingDeleteFlightBooking } =
    useDeleteFlightBooking();

  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [flightBookingId, setFlightBookingId] = useState<string | null>(null);

  const handleCloseDetailsFlightBooking = () => {
    setIsDetailsDrawerOpen(false);
  };

  const handleDetailFlightBooking = (flightBookingId: string) => {
    setFlightBookingId(flightBookingId);
    setIsDetailsDrawerOpen(true);
  };

  const handleApproveFlightBooking = async (id: string) => {
    const loadingId = message.loading("Approving...", 0);
    try {
      await mutateAsyncApproveFlightBooking(id);
      message.remove(loadingId);
      message.success("Flight booking approved successfully!");
    } catch (error: unknown) {
      message.remove(loadingId);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any).response?.data?.message || "Failed to approve flight booking"
        : "Failed to approve flight booking";
      message.error(errorMessage);
    }
  };

  const handleRejectFlightBooking = async (id: string) => {
    const loadingId = message.loading("Rejecting...", 0);
    try {
      await mutateAsyncRejectFlightBooking(id);
      message.remove(loadingId);
      message.success("Flight booking rejected successfully!");
    } catch (error: unknown) {
      message.remove(loadingId);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any).response?.data?.message || "Failed to reject flight booking"
        : "Failed to reject flight booking";
      message.error(errorMessage);
    }
  };

  const handleDeleteFlightBooking = async (id: string) => {
    const loadingId = message.loading("Deleting...", 0);
    try {
      await mutateAsyncDeleteFlightBooking(id);
      message.remove(loadingId);
      message.success("Delete flight booking successful!");
    } catch (error: unknown) {
      message.remove(loadingId);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any).response?.data?.message || "Failed to delete flight booking"
        : "Failed to delete flight booking";
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
            onClick={() => navigator.clipboard.writeText(flightBooking.id)}
          >
            <Copy className="mr-2 h-4 w-4 text-gray-500" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(flightBooking.booking_reference)}>
            <Copy className="mr-2 h-4 w-4 text-gray-500" />
            Copy Booking Reference
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(flightBooking.customer_name)}>
            <Copy className="mr-2 h-4 w-4 text-gray-500" />
            Copy Customer Name
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <RouteGuard permissionType="read">
            <DropdownMenuItem onClick={() => handleDetailFlightBooking(flightBooking.id)}>
              <ExternalLink className="mr-2 h-4 w-4 text-blue-500" />
              View Details
            </DropdownMenuItem>
          </RouteGuard>
          {flightBooking.status === "PENDING" && (
            <>
              <RouteGuard permissionType="edit">
                <DropdownMenuItem
                  onClick={() => handleApproveFlightBooking(flightBooking.id)}
                  className="text-green-600"
                >
                  {isPendingApproveFlightBooking ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  )}
                  Approve
                </DropdownMenuItem>
              </RouteGuard>
              <RouteGuard permissionType="edit">
                <DropdownMenuItem
                  onClick={() => handleRejectFlightBooking(flightBooking.id)}
                  className="text-red-600"
                >
                  {isPendingRejectFlightBooking ? (
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
              onClick={() => handleDeleteFlightBooking(flightBooking.id)}
            >
              {isPendingDeleteFlightBooking ? (
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
        <DetailsFlightBooking
          open={isDetailsDrawerOpen}
          onOpenChange={setIsDetailsDrawerOpen}
          hideDefaultTrigger={true}
          flightBookingId={flightBookingId}
          onSuccess={handleCloseDetailsFlightBooking}
        />
      )}
    </>
  );
}

