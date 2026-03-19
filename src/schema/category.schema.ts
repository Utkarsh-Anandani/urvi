import z from "zod";

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(120, "Name too long"),
});
