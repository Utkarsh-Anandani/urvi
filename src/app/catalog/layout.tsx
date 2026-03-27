import Header from "@/components/global/global-header";
import { Metadata } from "next";
import Footer from "../(website)/_components/footer";

export const metadata: Metadata = {
  title: "Urvi - Catalog",
  description: "Buy all organic products online",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-screen min-h-screen">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
