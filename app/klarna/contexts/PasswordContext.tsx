// contexts/PasswordContext.tsx
"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { verifyPassword } from "../actions";

type PasswordContextType = {
  password: string;
  authenticatePassword: (password: string) => Promise<void>;
  isAuthenticated: boolean | null;
};

const PasswordContext = createContext<PasswordContextType | undefined>(
  undefined
);

export const PasswordProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check session storage on initial load
    const storedPassword = sessionStorage.getItem("password");
    if (storedPassword) {
      authenticatePassword(storedPassword);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const authenticatePassword = async (newPassword: string) => {
    try {
      await verifyPassword(newPassword);
      setPassword(newPassword);
      sessionStorage.setItem("password", newPassword);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Authentication failed:", error);
      setIsAuthenticated(false);
    }
  };

  return (
    <PasswordContext.Provider
      value={{
        password,
        authenticatePassword,
        isAuthenticated,
      }}
    >
      {children}
    </PasswordContext.Provider>
  );
};

export const usePassword = () => {
  const context = useContext(PasswordContext);
  if (context === undefined) {
    throw new Error("usePassword must be used within a PasswordProvider");
  }
  return context;
};
