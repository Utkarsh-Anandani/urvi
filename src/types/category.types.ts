import { CreateCategorySchema } from "@/schema/category.schema";
import z from "zod";

export type CreateCategoryBody = z.infer<typeof CreateCategorySchema>;

export type GetCategoriesResponse = {
  status: number;
  data: {
    name: string;
    productCount: number;
    imageURL: string | null;
    slug: string;
  }[];
};
