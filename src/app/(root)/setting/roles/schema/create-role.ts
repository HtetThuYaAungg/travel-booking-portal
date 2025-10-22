import * as z from "zod";

export const roleCreateSchema = z.object({
  id: z.string().optional(),
  role_code: z.string().min(2, "Role code must be at least 2 characters"),
  role_name: z.string().min(3, "Role name must be at least 3 characters"),
  permissions: z.array(
    z.object({
      menuName: z.string(),
      subMenus: z
        .array(
          z.object({
            menuName: z.string(),
            actions: z.object({
              create: z.boolean(),
              delete: z.boolean(),
              edit: z.boolean(),
              list: z.boolean(),
              read: z.boolean(),
            }),
          })
        )
        .optional(),
      actions: z
        .object({
          create: z.boolean(),
          delete: z.boolean(),
          edit: z.boolean(),
          list: z.boolean(),
          read: z.boolean(),
        })
        .optional(),
    })
  ),
});

export type RoleFormValues = z.infer<typeof roleCreateSchema>;

export default roleCreateSchema;
