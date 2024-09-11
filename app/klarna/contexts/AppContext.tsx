// contexts/AppContext.tsx
"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { verifyPassword } from "../actions";
import { getCustomerData } from "@/lib/stateId";
import { CustomerData } from "@/lib/stateId";

type AppContextType = {
  password: string;
  authenticatePassword: (password: string) => Promise<void>;
  isAuthenticated: boolean | null;
  customer: CustomerData | null;
  setCustomerId: (customerId: string | null) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [customer, setCustomerData] = useState<CustomerData | null>(null);

  useEffect(() => {
    if (customerId) {
      const data = getCustomerData(customerId);
      if (data) {
        setCustomerData(data);
      }
    } else {
      setCustomerData(null);
    }
  }, [customerId]);

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
    <AppContext.Provider
      value={{
        password,
        authenticatePassword,
        isAuthenticated,
        customer,
        setCustomerId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
