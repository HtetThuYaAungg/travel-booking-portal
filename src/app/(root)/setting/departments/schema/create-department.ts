import * as z from "zod";

export const departmentCreateSchema = z.object({
  id: z.string().optional(),
  department_code: z
    .string()
    .min(2, "Department code must be at least 2 characters"),
  department_name: z
    .string()
    .min(3, "Department name must be at least 3 characters"),
});

export type DepartmentFormValues = z.infer<typeof departmentCreateSchema>;

export default departmentCreateSchema;
