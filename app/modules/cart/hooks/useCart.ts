import { endpoints } from "@/shared/endpoints";
import { AddToCartPayload, Cart } from "@/shared/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCookie, setCookie } from "cookies-next";

export const CART_QUERY_KEY = ["cart"] as const;
export const CART_ID_QUERY_KEY = ["cartId"] as const;

export function useCart() {
  const queryClient = useQueryClient();

  const { data: cartId, isLoading: isCartIdLoading } = useQuery({
    queryKey: CART_ID_QUERY_KEY,
    queryFn: async () => {
      const existingCartId = getCookie("cartId");
      if (existingCartId) {
        return existingCartId.toString();
      }

      const newCartId = crypto.randomUUID();
      setCookie("cartId", newCartId, { path: "/" });
      return newCartId;
    },
    staleTime: Infinity,
  });

  const { data: cart, isLoading: isCartDataLoading } = useQuery<Cart | null>({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      if (!cartId) {
        return null;
      }

      const response = await fetch(endpoints.cart.get.path.replace(":cartId", cartId));
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch cart");
      }
      const data = await response.json();
      return data.data;
    },
    enabled: !!cartId,
  });

  const isCartLoading = isCartIdLoading || isCartDataLoading;

  const addToCart = useMutation({
    mutationFn: async ({ ticketId, quantity, date }: AddToCartPayload) => {
      if (!cartId) throw new Error("No cart ID available");

      const response = await fetch(endpoints.cart.addItem.path.replace(":cartId", cartId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticketId,
          quantity,
          date,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      return response.json();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  return {
    cart,
    cartId,
    isCartLoading,
    addToCart,
  };
}