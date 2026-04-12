import { AddToCart, ClearCart, GetCartItems, GetLocalCartItems, RemoveFromCart } from "@/actions/cart";
import { addToLocalCart, clearLocalCart, getLocalCart, LocalCartItem, removeFromLocalCart } from "@/lib/cart";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCart = (isLoggedIn: boolean) => {
  return useQuery({
    queryKey: ["user-cart"],
    queryFn: async () => {
      if (!isLoggedIn) {
        const data = getLocalCart();
        if (data.length === 0) {
          return {
            status: 200,
            data: {
              totalQuantity: 0,
              netPriceTotal: 0,
              netDiscountPriceTotal: 0,
              cartItems: [],
            },
          };
        }

        const res = await GetLocalCartItems(data);
        if (res) {
          return res;
        }
      }

      const data = await GetCartItems();
      if (data) {
        return data;
      }

      return {
        status: 200,
        data: null,
      };
    },
  });
};

export const useAddToCart = (isLoggedIn: boolean) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: LocalCartItem) => {
      if (!isLoggedIn) {
        addToLocalCart(data);
        return;
      }

      await AddToCart(data);
    },

    onSuccess: () => {
      toast("Success", { description: "Item added successfully" })
      qc.invalidateQueries({ queryKey: ["user-cart"] });
    },

    onError: () => {
      toast("Error", { description: "Item addition failed" })
    }
  });
};

export const useRemoveFromCart = (isLoggedIn: boolean) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: LocalCartItem) => {
      if (!isLoggedIn) {
        removeFromLocalCart(data);
        return;
      }

      await RemoveFromCart(data);
    },

    onSuccess: () => {
      toast("Success", { description: "Item removed successfully" })
      qc.invalidateQueries({ queryKey: ["user-cart"] });
    },

    onError: () => {
      toast("Error", { description: "Item removal failed" })
    }
  });
};

export const useClearCart = (isLoggedIn: boolean) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if(!isLoggedIn) {
        clearLocalCart();
        return;
      }

      await ClearCart();
    },

     onSuccess: () => {
      toast("Success", { description: "Items removed successfully" })
      qc.invalidateQueries({ queryKey: ["user-cart"] });
    },

    onError: () => {
      toast("Error", { description: "Items removal failed" })
    }
  })
}