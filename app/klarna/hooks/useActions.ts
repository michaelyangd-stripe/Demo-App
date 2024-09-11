// clientActions.ts
"use client";

import { useApp } from "../contexts/AppContext";
import * as serverActions from "../actions";

export function useActions() {
  const { password, isTestMode } = useApp();

  return {
    createCustomer: (name: string, email: string) =>
      serverActions.createCustomer(name, email, password, isTestMode),

    fetchCustomers: (email: string) =>
      serverActions.fetchCustomers(email, password, isTestMode),

    fetchCustomer: (customerId: string) =>
      serverActions.fetchCustomer(customerId, password, isTestMode),

    getPaymentMethods: (customerId: string) =>
      serverActions.getPaymentMethods(customerId, password, isTestMode),

    createFinancialConnectionsSession: (
      customerId: string,
      institutionId: string
    ) =>
      serverActions.createFinancialConnectionsSession(
        customerId,
        institutionId,
        password,
        isTestMode
      ),

    getFinancialConnectionsSession: (sessionId: string) =>
      serverActions.getFinancialConnectionsSession(
        sessionId,
        password,
        isTestMode
      ),
  };
}
