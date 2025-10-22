import * as z from "zod";

export const permissionCreateSchema = z.object({
  id: z.string().optional(),
  description: z.string().optional(),
  module: z.string().min(5, "Module must be at least 5 characters"),
  action: z.string().min(1, "Please select an action"),
});

export type PermissionFormValues = z.infer<typeof permissionCreateSchema>;

export default permissionCreateSchema;
