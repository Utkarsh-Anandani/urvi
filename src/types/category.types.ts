import { CreateCategorySchema } from "@/schema/category.schema";
import z from "zod";

export type CreateCategoryBody = z.infer<typeof CreateCategorySchema>;

export type GetCategoriesResponse = {
  status: number;
  data: {
    id: string;
    name: string;
    productCount: number;
    imageURL: string | null;
    slug: string;
  }[];
};
