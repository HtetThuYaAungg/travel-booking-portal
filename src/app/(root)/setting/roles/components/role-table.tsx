"use client";

import { useEffect, useState } from "react";

import { DataTable } from "@/components/data-table/data-table";
import { useGetAllRolesByFilter } from "@/api-config/queries/role";
import { roleCols } from "../cols/role-cols";
import FetchErrorAlert from "@/components/fetch-error-alert";
import { defaultPageNo, defaultPageSize } from "@/lib/constants";

type Props = {
  filter: Record<string, string | number>;
  setFilter: (filter: Record<string, string | number>) => void;
};

export function RoleTable({ filter, setFilter }: Props) {
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

  const { data:roleListData, isLoading:roleListLoading, error } = useGetAllRolesByFilter({
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
        description="Failed to load row data. Please try again."
      />
    );
  }

  return (
    <DataTable
      columns={roleCols}
      data={roleListData?.data.items || []}
      pageCount={
        roleListData ? Math.ceil(roleListData.data.total / pagination.limit) : 0
      }
      pagination={pagination}
      setPagination={handlePaginationChange}
      maxHeight="calc(100vh - 165px)"
      minHeight="calc(100vh - 165px)"
      isLoading={roleListLoading}
    />
  );
}

