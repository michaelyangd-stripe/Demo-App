import { Button } from "@/components/ui/button";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function MainPage() {
  return (
    <div
      className="flex flex-col w-full h-full justify-center items-center space-y-6"
      suppressHydrationWarning
    >
      <ThemeToggle />
      <h1 className="text-4xl font-bold">Hi.</h1>
      <Link
        href="/klarna"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        passHref
      >
        <Button>Klarna</Button>
      </Link>
      <Link
        href="/elements"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        passHref
      >
        <Button>Elements</Button>
      </Link>
    </div>
  );
}
