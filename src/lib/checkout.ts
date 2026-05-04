import { LocalCartItem } from "@/lib/cart";
import client from "./prisma";

export async function getCheckoutItems(
  userId: string,
  slug: "cart" | "buy-now",
  item?: LocalCartItem
) {
  if (slug === "cart") {
    const cart = await client.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!cart || !cart.items.length) {
      throw new Error("Cart is empty");
    }

    return {
      cartId: cart.id,
      items: cart.items,
    };
  }

  if (!item || !item.variantId) {
    throw new Error("Invalid item");
  }

  const product = await client.product.findUnique({
    where: { id: item.productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const variant = await client.productVariant.findUnique({
    where: { id: item.variantId },
  });

  return {
    cartId: null,
    items: [
      {
        quantity: item.quantity,
        product,
        variant,
      },
    ],
  };
}