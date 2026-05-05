"use server";

import { validateCoupon } from "@/lib/coupon";
import { LocalCartItem } from "@/lib/cart";
import client from "@/lib/prisma";
import { requireServerAuth } from "@/lib/auth";
import { CreateCouponType } from "@/types/coupon.types";
import { CreateCouponSchema } from "@/schema/coupon.schema";

type CheckoutSource = "cart" | "buy-now";

async function getCheckoutItems(
  userId: string,
  slug: CheckoutSource,
  item?: LocalCartItem,
) {
  if (slug === "cart") {
    const cart = await client.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
            variant: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    return {
      items: cart.items,
    };
  }

  // BUY NOW FLOW

  if (!item) {
    throw new Error("Buy now item missing");
  }

  const product = await client.product.findUnique({
    where: {
      id: item.productId,
    },
    include: {
      category: true,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  let variant = null;

  if (item.variantId) {
    variant = await client.productVariant.findUnique({
      where: {
        id: item.variantId,
      },
    });

    if (!variant) {
      throw new Error("Variant not found");
    }
  }

  return {
    items: [
      {
        quantity: item.quantity,
        product,
        variant,
      },
    ],
  };
}

export async function GetAvailableCoupons({
  slug = "cart",
  item,
}: {
  slug?: CheckoutSource;
  item?: LocalCartItem;
}) {
  const session = await requireServerAuth();
  if (!session || !session.id) throw new Error("Unauthorized");

  const [{ items }, coupons] = await Promise.all([
    getCheckoutItems(session.id, slug, item),

    client.coupon.findMany({
      where: {
        isActive: true,
      },
      include: {
        categories: true,
        products: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const cart = {
    items,
  };

  const results = await Promise.all(
    coupons.map(async (coupon) => {
      const validation = await validateCoupon({
        coupon,
        cart: cart as any,
        userId: session.id!,
      });

      return {
        id: coupon.id,
        code: coupon.code,
        valid: validation.valid,
        reason: validation.reason,
        discount: validation.discount || 0,
      };
    }),
  );

  return results;
}

export async function ApplyCoupon({
  couponCode,
  slug = "cart",
  item,
}: {
  couponCode: string;
  slug?: CheckoutSource;
  item?: LocalCartItem;
}) {
  const session = await requireServerAuth();
  if (!session || !session.id) throw new Error("Unauthorized");

  const [{ items }, coupon] = await Promise.all([
    getCheckoutItems(session.id, slug, item),

    client.coupon.findFirst({
      where: {
        code: couponCode.toUpperCase(),
        isActive: true,
      },
      include: {
        categories: true,
        products: true,
      },
    }),
  ]);

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  const cart = {
    items,
  };

  const validation = await validateCoupon({
    coupon,
    cart: cart as any,
    userId: session.id,
  });

  if (!validation.valid) {
    throw new Error(validation.reason);
  }

  return {
    success: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      discount: validation.discount,
    },
  };
}

export async function CreateCoupon(body: CreateCouponType) {
  try {
    const session = await requireServerAuth();

    if (!session || session.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const res = CreateCouponSchema.safeParse(body);
    const { success, data: payload } = res;
    if (!success || !payload) throw new Error("Invalid Body");

    const existingCoupon = await client.coupon.findUnique({
      where: {
        code: payload.code.toUpperCase(),
      },
    });

    if (existingCoupon) {
      throw new Error("Coupon code already exists");
    }

    await client.coupon.create({
      data: {
        code: payload.code.toUpperCase(),
        discountType: payload.discountType,
        discountValue: payload.discountValue,
        minOrderAmount: payload.minOrderAmount,
        maxDiscount: payload.maxDiscount,
        usageLimit: payload.usageLimit,
        maxUsagePerUser: payload.maxUsagePerUser,
        isActive: payload.isActive ?? true,
        scope: payload.scope,
        products:
          payload.scope === "PRODUCT" && payload.productIds?.length
            ? {
                create: payload.productIds.map((productId) => ({
                  productId,
                })),
              }
            : undefined,
        categories:
          payload.scope === "CATEGORY" && payload.categoryIds?.length
            ? {
                create: payload.categoryIds.map((categoryId) => ({
                  categoryId,
                })),
              }
            : undefined,
      },
    });

    return {
      status: 201,
      message: "Coupon created",
    };
  } catch (error) {
    console.error("Error creating coupon", error);

    return {
      status: 500,
      message: error instanceof Error ? error.message : "Error creating coupon",
    };
  }
}

export async function UpdateCoupon(
  couponId: string,
  body: CreateCouponType,
) {
  try {
    const session = await requireServerAuth();
    if (!session || session.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const res = CreateCouponSchema.safeParse(body);
    const { success, data: payload } = res;
    if (!success || !payload) throw new Error("Invalid Body");

    const existingCoupon = await client.coupon.findUnique({
      where: {
        id: couponId,
      },
    });

    if (!existingCoupon) {
      throw new Error("Coupon not found");
    }

    await client.$transaction(async (tx) => {
      await tx.couponProduct.deleteMany({
        where: {
          couponId,
        },
      });

      await tx.couponCategory.deleteMany({
        where: {
          couponId,
        },
      });

      await tx.coupon.update({
        where: {
          id: couponId,
        },

        data: {
          code: payload.code.toUpperCase(),
          discountType: payload.discountType,
          discountValue: payload.discountValue,
          minOrderAmount: payload.minOrderAmount,
          maxDiscount: payload.maxDiscount,
          usageLimit: payload.usageLimit,
          maxUsagePerUser: payload.maxUsagePerUser,
          isActive: payload.isActive,
          scope: payload.scope,
          products:
            payload.scope === "PRODUCT" && payload.productIds?.length
              ? {
                  create: payload.productIds.map((productId) => ({
                    productId,
                  })),
                }
              : undefined,
          categories:
            payload.scope === "CATEGORY" && payload.categoryIds?.length
              ? {
                  create: payload.categoryIds.map((categoryId) => ({
                    categoryId,
                  })),
                }
              : undefined,
        },
      });
    });

    return {
      status: 201,
      message: "Coupon Updated",
    };
  } catch (error) {
    console.error("Error updating coupon", error);
    return {
      status: 500,
      message: error instanceof Error ? error.message : "Error updating coupon",
    };
  }
}

export async function DeleteCoupon(couponId: string) {
  try {
    const session = await requireServerAuth();

    if (!session || session.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    await client.coupon.delete({
      where: {
        id: couponId,
      },
    });

    return {
      status: 201,
      message: "Coupon deleted",
    };
  } catch (error) {
    console.error("Error deleting coupon", error);
    return {
      status: 500,
      message: error instanceof Error ? error.message : "Error deleting coupon",
    };
  }
}

export async function ToggleCouponStatus(couponId: string) {
  try {
    const session = await requireServerAuth();

    if (!session || session.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const coupon = await client.coupon.findUnique({
      where: {
        id: couponId,
      },
    });

    if (!coupon) {
      throw new Error("Coupon not found");
    }

    await client.coupon.update({
      where: {
        id: couponId,
      },
      data: {
        isActive: !coupon.isActive,
      },
    });

    return {
      status: 201,
      message: "Toggled coupon status",
    };
  } catch (error) {
    console.error("Error toggling coupon", error);
    return {
      status: 500,
      message: error instanceof Error ? error.message : "Error toggling coupon",
    };
  }
}

export async function GetAdminCoupons({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  try {
    const session = await requireServerAuth();

    if (!session || session.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const skip = (page - 1) * limit;

    const [coupons, total] = await Promise.all([
      client.coupon.findMany({
        where: {
          code: {
            contains: search,
            mode: "insensitive",
          },
        },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          products: {
            include: {
              product: true,
            },
          },
          _count: {
            select: {
              usages: true,
              orders: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),

      client.coupon.count({
        where: {
          code: {
            contains: search,
            mode: "insensitive",
          },
        },
      }),
    ]);

    return {
      status: 200,
      data: {
        coupons,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("Error fetching admin coupons", error);
    return {
      staus: 500,
      message:
        error instanceof Error ? error.message : "Error fetching coupons",
    };
  }
}

export async function GetAdminCoupon(couponId: string) {
  try {
    const session = await requireServerAuth();

    if (!session || session.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const coupon = await client.coupon.findUnique({
      where: {
        id: couponId,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        products: {
          include: {
            product: true,
          },
        },
        usages: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: {
            usedAt: "desc",
          },
          take: 20,
        },
        _count: {
          select: {
            usages: true,
            orders: true,
          },
        },
      },
    });

    if (!coupon) {
      throw new Error("Coupon not found");
    }

    return {
      status: 200,
      data: coupon,
    };
  } catch (error) {
    console.error("Error fetching coupon", error);
    return {
      status: 500,
      message: error instanceof Error ? error.message : "Error fetching coupon",
    };
  }
}

export async function GetCouponAnalytics() {
  try {
    const session = await requireServerAuth();

    if (!session || session.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const [totalCoupons, activeCoupons, totalUsage] = await Promise.all([
      client.coupon.count(),

      client.coupon.count({
        where: {
          isActive: true,
        },
      }),

      client.couponUsage.count(),
    ]);

    return {
      status: 200,
      data: {
        totalCoupons,
        activeCoupons,
        totalUsage,
      },
    };
  } catch (error) {
    console.error("Error fetching coupon analytics", error);
    return {
      status: 500,
      message:
        error instanceof Error ? error.message : "Error fetching analytics",
    };
  }
}
