"use server";
import { requireRole } from "@/lib/auth";
import client from "@/lib/prisma";
import { CreateProductSchema } from "@/schema/product.schema";
import {
  CreateProductBody,
  GetAdminProductsResponse,
} from "@/types/product.types";
import { generateSlug } from "@/lib/helper";

export async function CreateProduct(body: CreateProductBody) {
  try {
    await requireRole("ADMIN");

    const parsed = CreateProductSchema.safeParse(body);
    if (!parsed.success) return { status: 400, message: parsed.error.message };

    const {
      name,
      description,
      price,
      discountPrice,
      stock,
      categoryId,
      images,
    } = parsed.data;

    const slug = generateSlug(name);
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
          //@ts-ignore
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
    console.error("Error creating product: ", error);
    return { status: 500, message: "Product creation failed" };
  }
}

export async function GetAdminProducts(): Promise<GetAdminProductsResponse> {
  try {
    await requireRole("ADMIN");

    const products = await client.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        name: true,
        price: true,
        stock: true,
        id: true,
        isActive: true,

        category: {
          select: {
            name: true,
          },
        },

        images: {
          where: {
            position: 0,
          },
          select: {
            url: true,
          },
        },
      },
    });

    const formatted = products.map((p) => ({
      ...p,
      image: p.images[0]?.url || null,
      images: null,
    }));

    return {
      status: 200,
      data: formatted,
    };
  } catch (error) {
    console.error("Error getting admin products: ", error);
    return { status: 500, data: [] };
  }
}
