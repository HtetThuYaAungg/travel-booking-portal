"use client";

import { useEffect, useState } from "react";

import { DataTable } from "@/components/data-table/data-table";
import { departmentCols } from "../cols/department-cols";
import { useGetAllDepartmentsByFilter } from "@/api-config/queries/department";
import FetchErrorAlert from "@/components/fetch-error-alert";
import { defaultPageNo, defaultPageSize } from "@/lib/constants";

type Props = {
  filter: Record<string, string | number>;
  setFilter: (filter: Record<string, string | number>) => void;
};

export function DepartmentTable({ filter, setFilter }: Props) {
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
    data: departmentList,
    isLoading:isDepartmentListLoading,
    error,
  } = useGetAllDepartmentsByFilter({
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
        description="Failed to load department data. Please try again."
      />
    );
  }

  return (
    <DataTable
      columns={departmentCols}
      data={departmentList?.data.items || []}
      pageCount={
        departmentList
          ? Math.ceil(departmentList.data.total / pagination.limit)
          : 0
      }
      pagination={pagination}
      setPagination={handlePaginationChange}
      maxHeight="calc(100vh - 165px)"
      minHeight="calc(100vh - 165px)"
      isLoading={isDepartmentListLoading}
    />
  );
}
