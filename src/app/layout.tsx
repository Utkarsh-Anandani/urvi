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

  await client.prefetchQuery({
    queryKey: ["user-categories"],
    queryFn: () => GetUserCategories(),
  });

  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-screen overflow-x-hidden`}
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
