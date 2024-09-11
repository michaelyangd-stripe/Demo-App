import type { Metadata } from "next";
import { PasswordProvider } from "./contexts/PasswordContext";

export const metadata: Metadata = {
  title: "Demo - Elements",
  description: "demo demo demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PasswordProvider>{children}</PasswordProvider>;
}
