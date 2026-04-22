"use server";

import { requireServerAuth } from "@/lib/auth";
import { removeBuyNowItem } from "@/lib/buy-now";
import { LocalCartItem } from "@/lib/cart";
import client from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";
import crypto from "crypto";

type OrderItem = {
  quantity: number;
  product: {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
    description: string;
    price: number;
    discountPrice: number | null;
    stock: number;
    isActive: boolean;
    avgRating: number;
    reviewCount: number;
    categoryId: string | null;
  };
  variant: {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    productId: string;
    price: number;
    discountPrice: number | null;
    stock: number;
  } | null;
};

export async function CreatePostpaidOrder(
  addressId: string,
  slug: "cart" | "buy-now" = "cart",
  item?: LocalCartItem,
) {
  try {
    const session = await requireServerAuth();
    if (!session || !session.id) throw new Error("Unauthorized");

    let items: OrderItem[] | undefined = undefined;

    if (slug === "cart") {
      const cart = await client.cart.findUnique({
        where: { userId: session.id },
        include: {
          items: {
            select: {
              product: true,
              variant: true,
              quantity: true,
            },
          },
        },
      });

      items = cart?.items;
    } else {
      if (!item || !item.variantId) throw new Error("Error creating order");

      const product = await client.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) throw new Error("Product not found");

      const variant = await client.productVariant.findUnique({
        where: { id: item.variantId },
      });

      const newItem = {
        quantity: item.quantity,
        product,
        variant,
      };

      items = [newItem];
    }

    if (!items || items.length === 0) {
      throw new Error("Cart is empty");
    }

    let totalAmount = 0;

    const orderItemsData = items.map((item) => {
      const price =
        item.variant?.discountPrice ||
        item.variant?.price ||
        item.product.discountPrice ||
        item.product.price;

      totalAmount += price * item.quantity;

      return {
        productId: item.product.id,
        variantId: item.variant?.id || undefined,
        quantity: item.quantity,
        name: item.product.name,
        price,
      };
    });

    const COD_FEE = totalAmount <= 5000 ? 49 : 0;

    const finalAmount = totalAmount + COD_FEE;

    const order = await client.order.create({
      data: {
        userId: session.id,
        addressId,
        totalAmount,
        finalAmount,
        paymentStatus: "PENDING",
        status: "CONFIRMED",
        method: "COD",
        items: {
          create: orderItemsData,
        },
      },
    });

    if (slug === "cart") {
      await client.cartItem.deleteMany({
        where: {
          cart: {
            userId: session.id,
          },
        },
      });
    } else {
      removeBuyNowItem();
    }

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
) {
  try {
    const session = await requireServerAuth();
    if (!session || !session.id) throw new Error("Unauthorized");

    let items: OrderItem[] | undefined = undefined;

    if (slug === "cart") {
      const cart = await client.cart.findUnique({
        where: {
          userId: session.id,
        },
        include: {
          items: {
            select: {
              product: true,
              variant: true,
              quantity: true,
            },
          },
        },
      });

      items = cart?.items;
    } else {
      if (!item || !item.variantId) throw new Error("Error creating order");

      const product = await client.product.findUnique({
        where: {
          id: item.productId,
        },
      });

      if (!product) throw new Error("Error creating order");

      const variant = await client.productVariant.findUnique({
        where: {
          id: item.variantId,
        },
      });

      const newItem = {
        quantity: item.quantity,
        product,
        variant,
      };

      items = [newItem];
    }

    if (!items || items.length === 0) {
      throw new Error("Cart is empty");
    }

    let totalAmount = 0;

    const orderItemsData = items.map((item) => {
      const price =
        item.variant?.discountPrice ||
        item.variant?.price ||
        item.product.discountPrice ||
        item.product.price;

      totalAmount += price * item.quantity;

      return {
        productId: item.product.id,
        variantId: item.variant?.id || undefined,
        quantity: item.quantity,
        name: item.product.name,
        price,
      };
    });

    const order = await client.order.create({
      data: {
        userId: session.id,
        addressId,
        totalAmount,
        finalAmount: totalAmount,
        method: "ONLINE",
        items: {
          create: orderItemsData,
        },
      },
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
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

    await client.order.update({
      where: {
        razorpayOrderId: razorpay_order_id,
      },
      data: {
        paymentStatus: "SUCCESS",
        status: "CONFIRMED",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
    });

    await client.cartItem.deleteMany({
      where: {
        cart: {
          userId: session.id,
        },
      },
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
    if(!session || !session.id) throw new Error("Unauthorized");

    const orders = await client.order.findMany({
      where: {
        userId: session.id
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
                name: true
              }
            },
            variant: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    return {
      status: 200,
      data: orders
    }
  } catch (error) {
    console.error("Error fetching users orders: ", error);
    return {
      status: 500,
      message: "Error fetching user orders"
    }
  }
}