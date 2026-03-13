import AuthBackground from "@/components/global/auth-bg";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join us now",
  description: "SignIn / SignUp in your account.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthBackground>{children}</AuthBackground>;
}
