// contexts/AppContext.tsx
"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { verifyPassword } from "../actions";
import {
  clearActiveCustomerId,
  getActiveCustomerId,
  getCustomerData,
  getPassword,
  setActiveCustomerId,
  setPassword as setPasswordStorage,
} from "@/app/klarna/localstorage";
import { CustomerData } from "@/app/klarna/localstorage";
import { toast } from "@/hooks/use-toast";

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
  const [customer, setCustomerData] = useState<CustomerData | null>(null);

  useEffect(() => {
    // Check local storage on initial load
    const storedPassword = getPassword();
    const activeCustomerId = getActiveCustomerId();
    if (storedPassword) {
      authenticatePassword(storedPassword);
    } else {
      setIsAuthenticated(false);
    }
    if (activeCustomerId) {
      setCustomerId(activeCustomerId);
    }
  }, []);

  const setCustomerId = (customerId: string | null) => {
    if (customerId) {
      const data = getCustomerData(customerId);
      if (data) {
        setCustomerData(data);
        setActiveCustomerId(customerId);
      } else {
        setCustomerData(null);
        clearActiveCustomerId();
      }
    } else {
      setCustomerData(null);
    }
  };

  const authenticatePassword = async (newPassword: string) => {
    try {
      await verifyPassword(newPassword);
      setPassword(newPassword);
      setPasswordStorage(newPassword);
      setIsAuthenticated(true);
    } catch (e) {
      let errorMessage = "An unknown error occurred";
      if (e instanceof Error) {
        errorMessage = e.message;
      } else if (typeof e === "object" && e !== null && "message" in e) {
        errorMessage = String((e as { message: unknown }).message);
      } else if (typeof e === "string") {
        errorMessage = e;
      }

      toast({
        variant: "destructive",
        title: "Error Authenticating Password",
        description: `Message: ${errorMessage}`,
        duration: 3000,
      });
      return;
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
