import Link from "next/link";

import { cn } from "@/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-6 lg:space-x-8", className)}
      {...props}
    >
      <Link
        href="/klarna"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Klarna
      </Link>
      <Link
        href="/elements"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Elements
      </Link>
    </nav>
  );
}
