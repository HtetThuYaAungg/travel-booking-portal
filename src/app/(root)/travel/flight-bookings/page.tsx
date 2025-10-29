"use client";
import { RouteGuard } from "@/components/route-guard";
import React, { useState } from "react";
import { defaultPageSize } from "@/lib/constants";
import { FlightBookingTable } from "./components/flight-booking-table";
import FlightBookingFilter from "./filter-flight-booking";

const FlightBookingPage = () => {
  const [filter, setFilter] = useState<Record<string, string | number | boolean>>({
    page: 1,
    limit: defaultPageSize,
  });

  return (
    <RouteGuard permissionType="list">
      <div className=" container mx-auto pt-14 relative space-y-2">
        <div className="flex  justify-between items-center">
          <h1 className="text-lg font-semibold">Flight Bookings</h1>
        </div>
        <div className="w-full mb-1">
          <FlightBookingFilter filter={filter} setFilter={setFilter} />
        </div>
        <FlightBookingTable filter={filter} setFilter={setFilter} />
      </div>
    </RouteGuard>
  );
};

export default FlightBookingPage;

