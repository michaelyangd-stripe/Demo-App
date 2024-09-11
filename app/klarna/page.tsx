"use client";

import { useState } from "react";
import { usePassword } from "./contexts/PasswordContext";
import { LoaderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "./PasswordInput";
import Flow from "./Flow";

export default function Home() {
  const { authenticatePassword, isAuthenticated } = usePassword();
  const [tempPassword, setTempPassword] = useState("");

  if (isAuthenticated === null) {
    return (
      <div className="flex h-full w-full justify-center items-center">
        <LoaderIcon className="animate-spin" />
      </div>
    );
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authenticatePassword(tempPassword);
  };

  if (isAuthenticated === false) {
    return (
      <div className="flex h-full w-full justify-center items-center">
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <PasswordInput
            type="password"
            value={tempPassword}
            onChange={(e) => setTempPassword(e.target.value)}
            placeholder="Enter password"
          />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </div>
    );
  }

  return <Flow />;
}
// Fetch via Customer Id
// Link account session
// set return_url
// hosted yes
