import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

import "@theme-toggles/react/css/Around.css";
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
    <html
      lang="en"
      className="h-full !transition-[background-color]"
      suppressHydrationWarning
    >
      <body
        className={`${inter.className} h-full flex flex-col !transition-[background-color] !duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="max-w-3xl mx-auto w-full flex-1">
            <div
              data-vaul-drawer-wrapper=""
              className="bg-background min-h-[100%]"
            >
              {children}
            </div>
          </main>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
