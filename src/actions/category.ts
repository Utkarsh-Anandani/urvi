"use server";

import { requireRole } from "@/lib/auth";
import { generateSlug } from "@/lib/helper";
import client from "@/lib/prisma";
import { CreateCategorySchema } from "@/schema/category.schema";
import { CreateCategoryBody } from "@/types/category.types";

export async function CreateCategory(body: CreateCategoryBody) {
  try {
    await requireRole("ADMIN");

    const parsed = CreateCategorySchema.safeParse(body);
    if (!parsed.success) return { status: 400, message: parsed.error.message };

    const { name } = parsed.data;

    const slug = generateSlug(name);
    const existing = await client.category.findUnique({
      where: {
        slug,
      },
    });
    if (existing)
      return { status: 400, message: "Name too common, try naming unique" };

    const category = await client.category.create({
      data: {
        name,
        slug,
      },
    });

    if (category)
      return { status: 201, message: "Category created successfully" };
    return { status: 400, message: "Category creation failed" };
  } catch (error) {
    console.error("Error creating category: ", error);
    return { status: 500, message: "Internal server error" };
  }
}

export async function GetAdminCategories() {
  try {
    await requireRole("ADMIN");

    const categories = await client.category.findMany({
      select: {
        name: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    const formatted = categories.map((cat) => ({
      name: cat.name,
      productCount: cat._count.products,
    }));

    return {
      status: 200,
      data: formatted,
    };
  } catch (error) {
    console.error("Error getting admin categories: ", error);
    return { status: 500, data: [] };
  }
}
