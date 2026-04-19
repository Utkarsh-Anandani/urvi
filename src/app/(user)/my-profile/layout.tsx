import { requireAuth } from "@/lib/auth";

export default async function UserProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAuth();
  return <>{children}</>;
}
