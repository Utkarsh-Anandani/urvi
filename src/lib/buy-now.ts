import { LocalCartItem } from "./cart";

const CART_KEY = "buy-now";

export type BuyNowStorage = {
  item: LocalCartItem;
  expiresAt: number;
};

export const setBuyNowItem = (item: LocalCartItem) => {
  const payload: BuyNowStorage = {
    item,
    expiresAt: Date.now() + 1000 * 60 * 30,
  };

  localStorage.setItem(CART_KEY, JSON.stringify(payload));
};

export const getBuyNowItem = (): LocalCartItem | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return null;

    const parsed: BuyNowStorage = JSON.parse(raw);

    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(CART_KEY);
      return null;
    }

    return parsed.item;
  } catch {
    return null;
  }
};

export const removeBuyNowItem = () => {
  localStorage.removeItem(CART_KEY);
};
