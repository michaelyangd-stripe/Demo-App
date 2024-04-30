"use client";

import React, { createContext, useState, useContext } from "react";
import type { ConfigFormData } from "./useConfigForm";

interface ContextState {
  configFormData: ConfigFormData | null;
  intentId: string | null;
  clientSecret: string | null;
}

interface UpdateParams {
  configFormData: ConfigFormData;
  intentId: string;
  clientSecret: string;
}

const AppContext = createContext<
  | {
      state: ContextState;
      updateState: (params: UpdateParams) => void;
    }
  | undefined
>(undefined);

interface ContextProviderProps {
  children: React.ReactNode;
}

export const ContextProvider: React.FC<ContextProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<ContextState>({
    configFormData: null,
    intentId: null,
    clientSecret: null,
  });

  const updateState = (params: UpdateParams) => {
    setState((prevState) => ({
      ...prevState,
      ...params,
    }));
  };

  const contextValue = {
    state,
    updateState,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a ContextProvider");
  }
  return context;
};
