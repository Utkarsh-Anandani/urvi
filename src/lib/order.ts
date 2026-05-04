
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

export function calculateTotals(items: OrderItem[]) {
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

  return {
    totalAmount,
    orderItemsData,
  };
}

export function validateStock(items: OrderItem[]) {
  for (const item of items) {
    const stock = item.variant?.stock;

    if (!stock || stock < item.quantity) {
      throw new Error(`${item.product.name} is out of stock`);
    }
  }
}