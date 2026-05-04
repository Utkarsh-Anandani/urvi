"use server";

import { validateCoupon } from "@/lib/coupon";
import { LocalCartItem } from "@/lib/cart";
import client from "@/lib/prisma";
import { requireServerAuth } from "@/lib/auth";

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