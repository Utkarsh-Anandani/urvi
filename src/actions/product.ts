"use server";
import { requireServerAuth, requireRole } from "@/lib/auth";
import client from "@/lib/prisma";
import {
  CreateProductSchema,
  CreateReviewSchema,
  UpdateProductSchema,
} from "@/schema/product.schema";
import {
  CreateProductBody,
  CreateReviewBody,
  GetAdminProductsResponse,
  GetUserProductsResponse,
  SearchProductsReturnType,
  UpdateProductBody,
} from "@/types/product.types";
import { generateSlug } from "@/lib/helper";
import { categoryFilterSlugType } from "@/app/catalog/_components/category-panel";

export async function CreateProduct(body: CreateProductBody) {
  try {
    await requireRole("ADMIN");

    const parsed = CreateProductSchema.safeParse(body);
    if (!parsed.success) return { status: 400, message: parsed.error.message };

    const { name, description, categoryId, images, variants, tags } =
      parsed.data;

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
          //@ts-expect-error
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
            stock: variant.stock,
          })),
        },
        tags: {
          create: tags.map((tagName) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
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

export async function UpdateProduct(body: UpdateProductBody) {
  try {
    await requireRole("ADMIN");

    const parsed = UpdateProductSchema.safeParse(body);
    if (!parsed.success) {
      return { status: 400, message: parsed.error.message };
    }

    const {
      id: productId,
      name,
      description,
      categoryId,
      images,
      variants,
      tags,
    } = parsed.data;

    const minPrice =
      variants.length > 0 ? Math.min(...variants.map((v) => v.price)) : 0;

    const discountPrices = variants
      .map((v) => v.discountPrice)
      .filter((p): p is number => p !== undefined);

    const minDiscountPrice =
      discountPrices.length > 0 ? Math.min(...discountPrices) : null;

    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

    const slug = generateSlug(name);

    const existing = await client.product.findFirst({
      where: {
        slug,
        NOT: { id: productId },
      },
    });

    if (existing) {
      return { status: 400, message: "Name too common, try naming unique" };
    }

    await client.$transaction([
      client.productImage.deleteMany({ where: { productId } }),
      client.productVariant.deleteMany({ where: { productId } }),
      client.productTag.deleteMany({ where: { productId } }),

      client.product.update({
        where: { id: productId },
        data: {
          name,
          description,
          price: minPrice,
          discountPrice: minDiscountPrice,
          stock: totalStock,
          slug,
          categoryId,

          images: {
            //@ts-expect-error
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
              stock: variant.stock,
            })),
          },

          tags: {
            create: tags.map((tagName) => ({
              tag: {
                connectOrCreate: {
                  where: { name: tagName },
                  create: { name: tagName },
                },
              },
            })),
          },
        },
      }),
    ]);

    return { status: 200, message: "Product updated successfully" };
  } catch (error) {
    console.error("Error updating product:", error);
    return { status: 500, message: "Product update failed" };
  }
}

export async function DeleteProduct(productId: string) {
  try {
    requireRole("ADMIN");

    const product = await client.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) throw new Error("Product not found");

    await client.product.update({
      where: {
        id: productId,
      },
      data: {
        isActive: false,
      },
    });

    return {
      status: 200,
      message: "Item deleted successfully!",
    };
  } catch (error) {
    console.error("Error deleting product: ", error);
    return {
      status: 500,
      message: "Error deleting product",
    };
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
            id: true,
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
    let where = {};
    //@ts-expect-error
    where.isActive = true;

    if (filter === "under-499") {
      //@ts-expect-error
      where.OR = [
        { discountPrice: { lte: 499 } },
        {
          AND: [{ discountPrice: null }, { price: { lte: 499 } }],
        },
      ];
    }

    if (filter === "under-999") {
      //@ts-expect-error
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
      //@ts-expect-error
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
                type: true,
              },
            },
            createdAt: true,
            likes: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                image: true,
              },
            },
          },
        },
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
    const session = await requireServerAuth();
    if(!session || !session.id) throw new Error("Unauthorized");

    const parsed = CreateReviewSchema.safeParse(body);
    if (!parsed.success) {
      return { status: 400, message: parsed.error.message };
    }

    const { rating, comment, productId, variantId, media } = parsed.data;

    const product = await client.product.findUnique({
      where: { id: productId },
      select: {
        avgRating: true,
        reviewCount: true,
      },
    });

    if (!product) throw new Error("Product not found");

    const oldAvg = product.avgRating || 0;
    const oldCount = product.reviewCount || 0;

    const newCount = oldCount + 1;
    const newAvg = (oldCount * oldAvg + rating) / newCount;

    const [review] = await client.$transaction([
      client.review.create({
        data: {
          rating,
          comment,
          userId: session.id,
          productId,
          variantId,
          media: media
            ? {
                create: media.map((m, i) => ({
                  url: m.url,
                  type: m.type,
                  position: i,
                })),
              }
            : undefined,
        },
        include: { media: true },
      }),

      client.product.update({
        where: { id: productId },
        data: {
          avgRating: newAvg,
          reviewCount: newCount,
        },
      }),
    ]);

    return {
      status: 200,
      data: review,
      message: "Review posted successfully",
    };
  } catch (error) {
    console.error("Error creating review: ", error);
    return {
      status: 500,
      message: error,
    };
  }
}

export async function SearchProducts(
  query: string,
): Promise<SearchProductsReturnType> {
  try {
    if (!query || !query.trim())
      return {
        status: 200,
        data: [],
      };

    const search = query.trim();

    const products = await client.product.findMany({
      where: {
        isActive: true,
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            variants: {
              some: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      },
      select: {
        name: true,
        price: true,
        discountPrice: true,
        stock: true,
        avgRating: true,
        reviewCount: true,
        slug: true,
        category: {
          select: {
            name: true,
          },
        },
        variants: {
          select: {
            name: true,
          },
        },
        images: {
          orderBy: {
            position: "asc",
          },
          take: 1,
          select: {
            url: true,
          },
        },
      },
    });

    const formatted = products.map((p) => ({
      name: p.name,
      slug: p.slug,
      price: p.price,
      discountPrice: p.discountPrice,
      stock: p.stock,
      avgRating: p.avgRating,
      reviewCount: p.reviewCount,
      variants: p.variants,
      categoryName: p.category?.name || null,
      image: p?.images[0]?.url || null,
    }));

    return {
      status: 200,
      data: formatted,
    };
  } catch (error) {
    console.error("Error searching products: ", error);
    return {
      status: 500,
      message: "Error searching products.",
    };
  }
}
