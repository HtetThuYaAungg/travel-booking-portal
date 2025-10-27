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
import { hotelFilterSchema, HotelFilterValues } from "./schema/filter-hotel";
import { useState } from "react";

interface HotelFilterProps {
  filter: Record<string, string | number | boolean>;
  setFilter: (filter: Record<string, string | number | boolean>) => void;
}

export function HotelFilter({ filter, setFilter }: HotelFilterProps) {
    const [isFilterActive, setIsFilterActive] = useState<boolean>(false);

  const form = useForm<HotelFilterValues>({
    resolver: zodResolver(hotelFilterSchema),
    defaultValues: {
      search: "",
      city: "",
      country: "",
      min_price: undefined,
      max_price: undefined,
      min_star_rating: undefined,
      min_rating: undefined,
      has_wifi: false,
      has_pool: false,
      has_spa: false,
      has_gym: false,
      has_restaurant: false,
      has_parking: false,
      has_pet_friendly: false,
      sort_by: "",
      sort_order: "asc",
      page: 1,
      limit: 10,
    },
  });

  const onSubmit = (data: HotelFilterValues) => {
    // Convert form data to filter object
    const newFilter: Record<string, string | number | boolean> = {
      page: 1, // Reset to first page when filtering
      limit: filter.limit || 10,
    };

    // Add non-empty values to filter
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== false) {
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
      limit: filter.limit || 10,
    });
  };

  const sortByOptions = [
    { value: "name", label: "Name" },
    { value: "price", label: "Price" },
    { value: "rating", label: "Rating" },
    { value: "star_rating", label: "Star Rating" },
    { value: "city", label: "City" },
    { value: "country", label: "Country" },
    { value: "created_at", label: "Created Date" },
  ];

  const sortOrderOptions = [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" },
  ];

  return (
    <FilterAccordion
      title="Hotel Filters"
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
              placeholder="Search by name, location, or city"
            />
            <TextInput
              form={form}
              name="city"
              label="City"
              placeholder="Enter city"
            />
            <TextInput
              form={form}
              name="country"
              label="Country"
              placeholder="Enter country"
            />
            <TextInput
              form={form}
              name="min_price"
              label="Minimum Price"
              type="number"
            />
            <TextInput
              form={form}
              name="max_price"
              label="Maximum Price"
              type="number"
            />
            <NumberInput
              form={form}
              name="min_rating"
              label="Minimum Rating"
              min={1}
              max={5}
            />
            <NumberInput
              form={form}
              name="min_star_rating"
              label="Minimum Star Rating"
              min={1}
              max={5}
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
                name="has_pool"
                label="Pool"
                labelSpan={3}
                inputSpan={2}
                mainSpan={5}
              />
              <CheckBox
                form={form}
                name="has_spa"
                label="Spa"
                labelSpan={3}
                inputSpan={2}
                mainSpan={5}
              />
              <CheckBox
                form={form}
                name="has_gym"
                label="Gym"
                labelSpan={3}
                inputSpan={2}
                mainSpan={5}
              />
              <CheckBox
                form={form}
                name="has_restaurant"
                label="Restaurant"
                labelSpan={3}
                inputSpan={2}
                mainSpan={5}
              />
              <CheckBox
                form={form}
                name="has_parking"
                label="Parking"
                labelSpan={3}
                inputSpan={2}
                mainSpan={5}
              />
              <CheckBox
                form={form}
                name="has_pet_friendly"
                label="Pet Friendly"
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

export default HotelFilter;