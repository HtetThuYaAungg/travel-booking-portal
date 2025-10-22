"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTableHeader } from "@/components/data-table/data-table-header";
import { Badge } from "@/components/ui/badge";
import { RoleTableActions } from "./role-actions";
import { Role } from "@/api-config/services/role";

export const roleCols: ColumnDef<Role>[] = [
  {
    accessorKey: "role_code",
    header: ({ column }) => (
      <DataTableHeader column={column} title="Role Code" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="w-[100px] flex justify-center">
        {row.getValue("role_code")}
      </Badge>
    ),
    enableSorting: true,
    enableResizing: true,
  },
  {
    accessorKey: "role_name",
    header: ({ column }) => (
      <DataTableHeader column={column} title="Role Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className=" max-w-[350px] truncate">
          {row.getValue("role_name")}
        </div>
      );
    },
  },
  {
    accessorKey: "created_by",
    header: ({ column }) => (
      <DataTableHeader column={column} title="Created By" />
    ),
    cell: ({ row }) => {
      const created_by: any = row.getValue("created_by");
      return (
        <div className=" capitalize max-w-[300px] truncate">
          {created_by ? created_by.full_name : "-"}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: ({ table, column }) => (
      <DataTableHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => (
      <div className="sticky right-0 bg-background px-1">
        <RoleTableActions row={row} />
      </div>
    ),
  },
];
