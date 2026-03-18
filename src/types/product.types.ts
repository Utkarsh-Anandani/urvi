import { CreateProductSchema } from "@/schema/product.schema";
import z from "zod";

export type CreateProductBody = z.infer<typeof CreateProductSchema>;