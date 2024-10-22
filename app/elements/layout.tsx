import type { Metadata } from "next";
import { ContextProvider as ElementsAppContextProvider } from "./hooks/useAppContext";
import Image from "next/image";
import ThemeToggle from "../ThemeToggle";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Demo - Elements",
  description: "demo demo demo",
};

const NavBar = () => (
  <div className="flex flex-row w-full justify-between items-center px-4 2xl:px-0 my-4 h-12">
    <div className="flex-1 flex justify-start">
      <Link href={"/"}>
        <Image
          src="/bufo-doodle.png"
          width={25}
          height={25}
          alt="Bufo Logo"
          priority
        />
      </Link>
    </div>
    <div className="flex-2 justify-center flex flex-col gap-y-1 items-center">
      {/* <SelectedCustomer /> */}
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
    <ElementsAppContextProvider>
      <div className="flex flex-col h-full">
        <NavBar />
        <div className="flex-1">{children}</div>
      </div>
    </ElementsAppContextProvider>
  );
}
