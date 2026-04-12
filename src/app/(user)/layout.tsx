import Header from "@/components/global/global-header";
import Footer from "../(website)/_components/footer";
import { LATO } from "@/lib/helper";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      style={{ fontFamily: LATO, color: "#2a1a10" }}
      className="w-full min-h-screen"
    >
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateX(-50%) translateY(16px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
      `}</style>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
