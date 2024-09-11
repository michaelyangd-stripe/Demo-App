import type { Metadata } from "next";
import { AppProvider } from "./contexts/AppContext";
import { ModeToggle } from "./ModeToggle";
import Image from "next/image";
Image;

export const metadata: Metadata = {
  title: "Demo - Klarna",
  description: "demo demo demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProvider>
      <div className="flex flex-row justify-between items-center px-4 2xl:px-0 my-4">
        <div className="flex flex-row justify-center items-center gap-x-2">
          <Image
            src="/klarna_logo.svg"
            width={50}
            height={50}
            alt="Klarna Logo"
            priority
          />
        </div>
        <ModeToggle />
      </div>
      {children}
    </AppProvider>
  );
}
