import z from "zod";

export const SignUpSchema = z.object({
  email: z.email("Invalid Email"),
  firstName: z.string().min(1, "Firstname is required"),
  lastName: z.string().optional(),
  password: z
    .string()
    .min(6, "Password should consist of minimum 6 characters"),
});

export const SignInSchema = z.object({
  email: z.email("Invalid Email"),
  password: z
    .string()
    .min(6, "Password should consist of minimum 6 characters"),
});
