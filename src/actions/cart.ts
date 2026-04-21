"use server";
import { CartItem } from "@/app/(user)/my-cart/_components/cart-page-client";
import { requireServerAuth } from "@/lib/auth";
import { LocalCartItem } from "@/lib/cart";
import client from "@/lib/prisma";

export async function AddToCart(item: LocalCartItem) {
  try {
    const session = await requireServerAuth();
    if (!session || !session.id) throw new Error("Unauthorized");

    let cart = await client.cart.findUnique({
      where: {
        userId: session.id,
      },
    });

    if (!cart) {
      cart = await client.cart.create({
        data: {
          userId: session.id,
        },
      });
    }

    const existing = await client.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: item.productId,
        variantId: item.variantId,
      },
    });

    if (existing) {
      await client.cartItem.update({
        where: {
          id: existing.id,
        },
        data: {
          quantity: {
            increment: item.quantity,
          },
        },
      });
    } else {
      await client.cartItem.create({
        data: {
          cartId: cart.id,
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        },
      });
    }

    return {
      status: 200,
      data: "Item added successfully!!",
    };
  } catch (error) {
    console.error("Error adding to cart", error);
    return {
      status: 500,
      data: "Failed to add item in cart",
    };
  }
}

export async function RemoveFromCart(item: LocalCartItem) {
  try {
    const session = await requireServerAuth();
    if (!session || !session.id) throw new Error("Unauthorized");

    let cart = await client.cart.findUnique({
      where: {
        userId: session.id,
      },
    });

    if (!cart) {
      cart = await client.cart.create({
        data: {
          userId: session.id,
        },
      });
    }

    const existing = await client.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: item.productId,
        variantId: item.variantId,
      },
    });

    if(!existing) throw new Error("Inavlid Input");

    const newQuantity = existing.quantity - item.quantity;
    if(newQuantity <= 0) {
      await client.cartItem.delete({
        where: {
          id: existing.id
        }
      })
    } else {
      await client.cartItem.update({
        where: {
          id: existing.id
        },
        data: {
          quantity: newQuantity
        }
      })
    }

    return {
      status: 200,
      data: "Item removed successfully!!",
    };
  } catch (error) {
    console.error("Error removing from cart", error);
    return {
      status: 500,
      data: "Failed to remove item from cart",
    };
  }
}

export async function ClearCart() {
  try {
    const session = await requireServerAuth();
    if(!session || !session.id) throw new Error("Unauthorized");

    const cart = await client.cart.findUnique({
      where: {
        userId: session.id
      },
      select: {
        id: true
      }
    });

    if(!cart) return;

    await client.cartItem.deleteMany({
      where: {
        cartId: cart.id
      }
    });

    return {
      status: 200,
      message: "Cart cleared successfully",
    };
  } catch (error) {
    console.error("Clear cart error:", error);
    return {
      status: 500,
      message: "Failed to clear cart",
    };
  }
}

export async function MergeCart(items: LocalCartItem[]) {
  try {
    const session = await requireServerAuth();
    if (!session || !session.id) return { status: 401, data: "Unauthorized" };

    let cart = await client.cart.findUnique({
      where: {
        userId: session.id,
      },
    });

    if (!cart) {
      cart = await client.cart.create({
        data: {
          userId: session.id,
        },
      });
    }

    for (const item of items) {
      const existing = await client.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: item.productId,
          variantId: item.variantId,
        },
      });

      if (existing) {
        await client.cartItem.update({
          where: { id: existing.id },
          data: { quantity: { increment: item.quantity } },
        });
      } else {
        await client.cartItem.create({
          data: {
            cartId: cart.id,
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          },
        });
      }
    }

    return {
      status: 200,
      data: "Cart merged successfully!!",
    };
  } catch (error) {
    console.error("Cart merging error: ", error);
    return {
      status: 500,
      data: "Cart merging error",
    };
  }
}

function calculateCart(items: CartItem[]) {
  let netDiscountPriceTotal = 0;
  let netPriceTotal = 0;
  let totalQuantity = 0;

  for (const item of items) {
    const base = item.variant ?? item.product;
    const discountPrice = base.discountPrice ?? base.price;
    const price = base.price;

    totalQuantity += item.quantity;
    netPriceTotal += price * item.quantity;
    netDiscountPriceTotal += discountPrice * item.quantity;
  }

  return { netDiscountPriceTotal, netPriceTotal, totalQuantity };
}

export async function GetCartItems() {
  try {
    const session = await requireServerAuth();
    if (!session || !session.id) throw new Error("Unauthorized");

    let cart = await client.cart.findUnique({
      where: {
        userId: session.id,
      },
      select: {
        items: {
          select: {
            quantity: true,
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                price: true,
                discountPrice: true,
                stock: true,
                isActive: true,
              },
            },
            variant: {
              select: {
                id: true,
                name: true,
                price: true,
                discountPrice: true,
                stock: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await client.cart.create({
        data: {
          userId: session.id,
        },
        select: {
          items: {
            select: {
              quantity: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                  price: true,
                  discountPrice: true,
                  stock: true,
                  isActive: true,
                },
              },
              variant: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  discountPrice: true,
                  stock: true,
                },
              },
            },
          },
        },
      });
    }

    const { totalQuantity, netDiscountPriceTotal, netPriceTotal } = calculateCart(cart?.items || [])

    return {
      status: 200,
      data: {
        totalQuantity,
        netPriceTotal,
        netDiscountPriceTotal,
        cartItems: cart?.items || [],
      },
    };
  } catch (error) {
    console.error("Cart fetching error: ", error);
  }
}

export async function GetLocalCartItems(items: LocalCartItem[]) {
  try {
    const productIds = items.map((item) => item.productId);
    const cartItems = [];

    const products = await client.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        images: true,
        price: true,
        discountPrice: true,
        stock: true,
        isActive: true,
        variants: {
          select: {
            id: true,
            name: true,
            price: true,
            discountPrice: true,
            stock: true,
          },
        },
      },
    });

    for (const product of products) {
      const item = items.find((i) => i.productId === product.id)

      if(!item) continue;

      const variant = product.variants.find((v) => v.id === item.variantId) || null;

      cartItems.push({
        quantity: item.quantity,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          discountPrice: product.discountPrice,
          stock: product.stock,
          images: product.images,
          isActive: product.isActive,
        },
        variant
      });
    }

    const { netDiscountPriceTotal, netPriceTotal, totalQuantity } = calculateCart(cartItems);

    return {
      status: 200,
      data: {
        totalQuantity,
        netPriceTotal,
        netDiscountPriceTotal,
        cartItems,
      },
    };
  } catch (error) {
    console.error("Cart fetching error: ", error);
  }
}