"use server";

import { requireServerAuth } from "@/lib/auth";
// import { removeBuyNowItem } from "@/lib/buy-now";
import { LocalCartItem } from "@/lib/cart";
import { getCheckoutItems } from "@/lib/checkout";
import { validateCoupon } from "@/lib/coupon";
import { calculateTotals, validateStock } from "@/lib/order";
import client from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";
import crypto from "crypto";

export async function CreatePostpaidOrder(
  addressId: string,
  slug: "cart" | "buy-now" = "cart",
  item?: LocalCartItem,
  couponCode?: string,
) {
  try {
    const session = await requireServerAuth();
    if (!session || !session.id) throw new Error("Unauthorized");

    const { cartId, items } = await getCheckoutItems(session.id, slug, item);

    validateStock(items);

    const { totalAmount, orderItemsData } = calculateTotals(items);

    let coupon = null;

    if (couponCode) {
      coupon = await client.coupon.findUnique({
        where: {
          code: couponCode.toUpperCase(),
        },
        include: {
          categories: true,
          products: true,
        },
      });

      if (!coupon) {
        throw new Error("Invalid coupon");
      }
    }

    let discount = 0;

    if (coupon) {
      const validation = await validateCoupon({
        coupon,
        cart: {
          items,
        } as any,
        userId: session.id,
      });

      if (!validation.valid) {
        throw new Error(validation.reason);
      }

      discount = validation.discount || 0;
    }

    const COD_FEE = totalAmount <= 5000 ? 49 : 0;

    const finalAmount = totalAmount - discount + COD_FEE;

    const order = await client.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId: session.id!,
          addressId,
          totalAmount,
          discount,
          finalAmount,

          couponId: coupon?.id,
          couponCode: coupon?.code,
          couponDiscount: discount,

          paymentStatus: "PENDING",
          status: "CONFIRMED",
          method: "COD",

          items: {
            create: orderItemsData,
          },
        },
      });

      // decrement stock
      for (const item of items) {
        if (item.variant) {
          await tx.productVariant.update({
            where: {
              id: item.variant.id,
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });

          await tx.product.update({
            where: {
              id: item.product.id,
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      // coupon tracking
      if (coupon) {
        await tx.coupon.update({
          where: {
            id: coupon.id,
          },
          data: {
            usedCount: {
              increment: 1,
            },
          },
        });

        await tx.couponUsage.create({
          data: {
            userId: session.id!,
            couponId: coupon.id,
          },
        });
      }

      // clear cart
      if (cartId && slug === "cart") {
        await tx.cartItem.deleteMany({
          where: {
            cartId,
          },
        });
      }

      return createdOrder;
    });

    // if (slug === "buy-now") {
    //   removeBuyNowItem();
    // }

    return {
      status: 201,
      data: {
        orderId: order.id,
      },
    };
  } catch (error) {
    console.error("Error creating COD order: ", error);
    return {
      status: 500,
      message: "Error creating COD order",
    };
  }
}

export async function CreatePrepaidOrder(
  addressId: string,
  slug: "cart" | "buy-now" = "cart",
  item?: LocalCartItem,
  couponCode?: string,
) {
  try {
    const session = await requireServerAuth();
    if (!session || !session.id) throw new Error("Unauthorized");

    const { items } = await getCheckoutItems(session.id, slug, item);

    validateStock(items);
    const { totalAmount, orderItemsData } = calculateTotals(items);
    let coupon = null;

    if (!items || items.length === 0) {
      throw new Error("Cart is empty");
    }

    if (couponCode) {
      coupon = await client.coupon.findUnique({
        where: {
          code: couponCode.toUpperCase(),
        },
        include: {
          categories: true,
          products: true,
        },
      });

      if (!coupon) {
        throw new Error("Invalid coupon");
      }
    }

    let discount = 0;

    if (coupon) {
      const validation = await validateCoupon({
        coupon,
        cart: {
          items,
        } as any,
        userId: session.id,
      });

      if (!validation.valid) {
        throw new Error(validation.reason);
      }

      discount = validation.discount || 0;
    }

    const finalAmount = totalAmount - discount;

    const order = await client.order.create({
      data: {
        userId: session.id,
        addressId,
        totalAmount,
        finalAmount,
        method: "ONLINE",
        items: {
          create: orderItemsData,
        },
        couponId: coupon?.id,
        couponCode: coupon?.code,
        couponDiscount: discount,
      },
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(finalAmount * 100),
      currency: "INR",
      receipt: order.id,
    });

    await client.order.update({
      where: {
        id: order.id,
      },
      data: {
        razorpayOrderId: razorpayOrder.id,
      },
    });

    return {
      status: 201,
      data: {
        orderId: order.id,
        razorpayOrderId: razorpayOrder.id,
        amount: Number(razorpayOrder.amount),
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID!,
      },
    };
  } catch (error) {
    console.error("Error creating order: ", error);
    return {
      status: 500,
      message: "Error creating order",
    };
  }
}

export async function VerifyPayment({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  try {
    const session = await requireServerAuth();
    if (!session || !session.id) throw new Error("Unauthorized");

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new Error("Invalid payment signature");
    }

    await client.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: {
          razorpayOrderId: razorpay_order_id,
        },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
          coupon: true,
        },
      });

      if (!order) {
        throw new Error("Order not found");
      }

      // validate stock AGAIN
      for (const item of order.items) {
        const stock = item.variant?.stock ?? item.product.stock;

        if (stock < item.quantity) {
          throw new Error(`${item.name} out of stock`);
        }
      }

      // decrement stock
      for (const item of order.items) {
        await tx.productVariant.update({
          where: {
            id: item.variantId!,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // coupon tracking
      if (order.couponId) {
        await tx.coupon.update({
          where: {
            id: order.couponId,
          },
          data: {
            usedCount: {
              increment: 1,
            },
          },
        });

        await tx.couponUsage.create({
          data: {
            userId: session.id!,
            couponId: order.couponId,
          },
        });
      }

      await tx.order.update({
        where: {
          id: order.id,
        },
        data: {
          paymentStatus: "SUCCESS",
          status: "CONFIRMED",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
      });

      await tx.cartItem.deleteMany({
        where: {
          cart: {
            userId: session.id,
          },
        },
      });
    });

    return {
      status: 200,
      data: null,
    };
  } catch (error) {
    console.error("Error verifying payments", error);
    return {
      status: 500,
      message: "Error verifying payment",
    };
  }
}

export async function MarkPaymentFailed(razorpay_order_id: string) {
  try {
    await client.order.update({
      where: {
        razorpayOrderId: razorpay_order_id,
      },
      data: {
        paymentStatus: "FAILED",
        status: "CANCELLED",
      },
    });

    return {
      status: 200,
      data: null,
    };
  } catch (error) {
    console.error("Error marking payment failed", error);
    return {
      status: 500,
      message: "Error marking payment failed",
    };
  }
}

export async function GetUsersOrders() {
  try {
    const session = await requireServerAuth();
    if (!session || !session.id) throw new Error("Unauthorized");

    const orders = await client.order.findMany({
      where: {
        userId: session.id,
      },
      select: {
        id: true,
        createdAt: true,
        status: true,
        paymentStatus: true,
        finalAmount: true,
        items: {
          select: {
            product: {
              select: {
                name: true,
              },
            },
            variant: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return {
      status: 200,
      data: orders,
    };
  } catch (error) {
    console.error("Error fetching users orders: ", error);
    return {
      status: 500,
      message: "Error fetching user orders",
    };
  }
}
