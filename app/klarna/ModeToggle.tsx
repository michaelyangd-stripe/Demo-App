"use client";

import { useApp } from "./contexts/AppContext";
import { Switch } from "@/components/ui/switch";

export const ModeToggle = () => {
  const { isTestMode, toggleTestMode } = useApp();

  return (
    <div className="flex flex-col items-center space-y-1">
      <span className="text-[0.5rem]">Testmode</span>
      <Switch checked={isTestMode} onCheckedChange={toggleTestMode} />
    </div>
  );
};
