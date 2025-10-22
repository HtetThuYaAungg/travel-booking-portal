import * as z from "zod";
import { UserEditFormValues } from "./edit-user";


export const UserTypeEnum = z.enum(["MAKER", "CHECKER"]);

export const userCreateSchema = z
  .object({
    id: z.string().optional(),
    email: z.string().email("Invalid email format"),
    staff_id: z.string().min(3, "Staff ID must be at least 3 characters"),
    full_name: z.string().min(2, "Full name must be at least 2 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    user_type: z.string().min(1, "Please select a user type"),
    // .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    // .regex(/[a-z]/, "Must contain at least one lowercase letter")
    // .regex(/[0-9]/, "Must contain at least one number")
    // .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirm_password: z.string(),
    status: z.string().optional(),
    department_code: z.string().min(1, "Please select a department"),
    role_code: z.string().min(1, "Please select a role"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export type UserFormValues = z.infer<typeof userCreateSchema>;
export type UserFormUnionValues = UserFormValues | UserEditFormValues;

export default userCreateSchema;
