"use client";
import { RouteGuard } from "@/components/route-guard";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CreateRole from "./create-role";
import { RoleTable } from "./components/role-table";
import { defaultPageNo, defaultPageSize } from "@/lib/constants";

const RolePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleRoleCreated = () => {
    setIsModalOpen(false);
  };

  const [filter, setFilter] = useState<Record<string, string | number>>({
    page: defaultPageNo,
    limit: defaultPageSize,
  });

  return (
    <RouteGuard permissionType="list">
      <div className=" container mx-auto pt-14 relative space-y-2">
        <div className="flex  justify-between items-center">
          <h1 className="text-lg font-semibold">Role List</h1>

          <RouteGuard permissionType="create">
            <Button onClick={() => setIsModalOpen(true)} size={"icon"}>
              <PlusCircle className="h-3 w-3" />
            </Button>
          </RouteGuard>
        </div>
        <div className="w-full mb-1">
        </div>
        <RoleTable filter={filter} setFilter={setFilter} />
        <CreateRole
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          hideDefaultTrigger={true}
          onSuccess={handleRoleCreated}
        />
      </div>
    </RouteGuard>
  );
};

export default RolePage;
