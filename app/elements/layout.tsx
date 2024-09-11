import type { Metadata } from "next";
import { ContextProvider } from "./hooks/useAppContext";

export const metadata: Metadata = {
  title: "Demo - Elements",
  description: "demo demo demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ContextProvider>{children}</ContextProvider>;
}
