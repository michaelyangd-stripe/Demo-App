import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MainNav } from "./MainNav";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Demo App",
  description: "demo demo demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`${inter.className} h-full bg-background flex flex-col`}>
        <div className="border-b">
          <div className="flex h-16 items-center px-4 max-w-3xl mx-auto">
            <MainNav />
          </div>
        </div>
        <main className="max-w-3xl mx-auto w-full flex-1">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
