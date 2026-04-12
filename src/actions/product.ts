"use server";
import { requireAuth, requireRole } from "@/lib/auth";
import client from "@/lib/prisma";
import { CreateProductSchema, CreateReviewSchema } from "@/schema/product.schema";
import {
  CreateProductBody,
  CreateReviewBody,
  GetAdminProductsResponse,
  GetUserProductsResponse,
} from "@/types/product.types";
import { generateSlug } from "@/lib/helper";
import { categoryFilterSlugType } from "@/app/catalog/_components/category-panel";

export async function CreateProduct(body: CreateProductBody) {
  try {
    await requireRole("ADMIN");

    const parsed = CreateProductSchema.safeParse(body);
    if (!parsed.success) return { status: 400, message: parsed.error.message };

    const { name, description, categoryId, images, variants, tags } = parsed.data;

    const minPrice =
      variants.length > 0 ? Math.min(...variants.map((v) => v.price)) : 0;

    const discountPrices = variants
      .map((v) => v.discountPrice)
      .filter((p): p is number => p !== undefined);

    const minDiscountPrice =
      discountPrices.length > 0 ? Math.min(...discountPrices) : null;

    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

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
        price: minPrice,
        discountPrice: minDiscountPrice,
        stock: totalStock,
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
        variants: {
          create: variants.map((variant) => ({
            name: variant.name,
            price: variant.price,
            discountPrice: variant.discountPrice,
            stock: variant.stock
          }))
        },
        tags: {
          create: tags.map((tagName) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              }
            }
          }))
        }
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

export async function GetUserProducts({
  filter,
  cursor,
  limit = 10,
}: {
  filter: categoryFilterSlugType;
  cursor?: string;
  limit?: number;
}): Promise<GetUserProductsResponse> {
  try {
    let where: any = {
      isActive: true,
    };

    if (filter === "under-499") {
      where.OR = [
        { discountPrice: { lte: 499 } },
        {
          AND: [{ discountPrice: null }, { price: { lte: 499 } }],
        },
      ];
    }

    if (filter === "under-999") {
      where.OR = [
        { discountPrice: { lte: 999 } },
        {
          AND: [{ discountPrice: null }, { price: { lte: 999 } }],
        },
      ];
    }

    const categoryFiltersObject: Record<string, string> = {
      ghee: "Ghee",
      oils: "Oils",
      superfoods: "Superfoods",
      "best-deals": "Deals",
      "value-combos": "Combos",
    };

    const categoryName = categoryFiltersObject[filter] || null;

    if (categoryName) {
      where.category = {
        name: categoryName,
      };
    }

    const products = await client.product.findMany({
      where,
      take: limit + 1, // +1 to check if more data exists
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1, // skip current cursor
      }),

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        discountPrice: true,
        stock: true,
        isActive: true,
        createdAt: true,
        slug: true,
        variants: true,
        avgRating: true,
        reviewCount: true,

        category: {
          select: {
            name: true,
          },
        },

        images: {
          orderBy: {
            position: "asc",
          },
          select: {
            position: true,
            url: true,
          },
        },

        tags: {
          select: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const formatted = products.map((p) => ({
      ...p,
      tags: p.tags.map((t) => t.tag.name),
    }));

    let nextCursor: string | null = null;

    if (formatted.length > limit) {
      const nextItem = formatted.pop(); // remove extra item
      nextCursor = nextItem!.id;
    }

    return {
      status: 200,
      data: formatted,
      nextCursor,
    };
  } catch (error) {
    console.error("Error getting user products: ", error);
    return {
      status: 500,
      data: [],
      nextCursor: null,
    };
  }
}

export async function GetUserProductDetails(slug: string) {
  if (!slug || !slug.trim()) {
    return { status: 400, message: "Slug is required" };
  }
  try {
    const product = await client.product.findUnique({
      where: {
        slug: slug,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        discountPrice: true,
        stock: true,
        isActive: true,
        createdAt: true,
        slug: true,
        avgRating: true,
        reviewCount: true,

        category: {
          select: {
            name: true,
          },
        },

        images: {
          orderBy: {
            position: "asc",
          },
          select: {
            position: true,
            url: true,
          },
        },

        variants: true,

        tags: {
          select: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },

        reviews: {
          select: {
            rating: true,
            comment: true,
            media: {
              select: {
                url: true,
                type: true
              }
            },
            createdAt: true,
            likes: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                image: true
              }
            }
          }
        }
      },
    });

    if (!product) return { status: 404, message: "Product not found" };

    const formatted = {
      ...product,
      tags: product.tags?.map((t) => t.tag?.name).filter(Boolean) || [],
    };

    return {
      status: 200,
      data: formatted,
    };
  } catch (error) {
    console.error("Error getting user product detail: ", error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function AddReview(body: CreateReviewBody) {
  try {
    const session = await requireAuth();

    const parsed = CreateReviewSchema.safeParse(body);
    if(!parsed.success) {
      return { status: 400, message: parsed.error.message };
    }

    const { rating, comment, productId, variantId, media } = parsed.data;

    const result = await client.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: {
          id: productId,
        },
        select: {
          avgRating: true,
          reviewCount: true,
        }
      });

      if(!product) throw new Error("Product not found");

      const oldAvg = product?.avgRating || 0;
      const oldCount = product?.reviewCount || 0;

      const review = await tx.review.create({
        data: {
          rating,
          comment,
          userId: session?.id ? session.id : "",
          productId,
          variantId,
          media: media ? {
            create: media.map((m, i) => ({
              url: m.url,
              type: m.type,
              position: i
            }))
          } : undefined
        },
        include: {
          media: true
        }
      });

      const newCount = oldCount + 1;
      const newAvg = ((oldCount * oldAvg) + rating) / newCount;

      await tx.product.update({
        where: {
          id: productId
        },
        data: {
          avgRating: newAvg,
          reviewCount: newCount
        }
      });

      return review;
    });

    return {
      status: 200,
      data: result,
      message: "Review posted successfully"
    };
  } catch (error) {
    console.error("Error creating review: ", error);
    return {
      status: 500,
      message: error
    }
  }
}