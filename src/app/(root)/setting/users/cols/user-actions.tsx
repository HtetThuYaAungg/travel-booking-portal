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
import { User } from "@/api-config/services/user";
import { useDeleteUser } from "@/api-config/queries/user";
import { useMessage } from "@/app/contexts/MessageContext";
import { useState } from "react";
import CreateUser from "../create-user";
import { UserEditFormValues } from "../schema/edit-user";
import DetailsUser from "../detail-user";
import { RouteGuard } from "@/components/route-guard";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function UserTableActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const user = row.original as User;

  const message = useMessage();
  const { mutateAsync: mutateAsyncDeleteUser, isPending: isPendingDeleteUser } =
    useDeleteUser();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);

  const [userData, setUserData] = useState<UserEditFormValues | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [editedDataId, setEditedDataId] = useState<string | null>(null);

  const handleEditUser = (userId: string) => {
    setEditedDataId(userId);
    setIsDrawerOpen(true);
  };
  const handleCloseEditUser = () => {
    setEditedDataId(null);
    setIsDrawerOpen(false);
  };


  const handleCloseDetailsUser = () => {
    setIsDetailsDrawerOpen(false);
  };



  const handleDetailUser = (userId: string) => {
    setUserId(userId);
    setIsDetailsDrawerOpen(true);
  };

  const handleDeleteUser = async (id: string) => {
    const loadingId = message.loading("Deleting...", 0);
    try {
      await mutateAsyncDeleteUser(id);
      message.remove(loadingId);
      message.success("Delete user successful!");
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
            onClick={() => navigator.clipboard.writeText(user.staff_id)}
          >
            <Copy className="mr-2 h-4 w-4 text-gray-500" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log("row", row)}>
            <Copy className="mr-2 h-4 w-4 text-gray-500" />
            Copy Email
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <RouteGuard permissionType="read">
            <DropdownMenuItem onClick={() => handleDetailUser(user.id)}>
              <ExternalLink className="mr-2 h-4 w-4 text-blue-500" />
              View Details
            </DropdownMenuItem>
          </RouteGuard>
          <RouteGuard permissionType="edit">
            <DropdownMenuItem
              onClick={() => handleEditUser(user.id)}
              disabled={user.role.role_code === "SYS_ADMIN"}
            >
              <Pen className="mr-2 h-4 w-4 text-yellow-500" />
              Edit
            </DropdownMenuItem>
          </RouteGuard>
          <RouteGuard permissionType="delete">
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              disabled={user.role.role_code === "SYS_ADMIN"}
              onClick={() => handleDeleteUser(user.id)}
            >
              {isPendingDeleteUser ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash className="mr-2 h-4 w-4 text-red-500" />
              )}
              Delete
            </DropdownMenuItem>
          </RouteGuard>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateUser
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        hideDefaultTrigger={true}
        editedDataId={editedDataId}
        onSuccess={handleCloseEditUser}
      />
      {isDetailsDrawerOpen && (
        <DetailsUser
          open={isDetailsDrawerOpen}
          onOpenChange={setIsDetailsDrawerOpen}
          hideDefaultTrigger={true}
          userId={userId}
          onSuccess={handleCloseDetailsUser}
        />
      )}
    </>
  );
}
