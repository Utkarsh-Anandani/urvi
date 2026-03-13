import { SignInSchema, SignUpSchema } from "@/schema/auth.schema";
import z from "zod";

export type SignUpBody = z.infer<typeof SignUpSchema>;

export type SignInBody = z.infer<typeof SignInSchema>;
