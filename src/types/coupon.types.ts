import {
  Cart,
  CartItem,
  Category,
  Coupon,
  CouponCategory,
  CouponProduct,
  Product,
  ProductVariant,
} from "@prisma/client";

export type CartWithItems = Cart & {
  items: (CartItem & {
    product: Product & {
      category: Category | null;
    };
    variant: ProductVariant | null;
  })[];
};

export type CouponWithRelations = Coupon & {
  products: CouponProduct[];
  categories: CouponCategory[];
};

export type CouponValidationResult = {
  valid: boolean;
  reason?: string;
  discount?: number;
  eligibleTotal?: number;
};
