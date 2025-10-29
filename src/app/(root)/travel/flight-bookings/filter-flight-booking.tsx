"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TextInput } from "@/components/form-inputs/text-input";
import { NumberInput } from "@/components/form-inputs/number-input";
import { SelectBox } from "@/components/form-inputs/select-box";
import { DateInput } from "@/components/form-inputs/date-input";
import { CheckBox } from "@/components/form-inputs/check-box";
import { FilterAccordion } from "@/components/filter-accordion";
import { Search } from "lucide-react";
import { flightBookingFilterSchema, FlightBookingFilterValues } from "./schema/filter-flight-booking";

interface FlightBookingFilterProps {
  filter: Record<string, string | number | boolean>;
  setFilter: (filter: Record<string, string | number | boolean>) => void;
}

export function FlightBookingFilter({ filter, setFilter }: FlightBookingFilterProps) {

  const form = useForm<FlightBookingFilterValues>({
    resolver: zodResolver(flightBookingFilterSchema),
    defaultValues: {
      booking_reference: (filter.booking_reference as string) || "",
      customer_name: (filter.customer_name as string) || "",
      customer_email: (filter.customer_email as string) || "",
      customer_phone: (filter.customer_phone as string) || "",
      departure_date_from: filter.departure_date_from ? new Date(filter.departure_date_from as string) : undefined,
      departure_date_to: filter.departure_date_to ? new Date(filter.departure_date_to as string) : undefined,
      return_date_from: filter.return_date_from ? new Date(filter.return_date_from as string) : undefined,
      return_date_to: filter.return_date_to ? new Date(filter.return_date_to as string) : undefined,
      total_passengers: filter.total_passengers ? Number(filter.total_passengers) : undefined,
      status: (filter.status as "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED") || undefined,
      payment_status: (filter.payment_status as "PENDING" | "PAID" | "REFUNDED") || undefined,
      is_round_trip: filter.is_round_trip !== undefined ? Boolean(filter.is_round_trip) : undefined,
      sort_by: (filter.sort_by as string) || "",
      sort_order: (filter.sort_order as "asc" | "desc") || "asc",
      page: Number(filter.page) || 1,
      limit: Number(filter.limit) || 10,
    },  
  });

  const onSubmit = (data: FlightBookingFilterValues) => {
    // Convert form data to filter object
    const newFilter: Record<string, string | number | boolean> = {
      page: 1, // Reset to first page when filtering
      limit: filter.limit || 10,
    };

    // Add non-empty values to filter
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (typeof value === "boolean") {
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
      booking_reference: "",
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      departure_date_from: undefined,
      departure_date_to: undefined,
      return_date_from: undefined,
      return_date_to: undefined,
      total_passengers: undefined,
      status: undefined,
      payment_status: undefined,
      is_round_trip: undefined,
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
    { value: "booking_reference", label: "Booking Reference" },
    { value: "customer_name", label: "Customer Name" },
    { value: "customer_email", label: "Customer Email" },
    { value: "departure_date", label: "Departure Date" },
    { value: "total_price", label: "Total Price" },
    { value: "status", label: "Status" },
    { value: "payment_status", label: "Payment Status" },
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

  const paymentStatusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "PAID", label: "Paid" },
    { value: "REFUNDED", label: "Refunded" },
  ];

  return (
    <FilterAccordion
      title="Flight Booking Filters"
      defaultOpen={false}
      isActive={false}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              form={form}
              name="booking_reference"
              label="Booking Reference"
              placeholder="Enter booking reference"
            />
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
            <TextInput
              form={form}
              name="customer_phone"
              label="Customer Phone"
              placeholder="Enter customer phone"
            />
            <SelectBox
              control={form.control}
              name="status"
              label="Status"
              options={statusOptions}
              placeholder="Select status"
            />
            <SelectBox
              control={form.control}
              name="payment_status"
              label="Payment Status"
              options={paymentStatusOptions}
              placeholder="Select payment status"
            />
          </div>
          
          <FilterAccordion title="Date Range" isActive={false}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateInput
                form={form}
                name="departure_date_from"
                label="Departure Date From"
              />
              <DateInput
                form={form}
                name="departure_date_to"
                label="Departure Date To"
              />
              <DateInput
                form={form}
                name="return_date_from"
                label="Return Date From"
              />
              <DateInput
                form={form}
                name="return_date_to"
                label="Return Date To"
              />
            </div>
          </FilterAccordion>

          <FilterAccordion title="Passengers & Trip Type" isActive={false}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NumberInput
                form={form}
                name="total_passengers"
                label="Total Passengers"
                min={1}
              />
              <CheckBox
                form={form}
                name="is_round_trip"
                label="Round Trip Only"
                isRightLabel={true}
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

export default FlightBookingFilter;

