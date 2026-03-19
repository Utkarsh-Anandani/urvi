import { CreateProductSchema } from "@/schema/product.schema";
import z from "zod";

export type CreateProductBody = z.infer<typeof CreateProductSchema>;

export type GetAdminProductsResponse = {
  status: number;
  data: {
    id: string;
    name: string;
    price: number;
    stock: number;
    isActive: boolean;

    category: {
      name: string;
    } | null;

    images:
      | {
          url: string;
        }[]
      | null;

    image: string | null;
  }[];
};
