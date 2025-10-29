"use client";
import { RouteGuard } from "@/components/route-guard";
import TableSkeleton from "@/components/table-skeleton";
import React, { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CreateFlight from "./create-flight";
import { defaultPageSize } from "@/lib/constants";
import { FlightTable } from "./components/flight-table";
import FlightFilter from "./filter-flight";

const FlightPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handlePostCreated = () => {
    setIsModalOpen(false);
  };

  const [filter, setFilter] = useState<Record<string, string | number | boolean>>({
    page: 1,
    limit: defaultPageSize,
  });

  return (
    <RouteGuard permissionType="list">
      <div className=" container mx-auto pt-14 relative space-y-2">
        <div className="flex  justify-between items-center">
          <h1 className="text-lg font-semibold">Flight List</h1>

          <RouteGuard permissionType="create">
            <Button onClick={() => setIsModalOpen(true)} size={"icon"}>
              <PlusCircle className="h-3 w-3" />
            </Button>
          </RouteGuard>
        </div>
        <div className="w-full mb-1">
          <FlightFilter filter={filter} setFilter={setFilter} />
        </div>
        <FlightTable filter={filter} setFilter={setFilter} />

        <CreateFlight
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          hideDefaultTrigger={true}
          onSuccess={handlePostCreated}
        />
      </div>
    </RouteGuard>
  );
};

export default FlightPage;

