import { Gender } from "@/generated/enums";
import z from "zod";

const phoneRegex = /^\d{10}$/;
const postalCodeRegex = /^\d{6}$/;

export const AddNewAddressSchema = z.object({
  fullName: z.string("Must be string").min(1),
  phone: z.string("Must be string").regex(phoneRegex, "Invalid Phone number"),
  line1: z.string("Must be string").min(6),
  line2: z.string("Must be string").optional(),
  city: z.string("Must be string").min(1),
  state: z.string("Must be string").min(1),
  country: z.string("Must be string").min(1),
  postalCode: z
    .string("Must be string")
    .regex(postalCodeRegex, "Invalid postal code"),
  isDefault: z.boolean(),
});

export const UpdateUserProfileSchema = z.object({
  firstName: z.string("Must be string").min(1),
  lastName: z.string().optional(),
  email: z.email().min(1),
  phone: z
    .string("Must be string")
    .regex(phoneRegex, "Invalid Phone number")
    .optional(),
  dob: z.string().optional(),
  gender: z.enum(Gender).optional(),
  image: z.url().optional(),
});
