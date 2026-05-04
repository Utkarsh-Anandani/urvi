import { CartWithItems, CouponValidationResult, CouponWithRelations } from "@/types/coupon.types";
import client from "./prisma";

export function calculateDiscount(coupon: CouponWithRelations, total: number) {
  let discount = 0;

  if (coupon.discountType === "PERCENTAGE") {
    discount = total * (coupon.discountValue / 100);

    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  } else {
    discount = coupon.discountValue;
  }

  return Math.min(discount, total);
}

export async function validateCoupon({
  coupon,
  cart,
  userId,
}: {
  coupon: CouponWithRelations;
  cart: CartWithItems;
  userId: string;
}): Promise<CouponValidationResult> {
  // const now = new Date();

  if (!coupon.isActive) {
    return {
      valid: false,
      reason: "Coupon inactive",
    };
  }

//   if (coupon.startsAt && coupon.startsAt > now) {
//     return {
//       valid: false,
//       reason: "Coupon not started yet",
//     };
//   }

//   if (coupon.expiresAt && coupon.expiresAt < now) {
//     return {
//       valid: false,
//       reason: "Coupon expired",
//     };
//   }

  if (
    coupon.usageLimit &&
    coupon.usedCount >= coupon.usageLimit
  ) {
    return {
      valid: false,
      reason: "Coupon usage limit reached",
    };
  }

  const usageCount = await client.couponUsage.count({
    where: {
      userId,
      couponId: coupon.id,
    },
  });

  if (
    coupon.maxUsagePerUser &&
    usageCount >= coupon.maxUsagePerUser
  ) {
    return {
      valid: false,
      reason: "Coupon already used",
    };
  }

  let eligibleItems = cart.items;
  if (coupon.scope === "CATEGORY") {
    const categoryIds = coupon.categories.map(
      (c) => c.categoryId
    );

    eligibleItems = cart.items.filter((item) =>
      categoryIds.includes(item.product.categoryId || "")
    );
  }

  if (coupon.scope === "PRODUCT") {
    const productIds = coupon.products.map(
      (p) => p.productId
    );

    eligibleItems = cart.items.filter((item) =>
      productIds.includes(item.productId)
    );
  }

  if (!eligibleItems.length) {
    return {
      valid: false,
      reason: "No eligible products in cart",
    };
  }

  const eligibleTotal = eligibleItems.reduce((acc, item) => {
    const price =
      item.variant?.discountPrice ??
      item.variant?.price ??
      item.product.discountPrice ??
      item.product.price;

    return acc + price * item.quantity;
  }, 0);

  if (
    coupon.minOrderAmount &&
    eligibleTotal < coupon.minOrderAmount
  ) {
    return {
      valid: false,
      reason: `Minimum order amount ₹${coupon.minOrderAmount}`,
    };
  }

  const discount = calculateDiscount(coupon, eligibleTotal);
  return {
    valid: true,
    discount,
    eligibleTotal,
  };
}
