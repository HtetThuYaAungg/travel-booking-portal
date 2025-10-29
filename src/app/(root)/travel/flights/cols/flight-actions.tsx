"use client";

import type { Row } from "@tanstack/react-table";
import {
  Copy,
  ExternalLink,
  Loader,
  MoreHorizontal,
  Pen,
  Trash,
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
import { useDeleteFlight } from "@/api-config/queries/flight";
import { useMessage } from "@/app/contexts/MessageContext";
import { useState } from "react";
import { RouteGuard } from "@/components/route-guard";
import { Flight } from "@/api-config/services/flight";
import CreateFlight from "../create-flight";
import DetailsFlight from "../detail-flight";

interface FlightTableActionsProps<TData> {
  row: Row<TData>;
}

export function FlightTableActions<TData>({
  row,
}: FlightTableActionsProps<TData>) {
  const flight = row.original as Flight;

  const message = useMessage();
  const { mutateAsync: mutateAsyncDeleteFlight, isPending: isPendingDeleteFlight } =
    useDeleteFlight();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);

  const [flightId, setFlightId] = useState<string | null>(null);
  const [editedDataId, setEditedDataId] = useState<string | null>(null);

  const handleEditFlight = (flightId: string) => {
    setEditedDataId(flightId);
    setIsDrawerOpen(true);
  };
  const handleCloseEditFlight = () => {
    setEditedDataId(null);
    setIsDrawerOpen(false);
  };

  const handleCloseDetailsFlight = () => {
    setIsDetailsDrawerOpen(false);
  };

  const handleDetailFlight = (flightId: string) => {
    setFlightId(flightId);
    setIsDetailsDrawerOpen(true);
  };

  const handleDeleteFlight = async (id: string) => {
    const loadingId = message.loading("Deleting...", 0);
    try {
      await mutateAsyncDeleteFlight(id);
      message.remove(loadingId);
      message.success("Delete flight successful!");
    } catch (error: any) {
      message.remove(loadingId);
      message.error(error?.response.data.message);
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
            onClick={() => navigator.clipboard.writeText(flight.flight_number)}
          >
            <Copy className="mr-2 h-4 w-4 text-gray-500" />
            Copy Flight Number
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(flight.airline_name)}>
            <Copy className="mr-2 h-4 w-4 text-gray-500" />
            Copy Airline
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <RouteGuard permissionType="read">
            <DropdownMenuItem onClick={() => handleDetailFlight(flight.id)}>
              <ExternalLink className="mr-2 h-4 w-4 text-blue-500" />
              View Details
            </DropdownMenuItem>
          </RouteGuard>
          <RouteGuard permissionType="edit">
            <DropdownMenuItem
              onClick={() => handleEditFlight(flight.id)}
            >
              <Pen className="mr-2 h-4 w-4 text-yellow-500" />
              Edit
            </DropdownMenuItem>
          </RouteGuard>
          <RouteGuard permissionType="delete">
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDeleteFlight(flight.id)}
            >
              {isPendingDeleteFlight ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash className="mr-2 h-4 w-4 text-red-500" />
              )}
              Delete
            </DropdownMenuItem>
          </RouteGuard>
        </DropdownMenuContent>
      </DropdownMenu>
        <CreateFlight
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        hideDefaultTrigger={true}
              onSuccess={handleCloseEditFlight}
              editedDataId={editedDataId}
      />
      {isDetailsDrawerOpen && (
        <DetailsFlight
          open={isDetailsDrawerOpen}
          onOpenChange={setIsDetailsDrawerOpen}
          hideDefaultTrigger={true}
          flightId={flightId}
          onSuccess={handleCloseDetailsFlight}
        />
      )}
    </>
  );
}

