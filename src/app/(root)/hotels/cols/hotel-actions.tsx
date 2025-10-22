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
import { useDeleteHotel } from "@/api-config/queries/hotel";
import { useMessage } from "@/app/contexts/MessageContext";
import { useState } from "react";
import { RouteGuard } from "@/components/route-guard";
import { Hotel } from "@/api-config/services/hotel";
import CreateHotel from "../create-hotel";
import DetailsHotel from "../detail-hotel";

interface HotelTableActionsProps<TData> {
  row: Row<TData>;
}

export function HotelTableActions<TData>({
  row,
}: HotelTableActionsProps<TData>) {
  const hotel = row.original as Hotel;

  const message = useMessage();
  const { mutateAsync: mutateAsyncDeleteHotel, isPending: isPendingDeleteHotel } =
    useDeleteHotel();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);

  const [hotelId, setHotelId] = useState<string | null>(null);
  const [editedDataId, setEditedDataId] = useState<string | null>(null);

  const handleEditHotel = (hotelId: string) => {
    setEditedDataId(hotelId);
    setIsDrawerOpen(true);
  };
  const handleCloseEditHotel = () => {
    setEditedDataId(null);
    setIsDrawerOpen(false);
  };

  const handleCloseDetailsHotel = () => {
    setIsDetailsDrawerOpen(false);
  };

  const handleDetailHotel = (hotelId: string) => {
    setHotelId(hotelId);
    setIsDetailsDrawerOpen(true);
  };

  const handleDeleteHotel = async (id: string) => {
    const loadingId = message.loading("Deleting...", 0);
    try {
      await mutateAsyncDeleteHotel(id);
      message.remove(loadingId);
      message.success("Delete hotel successful!");
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
            onClick={() => navigator.clipboard.writeText(hotel.name)}
          >
            <Copy className="mr-2 h-4 w-4 text-gray-500" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log("row", row)}>
            <Copy className="mr-2 h-4 w-4 text-gray-500" />
            Copy Name
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <RouteGuard permissionType="read">
            <DropdownMenuItem onClick={() => handleDetailHotel(hotel.id)}>
              <ExternalLink className="mr-2 h-4 w-4 text-blue-500" />
              View Details
            </DropdownMenuItem>
          </RouteGuard>
          <RouteGuard permissionType="edit">
            <DropdownMenuItem
              onClick={() => handleEditHotel(hotel.id)}
            >
              <Pen className="mr-2 h-4 w-4 text-yellow-500" />
              Edit
            </DropdownMenuItem>
          </RouteGuard>
          <RouteGuard permissionType="delete">
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDeleteHotel(hotel.id)}
            >
              {isPendingDeleteHotel ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash className="mr-2 h-4 w-4 text-red-500" />
              )}
              Delete
            </DropdownMenuItem>
          </RouteGuard>
        </DropdownMenuContent>
      </DropdownMenu>
        <CreateHotel
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        hideDefaultTrigger={true}
              onSuccess={handleCloseEditHotel}
              editedDataId={editedDataId}
      />
      {isDetailsDrawerOpen && (
        <DetailsHotel
          open={isDetailsDrawerOpen}
          onOpenChange={setIsDetailsDrawerOpen}
          hideDefaultTrigger={true}
          hotelId={hotelId}
          onSuccess={handleCloseDetailsHotel}
        />
      )}
    </>
  );
}
