import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/react-query";
import { Toaster } from "sonner";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { GetUserCategories } from "@/actions/category";
import { GetCartItems, GetLocalCartItems } from "@/actions/cart";
import { getSession } from "@/lib/auth";
import { getLocalCart } from "@/lib/cart";
import { GetAllAddresses, GetUserProfile } from "@/actions/user";
import { categoryFilterSlugType } from "@/app/catalog/_components/category-panel";
import { GetUserProducts } from "@/actions/product";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Urvi Tribe",
  description: "Buy all organic products online",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = new QueryClient();
  const session = await getSession();
  const filters: categoryFilterSlugType[] = [
    "all-products",
    "best-deals",
    "ghee",
    "newly-launched",
    "oils",
    "superfoods",
    "under-499",
    "under-999",
    "value-combos",
  ];

  await Promise.all(
    filters.map((f) =>
      client.prefetchQuery({
        queryKey: ["homepage-products", f],
        queryFn: () =>
          GetUserProducts({
            filter: f as categoryFilterSlugType,
            limit: 8,
          }),
      }),
    ),
  );

  if (session && session.id) {
    await client.prefetchQuery({
      queryKey: ["user-categories"],
      queryFn: () => GetUserCategories(),
    });

    await client.prefetchQuery({
      queryKey: ["user-profile"],
      queryFn: () => GetUserProfile(),
    });

    await client.prefetchQuery({
      queryKey: ["user-addresses"],
      queryFn: () => GetAllAddresses(),
    });
  }

  await client.prefetchQuery({
    queryKey: ["user-cart"],
    queryFn: async () => {
      if (!session || !session.loggedIn) {
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

  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-screen`}
      >
        <ReactQueryProvider>
          <HydrationBoundary state={dehydrate(client)}>
            {children}
            <Toaster />
          </HydrationBoundary>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
