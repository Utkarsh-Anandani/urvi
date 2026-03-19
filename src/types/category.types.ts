import { CreateCategorySchema } from "@/schema/category.schema";
import z from "zod";

export type CreateCategoryBody = z.infer<typeof CreateCategorySchema>;

export type GetAdminCategoriesResponse = {
  status: number;
  data: {
    name: string;
    productCount: number;
  }[];
};
