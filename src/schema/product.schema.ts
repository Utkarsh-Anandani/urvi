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

    categoryId: z.string().uuid().optional().nullable(),

    images: z
      .array(
        z.object({
          url: z.string().url("Image must have a valid URL").nullable(),
          position: z.number().int().min(0, "position must be positive"),
        }),
      )
      .min(1, "Atleast one image must exist"),

    variants: z
      .array(
        z.object({
          name: z.string().min(1, "Name must exist"),
          price: z
            .number({ message: "Price must be a number" })
            .positive("Price must be greater than 0"),
          discountPrice: z.number().optional().nullable(),
          stock: z
            .number()
            .int("Stock must be an integer")
            .min(0, "Stock cannot be negative"),
        }),
      )
      .min(1, "Atleast one variant must exist"),
      
    tags: z.array(z.string().min(1, "Tag must not be empty").max(8, "Max limit is 8 characters"))
  })

export const CreateReviewSchema = z.object({
  rating: z.int().min(0, "Min rating is 0 star").max(5, "Max rating is 5 star"),
  comment: z.string().min(1, "Comment can't be empty").max(100, "Comment can't exceed 100 characters"),
  productId: z.uuid("Must be a uuid"),
  variantId: z.uuid("Must be a uuid").optional(),
  media: z.array(z.object({
    type: z.enum(["IMAGE", "VIDEO"]),
    url: z.httpUrl()
  })).optional()
})
