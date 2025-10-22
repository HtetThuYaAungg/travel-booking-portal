"use client";

import { DataTable } from "@/components/data-table/data-table";
import { hotelColumns } from "../cols/hotel-cols";
import { useGetAllHotelsByFilter } from "@/api-config/queries/hotel";
import { useState } from "react";
import { defaultPageNo, defaultPageSize } from "@/lib/constants";
import { useEffect } from "react";
import FetchErrorAlert from "@/components/fetch-error-alert";

type Props = {
  filter: Record<string, string | number | boolean>;
  setFilter: (filter: Record<string, string | number | boolean>) => void;
};

export function HotelTable({ filter, setFilter }: Props) {
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
    data: hotelList,
    isLoading: isHotelListLoading,
    error,
  } = useGetAllHotelsByFilter({
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
        description="Failed to load hotel data. Please try again."
      />
    );
  }

  return (
    <DataTable
      columns={hotelColumns}
      data={hotelList?.data.items || []}
      pageCount={
        hotelList ? Math.ceil(hotelList.data.total / pagination.limit) : 0
      }
      pagination={pagination}
      setPagination={handlePaginationChange}
      isLoading={isHotelListLoading}
    />
  );
};
