import type { Metadata } from "next";
import { AppProvider } from "./contexts/AppContext";
import EnvironmentBadge from "./EnvironmentBadge";
import Image from "next/image";
import SelectedCustomer from "./SelectedCustomer";
import ThemeToggle from "../ThemeToggle";
Image;

export const metadata: Metadata = {
  title: "Demo - Klarna",
  description: "demo demo demo",
};

const NavBar = () => (
  <div className="flex flex-row w-full justify-between items-center px-4 2xl:px-0 my-4">
    <div className="flex-1 flex justify-start">
      <Image
        src="/klarna_logo.svg"
        width={50}
        height={50}
        alt="Klarna Logo"
        priority
      />
    </div>
    <div className="flex-1 justify-center flex flex-col gap-y-1 items-center">
      <EnvironmentBadge />
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
