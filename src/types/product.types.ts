import {
  CreateProductSchema,
  CreateReviewSchema,
  UpdateProductSchema,
} from "@/schema/product.schema";
import z from "zod";

export type CreateProductBody = z.infer<typeof CreateProductSchema>;
export type CreateReviewBody = z.infer<typeof CreateReviewSchema>;
export type UpdateProductBody = z.infer<typeof UpdateProductSchema>;

export type GetAdminProductsResponse = {
  status: number;
  data: Product[];
};

export type GetUserProductsResponse = {
  status: number;
  data: Product[];
  nextCursor: string | null;
};

export type GetUserProductDetailsResponse = {
  status: number;
  data: Product;
  message?: string;
};

export type Variant = {
  id?: string;
  name: string;
  price: number;
  discountPrice: number | null;
  stock: number;
};

export type MediaType = "IMAGE" | "VIDEO";

export type Review = {
  media: {
    type: MediaType;
    url: string;
  }[];
  rating: number;
  comment: string | null;
  user: {
    image: string | null;
    firstName: string;
    lastName: string | null;
  };
  likes: number;
  createdAt: Date;
};

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
  avgRating: number;
  reviewCount: number;

  category: {
    name: string;
    id?: string;
  } | null;

  images:
    | {
        url: string;
        position: number;
      }[]
    | null;

  tags: string[];
  variants: Variant[];
  reviews?: Review[];
};
