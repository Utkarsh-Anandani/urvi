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

export type GetUserProductsResponse = {
  status: number;
  data: Product[];
  nextCursor: string | null;
};

export type GetUserProductDetailsResponse = {
  status: number,
  data: Product,
  message?: string
}

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discountPrice: number | null;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  slug: string;

  category: {
    name: string;
  } | null;

  images:
    | {
        url: string;
        position: number;
      }[]
    | null;
  
    tags: string[]
};
