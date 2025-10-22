import * as z from "zod";
import { UserTypeEnum } from "./create-user";

export const userEditSchema = z
  .object({
    id: z.string().optional(),
    email: z.string().email("Invalid email format"),
    staff_id: z.string().min(3, "Staff ID must be at least 3 characters"),
    full_name: z.string().min(2, "Full name must be at least 2 characters"),
    user_type: z.string().min(1, "Please select a user type"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional(),
    confirm_password: z.string().optional(),
    status: z.string().optional(),
    department_code: z.string().min(1, "Please select a department"),
    role_code: z.string().min(1, "Please select a role"),
  })
  .refine(
    (data) => {
      // Only validate if either password or confirmPassword is provided
      if (data.password || data.confirm_password) {
        return data.password === data.confirm_password;
      }
      return true; // Skip validation if both are empty
    },
    {
      message: "Passwords don't match",
      path: ["confirm_password"],
    }
  );

export type UserEditFormValues = z.infer<typeof userEditSchema>;
