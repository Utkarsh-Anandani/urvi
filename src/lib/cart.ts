export type LocalCartItem = {
  productId: string;
  variantId?: string;
  quantity: number;
};

const CART_KEY = "cart";

export const getLocalCart = (): LocalCartItem[] => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
};

export const setLocalCart = (cart: LocalCartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToLocalCart = (item: LocalCartItem) => {
  const cart = getLocalCart();

  const existing = cart.find(
    (i) => i.productId === item.productId && i.variantId === item.variantId,
  );

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  setLocalCart(cart);
};

export const removeFromLocalCart = (item: LocalCartItem) => {
  const cart = getLocalCart();

  const existing = cart.find(
    (i) => i.productId === item.productId && i.variantId === item.variantId,
  );

  if(!existing) return;

  const newQuantity = (existing?.quantity || 0) - item.quantity;

  if (newQuantity <= 0) {
    setLocalCart(
      cart.filter(
        (i) =>
          !(i.productId === item.productId && i.variantId === item.variantId),
      ),
    );
  } else {
    existing.quantity = newQuantity;
    setLocalCart([...cart]);
  }
};

export const clearLocalCart = () => {
  localStorage.removeItem(CART_KEY);
};
