"use client";

import { useEffect, useState } from "react";

import { DataTable } from "@/components/data-table/data-table";
import { userCols } from "../cols/user-cols";
import { useGetAllUsersByFilter } from "@/api-config/queries/user";
import FetchErrorAlert from "@/components/fetch-error-alert";
import { defaultPageNo, defaultPageSize } from "@/lib/constants";

type Props = {
  filter: Record<string, string | number>;
  setFilter: (filter: Record<string, string | number>) => void;
};

export function UserTable({ filter, setFilter }: Props) {
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

  const { data:userList, isLoading: isUserListLoading, error } = useGetAllUsersByFilter({
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
        description="Failed to load user data. Please try again."
      />
    );
  }

  return (
    <DataTable
      columns={userCols}
      data={userList?.data.items || []}
      pageCount={userList ? Math.ceil(userList.data.total / pagination.limit) : 0}
      pagination={pagination}
      setPagination={handlePaginationChange}
      isLoading={isUserListLoading}
    />
  );
}

