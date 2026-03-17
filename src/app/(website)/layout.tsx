import GlobalHeader from "@/components/global/global-header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <GlobalHeader />
      {children}
    </div>
  );
}
