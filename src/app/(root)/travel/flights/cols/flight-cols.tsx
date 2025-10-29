"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Flight } from "@/api-config/services/flight";
import { Badge } from "@/components/ui/badge";
import { Plane } from "lucide-react";
import { FlightTableActions } from "./flight-actions";
import { DataTableHeader } from "@/components/data-table/data-table-header";

export const flightColumns: ColumnDef<Flight>[] = [
  {
    accessorKey: "flight_number",
    header: "Flight Number",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("flight_number")}</div>;
    },
  },
  {
    accessorKey: "airline_name",
    header: "Airline",
    cell: ({ row }) => {
      return <div>{row.getValue("airline_name")}</div>;
    },
  },
  {
    accessorKey: "aircraft_type",
    header: "Aircraft",
    cell: ({ row }) => {
      return <div>{row.getValue("aircraft_type")}</div>;
    },
  },
  {
    accessorKey: "departure_airport_code",
    header: "Departure",
    cell: ({ row }) => {
      const flight = row.original as Flight;
      return (
        <div>
          <div className="font-medium">{flight.departure_airport_code}</div>
          <div className="text-sm text-muted-foreground">{flight.departure_city}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "arrival_airport_code",
    header: "Arrival",
    cell: ({ row }) => {
      const flight = row.original as Flight;
      return (
        <div>
          <div className="font-medium">{flight.arrival_airport_code}</div>
          <div className="text-sm text-muted-foreground">{flight.arrival_city}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "departure_time",
    header: "Departure Time",
    cell: ({ row }) => {
      const departureTime = new Date(row.getValue("departure_time"));
      return <div>{departureTime.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "arrival_time",
    header: "Arrival Time",
    cell: ({ row }) => {
      const arrivalTime = new Date(row.getValue("arrival_time"));
      return <div>{arrivalTime.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "duration_minutes",
    header: "Duration",
    cell: ({ row }) => {
      const duration = row.getValue("duration_minutes") as number;
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return <div>{hours}h {minutes}m</div>;
    },
  },
  {
    accessorKey: "base_price",
    header: "Price",
    cell: ({ row }) => {
      const flight = row.original as Flight;
      return (
        <div>
          <div className="font-medium">{flight.base_price}</div>
          <div className="text-sm text-muted-foreground">{flight.currency}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "available_seats",
    header: "Available Seats",
    cell: ({ row }) => {
      const flight = row.original as Flight;
      const availableSeats = flight.available_seats;
      const totalSeats = flight.total_seats;
      const percentage = (availableSeats / totalSeats) * 100;
      
      return (
        <div>
          <div className="font-medium">{availableSeats}/{totalSeats}</div>
          <div className="text-sm text-muted-foreground">{percentage.toFixed(0)}%</div>
        </div>
      );
    },
  },
  {
    accessorKey: "class_type",
    header: "Class",
    cell: ({ row }) => {
      const classType = row.getValue("class_type") as string;
      return (
        <Badge variant="outline">
          {classType}
        </Badge>
      );
    },
  },
  {
    accessorKey: "is_domestic",
    header: "Type",
    cell: ({ row }) => {
      const isDomestic = row.getValue("is_domestic") as boolean;
      return (
        <Badge variant={isDomestic ? "default" : "secondary"}>
          {isDomestic ? "Domestic" : "International"}
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
    header: ({ table, column }) => (
      <DataTableHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => (
      <div className="sticky right-0 bg-background px-1">
        <FlightTableActions row={row} />
      </div>
    ),
  },
];

