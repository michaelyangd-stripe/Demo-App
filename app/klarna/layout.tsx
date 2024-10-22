import type { Metadata } from "next";
import { AppProvider } from "./contexts/AppContext";
import Image from "next/image";
import SelectedCustomer from "./SelectedCustomer";
import ThemeToggle from "../ThemeToggle";
import Link from "next/link";
Image;

export const metadata: Metadata = {
  title: "Demo - Klarna",
  description: "demo demo demo",
};

const NavBar = () => (
  <div className="flex flex-row w-full justify-between items-center px-4 2xl:px-0 my-4 h-12">
    <div className="flex-1 flex justify-start">
      <Link href={"/"}>
        <Image
          src="/klarna_logo.svg"
          width={25}
          height={25}
          alt="Klarna Logo"
          priority
        />
      </Link>
    </div>
    <div className="flex-2 justify-center flex flex-col gap-y-1 items-center">
      <SelectedCustomer />
    </div>
    <div className="flex-1 flex justify-end">
      <ThemeToggle />
    </div>
  </div>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProvider>
      <div className="flex flex-col h-full">
        <NavBar />
        <div className="flex-1">{children}</div>
      </div>
    </AppProvider>
  );
}
