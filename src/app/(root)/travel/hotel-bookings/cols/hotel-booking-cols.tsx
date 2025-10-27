"use client";

import { ColumnDef } from "@tanstack/react-table";
import { HotelBooking } from "@/api-config/services/hotel-booking";
import { Badge } from "@/components/ui/badge";
import { DataTableHeader } from "@/components/data-table/data-table-header";
import { HotelBookingTableActions } from "./hotel-booking-actions";
import { differenceInDays } from "date-fns";

export const hotelBookingColumns: ColumnDef<HotelBooking>[] = [
  {
    accessorKey: "customer_name",
    header: "Customer Name",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("customer_name")}</div>;
    },
  },
  {
    accessorKey: "customer_email",
    header: "Customer Email",
    cell: ({ row }) => {
      return <div>{row.getValue("customer_email")}</div>;
    },
  },
  {
    id: "hotel_name",
    header: "Hotel Name",
    cell: ({ row }) => {
      const hotel = row.original.hotel;
      return <div className="font-medium">{hotel.name || "N/A"}</div>;
    },
  },
  {
    accessorKey: "check_in_date",
    header: "Check In",
    cell: ({ row }) => {
      const date = new Date(row.getValue("check_in_date"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "check_out_date",
    header: "Check Out",
    cell: ({ row }) => {
      const date = new Date(row.getValue("check_out_date"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "guests",
    header: "Guests",
    cell: ({ row }) => {
      const guests = row.getValue("guests") as number;
      return <div>{guests}</div>;
    },
  },
  {
    accessorKey: "rooms",
    header: "Rooms",
    cell: ({ row }) => {
      const rooms = row.getValue("rooms") as number;
      return <div>{rooms}</div>;
    },
  },
  {
    id: "price",
    header: "Price",
    cell: ({ row }) => {
      const hotel = row.original.hotel;
      return <div>{hotel?.price.toLocaleString()}</div>;
    },
    },
    {
      id: "currency",
      header: "Currency",
      cell: ({ row }) => {
        const hotel = row.original.hotel;
        return <div>{hotel.currency}</div>;
      },
    },
    {
        id: "total_price",
        header: "Total Price",
        cell: ({ row }) => {
          const hotel = row.original.hotel;
          const price = hotel.price || 0;
            const rooms = row.getValue("rooms") as number;
            const checkInDate = row.getValue("check_in_date") as string;
            const checkOutDate = row.getValue("check_out_date") as string;
            const nights = differenceInDays(new Date(checkOutDate), new Date(checkInDate));
            const totalPrice = price * rooms * nights
            console.log("nights", nights);
            console.log("price", price);
            console.log("rooms", rooms);
            console.log("totalPrice", totalPrice);
            return <div>{totalPrice.toLocaleString()}</div>;
        },
    },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const getStatusVariant = (status: string) => {
        switch (status) {
          case "approved":
            return "default";
          case "rejected":
            return "destructive";
          case "cancelled":
            return "secondary";
          case "pending":
          default:
            return "outline";
        }
      };
      return (
        <Badge variant={getStatusVariant(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => (
      <div className="sticky right-0 bg-background px-1">
        <HotelBookingTableActions row={row} />
      </div>
    ),
  },
];
