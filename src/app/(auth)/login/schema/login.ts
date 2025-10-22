import * as z from "zod";


const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});


export type LoginFormValues = z.infer<typeof loginSchema>

export default loginSchema;