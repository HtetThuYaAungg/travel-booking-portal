"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FlightBooking } from "@/api-config/services/flight-booking";
import { Badge } from "@/components/ui/badge";
import { DataTableHeader } from "@/components/data-table/data-table-header";
import { FlightBookingTableActions } from "./flight-booking-actions";

export const flightBookingColumns: ColumnDef<FlightBooking>[] = [
  {
    accessorKey: "booking_reference",
    header: "Booking Reference",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("booking_reference")}</div>;
    },
  },
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
    accessorKey: "customer_phone",
    header: "Customer Phone",
    cell: ({ row }) => {
      return <div>{row.getValue("customer_phone")}</div>;
    },
  },
  {
    id: "flight_info",
    header: "Flight",
    cell: ({ row }) => {
      const flight = row.original.flight;
      return (
        <div>
          <div className="font-medium">{flight?.flight_number || "N/A"}</div>
          <div className="text-sm text-muted-foreground">
            {flight?.departure_airport_code} → {flight?.arrival_airport_code}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "departure_date",
    header: "Departure Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("departure_date"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "return_date",
    header: "Return Date",
    cell: ({ row }) => {
      const returnDate = row.getValue("return_date") as string | null;
      if (!returnDate) return <div className="text-muted-foreground">N/A</div>;
      const date = new Date(returnDate);
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "total_passengers",
    header: "Passengers",
    cell: ({ row }) => {
      const passengers = row.getValue("total_passengers") as number;
      return <div>{passengers}</div>;
    },
  },
  {
    id: "is_round_trip",
    header: "Trip Type",
    cell: ({ row }) => {
      const isRoundTrip = row.original.is_round_trip;
      return (
        <Badge variant={isRoundTrip ? "default" : "secondary"}>
          {isRoundTrip ? "Round Trip" : "One Way"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "total_price",
    header: "Total Price",
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <div>
          <div className="font-medium">{booking.price_formatted || `${booking.currency} ${booking.total_price.toFixed(2)}`}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const getStatusVariant = (status: string) => {
        switch (status.toLowerCase()) {
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
    accessorKey: "payment_status",
    header: "Payment Status",
    cell: ({ row }) => {
      const paymentStatus = row.getValue("payment_status") as string;
      const getPaymentStatusVariant = (status: string) => {
        switch (status.toLowerCase()) {
          case "paid":
            return "default";
          case "refunded":
            return "secondary";
          case "pending":
          default:
            return "outline";
        }
      };
      return (
        <Badge variant={getPaymentStatusVariant(paymentStatus)}>
          {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
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
        <FlightBookingTableActions row={row} />
      </div>
    ),
  },
];

