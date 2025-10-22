"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTableHeader } from "@/components/data-table/data-table-header";
import { Badge } from "@/components/ui/badge";
import { UserTableActions } from "./user-actions";
import { User } from "@/api-config/services/user";

export const userCols: ColumnDef<User>[] = [
  {
    accessorKey: "staff_id",
    header: ({ column }) => (
      <DataTableHeader column={column} title="Staff Id" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="w-[60px] flex justify-center">
        {row.getValue("staff_id")}
      </Badge>
    ),
    enableSorting: true,
    enableResizing: true,
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => (
      <DataTableHeader column={column} title="Full Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className=" capitalize max-w-[300px] truncate">
          {row.getValue("full_name")}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableHeader column={column} title="Staff Mail" />
    ),
    cell: ({ row }) => {
      return (
        <div className=" max-w-[350px] truncate">{row.getValue("email")}</div>
      );
    },
  },

  {
    accessorKey: "department",
    header: ({ column }) => (
      <DataTableHeader column={column} title="Department" />
    ),
    cell: ({ row }) => {
      const department: any = row.getValue("department");
      return (
        <div className=" capitalize max-w-[300px] truncate">
          {department.department_name}
        </div>
      );
    },
  },
  {
    accessorKey: "user_type",
    header: ({ column }) => (
      <DataTableHeader column={column} title="User Type" />
    ),
    cell: ({ row }) => {
      return (
        <div className="capitalize">
          {row.getValue("user_type")?.toString().toLowerCase()}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableHeader column={column} title="Role" />,
    cell: ({ row }) => {
      const role: any = row.getValue("role");
      return (
        <div className=" capitalize max-w-[300px] truncate">
          {role.role_name}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <div
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs  ${
            status === "ACTIVE"
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {row.getValue("status")}
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
        <UserTableActions row={row} />
      </div>
    ),
  },
];
