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
import { useMessage } from "@/app/contexts/MessageContext";
import { useState } from "react";
import { RouteGuard } from "@/components/route-guard";
import { useDeletePermission } from "@/api-config/queries/permission";
import { Permission } from "@/api-config/services/permission";
import CreatePermission from "../create-permission";
import DetailsPermission from "../detail-permission";


interface DataTablePermissionActionsProps<TData> {
  row: Row<TData>;
}

export function PermissionTableActions<TData>({
  row,
}: DataTablePermissionActionsProps<TData>) {
  const permission = row.original as Permission;

  const message = useMessage();
  const {
    mutateAsync: mutateAsyncDeletePermission,
    isPending: isPendingDeletePermission,
  } = useDeletePermission();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [permissionId, setPermissionId] = useState<string | null>(null);
  const [editedDataId, setEditedDataId] = useState<string | null>(null);

  const handleEditPermission = (permissionId: string) => {
    setEditedDataId(permissionId);
    setIsDrawerOpen(true);
  };
  const handleCloseEditPermission = () => {
    setEditedDataId(null);
    setIsDrawerOpen(false);
  };

  const handleDetailPermission = (permissionId: string) => {
    setPermissionId(permissionId);
    setIsDetailsDrawerOpen(true);
  };
  const handleCloseDetailsPermission = () => {
    setPermissionId(null);
    setIsDetailsDrawerOpen(false);
  };

  const handleDeletePermission = async (id: string) => {
    const loadingId = message.loading("Deleting...", 0);
    try {
      await mutateAsyncDeletePermission(id);
      message.remove(loadingId);
      message.success("Delete permission successful!");
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
            onClick={() =>
              navigator.clipboard.writeText(permission.module)
            }
          >
            <Copy className="mr-2 h-4 w-4 text-gray-500" />
            Copy Module Name
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              navigator.clipboard.writeText(`${permission.module} : ${permission.action}`)
            }
          >
            <Copy className="mr-2 h-4 w-4 text-gray-500" />
            Copy Permission Name
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <RouteGuard permissionType="read">
            <DropdownMenuItem
              onClick={() => handleDetailPermission(permission.id)}
            >
              <ExternalLink className="mr-2 h-4 w-4 text-blue-500" />
              View Details
            </DropdownMenuItem>
          </RouteGuard>
          <RouteGuard permissionType="edit">
            <DropdownMenuItem
              onClick={() => handleEditPermission(permission.id)}
            >
              <Pen className="mr-2 h-4 w-4 text-yellow-500" />
              Edit
            </DropdownMenuItem>
          </RouteGuard>
          <RouteGuard permissionType="delete">
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDeletePermission(permission.id)}
            >
              {isPendingDeletePermission ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash className="mr-2 h-4 w-4 text-red-500" />
              )}
              Delete
            </DropdownMenuItem>
          </RouteGuard>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreatePermission
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        hideDefaultTrigger={true}
        editedDataId={editedDataId}
        onSuccess={handleCloseEditPermission}
      />
      {isDetailsDrawerOpen && (
        <DetailsPermission
          open={isDetailsDrawerOpen}
          onOpenChange={setIsDetailsDrawerOpen}
          hideDefaultTrigger={true}
          permissionId={permissionId}
          onSuccess={handleCloseDetailsPermission}
        />
      )}
    </>
  );
}
