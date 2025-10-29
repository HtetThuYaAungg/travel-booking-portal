"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TextInput } from "@/components/form-inputs/text-input";
import { NumberInput } from "@/components/form-inputs/number-input";
import { SelectBox } from "@/components/form-inputs/select-box";
import { CheckBox } from "@/components/form-inputs/check-box";
import { FilterAccordion } from "@/components/filter-accordion";
import { Search, RotateCcw } from "lucide-react";
import { flightFilterSchema, FlightFilterValues } from "./schema/filter-flight";
import { useState } from "react";
import { defaultPageSize } from "@/lib/constants";

interface FlightFilterProps {
  filter: Record<string, string | number | boolean>;
  setFilter: (filter: Record<string, string | number | boolean>) => void;
}

export function FlightFilter({ filter, setFilter }: FlightFilterProps) {
    const [isFilterActive, setIsFilterActive] = useState<boolean>(false);

  const form = useForm<FlightFilterValues>({
    resolver: zodResolver(flightFilterSchema),
    defaultValues: {
      search: "",
      departure_airport_code: "",
      arrival_airport_code: "",
      departure_city: "",
      arrival_city: "",
      airline_name: "",
      airline_code: "",
      departure_date: "",
      min_price: undefined,
      max_price: undefined,
      class_type: "",
      has_wifi: false,
      has_meal: false,
      is_domestic: false,
      min_available_seats: undefined,
      status: "",
      sort_by: "",
      sort_order: "asc",
    },
  });

  const onSubmit = (data: FlightFilterValues) => {
    // Convert form data to filter object
    const newFilter: Record<string, string | number | boolean> = {
      page: 1, // Reset to first page when filtering
      limit: filter.limit || defaultPageSize,
    };

    // Add non-empty values to filter
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== "" ) {
        if (typeof value === "boolean" && value === true) {
          newFilter[key] = value;
        } else if (typeof value === "string" && value.trim() !== "") {
          newFilter[key] = value;
        } else if (typeof value === "number" && !isNaN(value)) {
          newFilter[key] = value;
        }
      }
    });

    setFilter(newFilter);
  };

  const handleReset = () => {
    form.reset();
    setFilter({
      page: 1,
      limit: filter.limit || defaultPageSize,
    });
  };

  const sortByOptions = [
    { value: "flight_number", label: "Flight Number" },
    { value: "airline_name", label: "Airline" },
    { value: "departure_time", label: "Departure Time" },
    { value: "arrival_time", label: "Arrival Time" },
    { value: "base_price", label: "Price" },
    { value: "duration_minutes", label: "Duration" },
    { value: "available_seats", label: "Available Seats" },
    { value: "created_at", label: "Created Date" },
  ];

  const sortOrderOptions = [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" },
  ];

  const classTypeOptions = [
    { value: "Economy", label: "Economy" },
    { value: "Business", label: "Business" },
    { value: "First", label: "First" },
    { value: "Premium Economy", label: "Premium Economy" },
  ];

  return (
    <FilterAccordion
      title="Flight Filters"
      defaultOpen={false}
      isActive={isFilterActive}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              form={form}
              name="search"
              label="Search"
              placeholder="Search by flight number, airline, or route"
            />
            <TextInput
              form={form}
              name="airline_name"
              label="Airline Name"
              placeholder="Enter airline name"
            />
            <TextInput
              form={form}
              name="airline_code"
              label="Airline Code"
              placeholder="Enter airline code"
            />
            <TextInput
              form={form}
              name="departure_airport_code"
              label="Departure Airport"
              placeholder="Enter departure airport code"
            />
            <TextInput
              form={form}
              name="arrival_airport_code"
              label="Arrival Airport"
              placeholder="Enter arrival airport code"
            />
            <TextInput
              form={form}
              name="departure_city"
              label="Departure City"
              placeholder="Enter departure city"
            />
            <TextInput
              form={form}
              name="arrival_city"
              label="Arrival City"
              placeholder="Enter arrival city"
            />
            <TextInput
              form={form}
              name="departure_date"
              label="Departure Date"
              type="date"
            />
            <NumberInput
              form={form}
              name="min_price"
              label="Minimum Price"
              min={0}
            />
            <NumberInput
              form={form}
              name="max_price"
              label="Maximum Price"
              min={0}
            />
            <NumberInput
              form={form}
              min={0}
              name="min_available_seats"
              label="Minimum Available Seats"
            />
            <SelectBox
              control={form.control}
              name="class_type"
              label="Class Type"
              options={classTypeOptions}
              placeholder="Select class type"
            />
          </div>
          <FilterAccordion title="Amenities" isActive={false}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <CheckBox
                form={form}
                name="has_wifi"
                label="WiFi"
                labelSpan={3}
                inputSpan={2}
                mainSpan={5}
              />
              <CheckBox
                form={form}
                name="has_meal"
                label="Meal"
                labelSpan={3}
                inputSpan={2}
                mainSpan={5}
              />
              <CheckBox
                form={form}
                name="is_domestic"
                label="Domestic Flight"
                labelSpan={3}
                inputSpan={2}
                mainSpan={5}
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

export default FlightFilter;

