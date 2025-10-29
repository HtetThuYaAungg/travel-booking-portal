"use client";

import { DataTable } from "@/components/data-table/data-table";
import { flightColumns } from "../cols/flight-cols";
import { useGetAllFlightsByFilter } from "@/api-config/queries/flight";
import { useState } from "react";
import { defaultPageNo, defaultPageSize } from "@/lib/constants";
import { useEffect } from "react";
import FetchErrorAlert from "@/components/fetch-error-alert";

type Props = {
  filter: Record<string, string | number | boolean>;
  setFilter: (filter: Record<string, string | number | boolean>) => void;
};

export function FlightTable({ filter, setFilter }: Props) {
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
    data: flightList,
    isLoading: isFlightListLoading,
    error,
  } = useGetAllFlightsByFilter({
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
        description="Failed to load flight data. Please try again."
      />
    );
  }

  return (
    <DataTable
      columns={flightColumns}
      data={flightList?.data.items || []}
      pageCount={
        flightList ? Math.ceil(flightList.data.total / pagination.limit) : 0
      }
      pagination={pagination}
      setPagination={handlePaginationChange}
      isLoading={isFlightListLoading}
    />
  );
};

