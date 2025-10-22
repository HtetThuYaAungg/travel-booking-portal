"use client";

import { useEffect, useState } from "react";

import { DataTable } from "@/components/data-table/data-table";
import { permissionCols } from "../cols/permission-cols";
import { useGetAllPermissionsByFilter } from "@/api-config/queries/permission";
import FetchErrorAlert from "@/components/fetch-error-alert";
import { defaultPageNo, defaultPageSize } from "@/lib/constants";

type Props = {
  filter: Record<string, string | number>;
  setFilter: (filter: Record<string, string | number>) => void;
};

export function PermissionTable({ filter, setFilter }: Props) {
  const [pagination, setPagination] = useState({
    page: (filter.page as number) || defaultPageNo,
    limit: (filter.limit as number) || defaultPageSize,
  });

  useEffect(() => {
    setPagination({
      page: (filter.page as number) || defaultPageNo,
      limit: (filter.limit as number) || defaultPageSize,
    });
  }, [filter.page, filter.limit]);

  const {
    data: permissionList,
    isLoading: isPermissionListLoading,
    error,
  } = useGetAllPermissionsByFilter({
    ...filter,
    page: pagination.page,
    limit: pagination.limit,
  });

  const handlePaginationChange = (newPagination: {
    page: number;
    limit: number;
  }) => {
    setPagination(newPagination);
    setFilter({
      ...filter,
      page: newPagination.page,
      limit: newPagination.limit,
    });
  };

  if (error) {
    return (
      <FetchErrorAlert
        title="Error"
        description="Failed to load permission data. Please try again."
      />
    );
  }

  return (
    <DataTable
      columns={permissionCols}
      data={permissionList?.data.items || []}
      pageCount={
        permissionList
          ? Math.ceil(permissionList.data.total / pagination.limit)
          : 0
      }
      pagination={pagination}
      setPagination={handlePaginationChange}
      maxHeight="calc(100vh - 165px)"
      minHeight="calc(100vh - 165px)"
      isLoading={isPermissionListLoading}
    />
  );
}
