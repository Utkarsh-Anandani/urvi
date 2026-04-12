"use server";
import { getSession } from "@/lib/auth";
import CartPageClient from "./_components/cart-page-client"

const CartPage = async () => {
  const session = await getSession();
  return <CartPageClient isloggedIn={session?.loggedIn || false} />
}

export default CartPage;