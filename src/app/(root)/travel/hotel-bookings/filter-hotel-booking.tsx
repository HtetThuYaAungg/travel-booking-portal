"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TextInput } from "@/components/form-inputs/text-input";
import { NumberInput } from "@/components/form-inputs/number-input";
import { SelectBox } from "@/components/form-inputs/select-box";
import { DateInput } from "@/components/form-inputs/date-input";
import { FilterAccordion } from "@/components/filter-accordion";
import { Search } from "lucide-react";
import { hotelBookingFilterSchema, HotelBookingFilterValues } from "./schema/filter-hotel-booking";

interface HotelBookingFilterProps {
  filter: Record<string, string | number | boolean>;
  setFilter: (filter: Record<string, string | number | boolean>) => void;
}

export function HotelBookingFilter({ filter, setFilter }: HotelBookingFilterProps) {

  const form = useForm<HotelBookingFilterValues>({
    resolver: zodResolver(hotelBookingFilterSchema),
    defaultValues: {
      customer_name: (filter.customer_name as string) || "",
      customer_email: (filter.customer_email as string) || "",
      check_in_date_from: filter.check_in_date_from ? new Date(filter.check_in_date_from as string) : undefined,
      check_in_date_to: filter.check_in_date_to ? new Date(filter.check_in_date_to as string) : undefined,
      check_out_date_from: filter.check_out_date_from ? new Date(filter.check_out_date_from as string) : undefined,
      check_out_date_to: filter.check_out_date_to ? new Date(filter.check_out_date_to as string) : undefined,
      guests: filter.guests ? Number(filter.guests) : undefined,
      rooms: filter.rooms ? Number(filter.rooms) : undefined,
      status: (filter.status as "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED") || undefined,
      sort_by: (filter.sort_by as string) || "",
      sort_order: (filter.sort_order as "asc" | "desc") || "asc",
      page: Number(filter.page) || 1,
      limit: Number(filter.limit) || 10,
    },  
  });

  const onSubmit = (data: HotelBookingFilterValues) => {
    // Convert form data to filter object
    const newFilter: Record<string, string | number | boolean> = {
      page: 1, // Reset to first page when filtering
      limit: filter.limit || 10,
    };

    // Add non-empty values to filter
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (typeof value === "boolean" && value === true) {
          newFilter[key] = value;
        } else if (typeof value === "string" && value.trim() !== "") {
          newFilter[key] = value;
        } else if (typeof value === "number" && !isNaN(value)) {
          newFilter[key] = value;
        } else if (value instanceof Date) {
          // Convert Date objects to ISO string for API
          newFilter[key] = value.toISOString().split('T')[0] ; // Format as YYYY-MM-DD
        }
      }
    });

    setFilter(newFilter);
  };

  const handleReset = () => {
    form.reset({
      customer_name: "",
      customer_email: "",
      check_in_date_from: undefined,
      check_in_date_to: undefined,
      check_out_date_from: undefined,
      check_out_date_to: undefined,
      guests: undefined,
      rooms: undefined,
      status: undefined,
      sort_by: "",
      sort_order: "asc",
      page: 1,
      limit: Number(filter.limit) || 10,
    });
    setFilter({
      page: 1,
      limit: Number(filter.limit) || 10,
    });
  };

  const sortByOptions = [
    { value: "customer_name", label: "Customer Name" },
    { value: "customer_email", label: "Customer Email" },
    { value: "check_in_date_from", label: "Check In Date" },
    { value: "check_out_date_from", label: "Check Out Date" },
    { value: "total_price", label: "Total Price" },
    { value: "status", label: "Status" },
    { value: "created_at", label: "Created Date" },
  ];

  const sortOrderOptions = [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" },
  ];

  const statusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "APPROVED", label: "Approved" },
    { value: "REJECTED", label: "Rejected" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <FilterAccordion
      title="Hotel Booking Filters"
      defaultOpen={false}
      isActive={false}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              form={form}
              name="customer_name"
              label="Customer Name"
              placeholder="Enter customer name"
            />
            <TextInput
              form={form}
              name="customer_email"
              label="Customer Email"
              placeholder="Enter customer email"
            />
            <SelectBox
              control={form.control}
              name="status"
              label="Status"
              options={statusOptions}
              placeholder="Select status"
            />
          </div>
          
          <FilterAccordion title="Date Range" isActive={false}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateInput
                form={form}
                name="check_in_date_from"
                label="Check In Date From"
              />
              <DateInput
                form={form}
                name="check_in_date_to"
                label="Check In Date To"
              />
              <DateInput
                form={form}
                name="check_out_date_from"
                label="Check Out Date From"
              />
              <DateInput
                form={form}
                name="check_out_date_to"
                label="Check Out Date To"
              />
            </div>
          </FilterAccordion>

          <FilterAccordion title="Guests & Rooms" isActive={false}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NumberInput
                form={form}
                name="guests"
                label="Number of Guests"
                min={1}
              />
              <NumberInput
                form={form}
                name="rooms"
                label="Number of Rooms"
                min={1}
              />
            </div>
          </FilterAccordion>

          <FilterAccordion title="Sort" isActive={false}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectBox
                control={form.control}
                name="sort_by"
                label="Sort By"
                options={sortByOptions}
                placeholder="Select sort field"
              />
              <SelectBox
                control={form.control}
                name="sort_order"
                label="Sort Order"
                options={sortOrderOptions}
                placeholder="Select sort order"
              />
            </div>
          </FilterAccordion>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleReset}>
              Clear All
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </form>
      </Form>
    </FilterAccordion>
  );
}

export default HotelBookingFilter;
