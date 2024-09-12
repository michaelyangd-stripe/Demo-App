"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Around } from "@theme-toggles/react";

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      // @ts-ignore
      <Around id="unsure" toggled={false} className="text-2xl" />
    );
  }

  return (
    // @ts-ignore
    <Around
      toggled={theme === "dark"}
      onToggle={(e) => setTheme(e ? "dark" : "light")}
      className="text-2xl"
    />
  );
};

export default ThemeToggle;
