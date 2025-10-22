"use client";
import { RouteGuard } from "@/components/route-guard";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CreateDepartment from "./create-department";
import { DepartmentTable } from "./components/department-table";
import { defaultPageNo, defaultPageSize } from "@/lib/constants";

const DepartmentPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDepartmentCreated = () => {
    setIsDrawerOpen(false);
  };

  const [filter, setFilter] = useState<Record<string, string | number>>({
    page: defaultPageNo,
    limit: defaultPageSize,
  });

  return (
    <RouteGuard permissionType="list">
      <div className=" container mx-auto pt-14 relative space-y-2">
        <div className="flex  justify-between items-center">
          <h1 className="text-lg font-semibold">Department List</h1>

          <RouteGuard permissionType="create">
            <Button onClick={() => setIsDrawerOpen(true)} size={"icon"}>
              <PlusCircle className="h-3 w-3" />
            </Button>
          </RouteGuard>
        </div>
        <div className="w-full mb-1"></div>
        <DepartmentTable filter={filter} setFilter={setFilter} />
        <CreateDepartment
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          hideDefaultTrigger={true}
          onSuccess={handleDepartmentCreated}
        />
      </div>
    </RouteGuard>
  );
};

export default DepartmentPage;
