"use client";
import { RouteGuard } from "@/components/route-guard";
import TableSkeleton from "@/components/table-skeleton";
import React, { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CreateHotel from "./create-hotel";
import { defaultPageSize } from "@/lib/constants";
import { HotelTable } from "./components/hotel-table";
import HotelFilter from "./filter-hotel";

const HotelPage = () => {
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
          <h1 className="text-lg font-semibold">Hotel List</h1>

          <RouteGuard permissionType="create">
            <Button onClick={() => setIsModalOpen(true)} size={"icon"}>
              <PlusCircle className="h-3 w-3" />
            </Button>
          </RouteGuard>
        </div>
        <div className="w-full mb-1">
          <HotelFilter filter={filter} setFilter={setFilter} />
        </div>
        <HotelTable filter={filter} setFilter={setFilter} />

        <CreateHotel
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          hideDefaultTrigger={true}
          onSuccess={handlePostCreated}
        />
      </div>
    </RouteGuard>
  );
};

export default HotelPage;
