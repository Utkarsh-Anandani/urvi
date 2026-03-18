"use server";
import { requireRole } from "@/lib/auth";
import client from "@/lib/prisma";
import { CreateProductSchema } from "@/schema/product.schema";
import { CreateProductBody } from "@/types/product.types";

export async function CreateProduct(body: CreateProductBody) {
  try {
    // await requireRole("ADMIN");

    const parsed = CreateProductSchema.safeParse(body);
    if (!parsed.success) return { status: 400, message: parsed.error.message };

    const {
      name,
      description,
      price,
      discountPrice,
      slug,
      stock,
      categoryId,
      images,
    } = parsed.data;

    const existing = await client.product.findUnique({
      where: {
        slug,
      },
    });
    if (existing)
      return { status: 400, message: "Name too common, try naming unique" };

    const product = await client.product.create({
      data: {
        name,
        description,
        price,
        discountPrice,
        stock,
        slug,
        isActive: true,
        categoryId,
        images: {
          create: images.map((img) => ({
            url: img.url,
            position: img.position,
          })),
        },
      },
    });

    if (product)
      return { status: 201, message: "Product created successfully" };

    return { status: 400, message: "Product creation failed" };
  } catch (error) {
    console.error("Error creating product: ",error)
    return { status: 500, message: "Product creation failed" };
  }
}
