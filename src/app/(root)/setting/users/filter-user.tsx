"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ListFilter, ListRestart } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { FilterAccordion } from "@/components/filter-accordion";
import { TextInput } from "@/components/form-inputs/text-input";
import { DateRangeInput } from "@/components/form-inputs/date-range-input";
import { useGetAllCommonRoleList } from "@/api-config/queries/role";
import { useGetAllCommonDepartmentList } from "@/api-config/queries/department";
import { SelectBox } from "@/components/form-inputs/select-box";
import { defaultPageSize } from "@/lib/constants";

const statuses = [
  { value: "ACTIVE", label: "Active" },
  { value: "DELETE", label: "Delete" },
];

// Define the schema
const userFilterSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email format")
      .optional()
      .or(z.literal("")),
    staff_id: z
      .string()
      .min(3, "Staff ID must be at least 3 characters")
      .optional()
      .or(z.literal("")),
    full_name: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .optional()
      .or(z.literal("")),
    status: z.string().optional(),
    department_code: z.string().optional(),
    role_code: z.string().optional(),
    dateRange: z
      .object({
        from: z.date().optional(),
        to: z.date().optional(),
      })
      .optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.dateRange?.from && data.dateRange?.to) {
        return data.dateRange.to >= data.dateRange.from;
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["dateRange"],
    }
  );

type UserFilterValues = z.infer<typeof userFilterSchema>;

type Props = {
  filter: Record<string, string | number>;
  setFilter: (filter: Record<string, string | number>) => void;
};

export function UserFilterForm({ filter, setFilter }: Props) {
  const [isFilterActive, setIsFilterActive] = useState<boolean>(false);

  const { data: commonDepartmentData, isLoading: isLoadingCommonDepartment } =
    useGetAllCommonDepartmentList();
  const { data: commonRoleData, isLoading: isLoadingCommonRole } =
    useGetAllCommonRoleList();

  const form = useForm<UserFilterValues>({
    resolver: zodResolver(userFilterSchema),
    defaultValues: {
      email: (filter.email as string) || "",
      staff_id: (filter.staff_id as string) || "",
      full_name: (filter.full_name as string) || "",
      status: (filter.status as string) || "",
      department_code: (filter.department_code as string) || "",
      role_code: (filter.role_code as string) || "",
      dateRange: {
        from: filter.start_date
          ? new Date(filter.start_date as string)
          : undefined,
        to: filter.end_date ? new Date(filter.end_date as string) : undefined,
      },
      start_date: (filter.start_date as string) || "",
      end_date: (filter.end_date as string) || "",
    },
    mode: "onChange",
  });

  const dateRange = form.watch("dateRange");
  const formValues = form.watch();

  useEffect(() => {
    if (dateRange?.from) {
      form.setValue("start_date", format(dateRange.from, "yyyy-MM-dd"));
    } else {
      form.setValue("start_date", "");
    }

    if (dateRange?.to) {
      form.setValue("end_date", format(dateRange.to, "yyyy-MM-dd"));
    } else {
      form.setValue("end_date", "");
    }
  }, [dateRange, form]);

  useEffect(() => {
    form.reset({
      email: (filter.email as string) || "",
      staff_id: (filter.staff_id as string) || "",
      full_name: (filter.full_name as string) || "",
      status: (filter.status as string) || "",
      department_code: (filter.department_code as string) || "",
      role_code: (filter.role_code as string) || "",
      dateRange: {
        from: filter.start_date
          ? new Date(filter.start_date as string)
          : undefined,
        to: filter.end_date ? new Date(filter.end_date as string) : undefined,
      },
      start_date: (filter.start_date as string) || "",
      end_date: (filter.end_date as string) || "",
    });
  }, [filter, form]);

  useEffect(() => {
    const hasActiveFilter =
      !!formValues.email ||
      !!formValues.staff_id ||
      !!formValues.full_name ||
      !!formValues.status ||
      !!formValues.department_code ||
      !!formValues.role_code ||
      !!formValues.start_date ||
      !!formValues.end_date;

    setIsFilterActive(hasActiveFilter);
  }, [formValues]);

  const onSubmit = (data: UserFilterValues) => {
    const newFilter: Record<string, string | number> = {
      page: 1, // Reset to first page when filters change
      limit: filter.limit || defaultPageSize,
    };
    if (data.email) newFilter.email = data.email;
    if (data.staff_id) newFilter.staff_id = data.staff_id;
    if (data.full_name) newFilter.full_name = data.full_name;
    if (data.status) newFilter.status = data.status;
    if (data.department_code) newFilter.department_code = data.department_code;
    if (data.role_code) newFilter.role_code = data.role_code;
    if (data.start_date) newFilter.start_date = data.start_date;
    if (data.end_date) newFilter.end_date = data.end_date;

    setFilter(newFilter);
  };

  const handleReset = () => {
    setFilter({
      page: 1,
      limit: filter.limit || defaultPageSize,
    });
  };

  const departmentOptions = commonDepartmentData?.data.map((dept) => ({
    value: dept.department_code,
    label: dept.department_name,
  }));
  const roleOptions = commonRoleData?.data.map((role) => ({
    value: role.role_code,
    label: role.role_name,
  }));

  return (
    <FilterAccordion
      title="User Filters"
      defaultOpen={false}
      isActive={isFilterActive}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full"
        >
          <div className="grid max-[450px]:grid-cols-1 max-xl:grid-cols-2 grid-cols-3 gap-3">
            <TextInput
              form={form}
              name="staff_id"
              label="Staff ID"
              placeholder="Enter staff ID"
              isCol={true}
            />

            <TextInput
              form={form}
              name="full_name"
              label="Full Name"
              placeholder="Enter full name"
              isCol={true}
            />

            <TextInput
              form={form}
              name="email"
              label="Email"
              type="email"
              placeholder="Enter email address"
              isCol={true}
            />

            <SelectBox
              control={form.control}
              name="status"
              label="Status"
              options={statuses || []}
              searchable={true}
              placeholder="Select Status"
              emptyMessage="No Status found"
              isCol={true}
            />

            <SelectBox
              control={form.control}
              name="department_code"
              label="Department"
              options={departmentOptions || []}
              searchable={true}
              placeholder="Select department"
              emptyMessage="No departments found"
              isCol={true}
            />

            <SelectBox
              control={form.control}
              name="role_code"
              label="Role"
              options={roleOptions || []}
              searchable={true}
              placeholder="Select role"
              emptyMessage="No Roles found"
              isCol={true}
            />

            <DateRangeInput
              form={form}
              name="dateRange"
              label="Date Range"
              placeholder="Select date range"
              isCol={true}
            />

            <input type="hidden" {...form.register("start_date")} />
            <input type="hidden" {...form.register("end_date")} />
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleReset}
            >
              <ListRestart />
              Clear
            </Button>
            <Button type="submit" size="sm">
              <ListFilter />
              Apply
            </Button>
          </div>
        </form>
      </Form>
    </FilterAccordion>
  );
}
