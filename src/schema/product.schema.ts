import { z } from "zod";

export const CreateProductSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(120, "Name too long"),

    description: z
      .string()
      .min(3, "Description must be at least 3 characters")
      .max(120, "Description too long"),

    price: z
      .number({ message: "Price must be a number" })
      .positive("Price must be greater than 0"),

    discountPrice: z.number().optional().nullable(),

    stock: z
      .number()
      .int("Stock must be an integer")
      .min(0, "Stock cannot be negative"),

    categoryId: z.string().uuid().optional().nullable(),

    images: z
      .array(
        z.object({
          url: z.string().url("Image must have a valid URL").nullable(),
          position: z.number().int().min(0, "position must be positive"),
        }),
      )
      .min(1, "Atleast one image must exist"),
  })
  .refine((data) => !data.discountPrice || data.discountPrice < data.price, {
    message: "Discount price must be less than actual price",
    path: ["discountPrice"],
  })
