import z from "zod";

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(8, "Password must be at least 8 characters"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_new_password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Passwords don't match",
    path: ["confirm_new_password"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default changePasswordSchema;
