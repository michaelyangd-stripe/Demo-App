import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.host}`;
  }
  // If window is not available (e.g., during SSR), you can return a default URL or use an environment variable
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7777";
};
