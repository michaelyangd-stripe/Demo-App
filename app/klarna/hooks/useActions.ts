"use client";

import { useApp } from "../contexts/AppContext";
import * as serverActions from "../actions";
import { useMemo } from "react";

export function useActions() {
  const { password, isTestMode, customer } = useApp();

  return useMemo(
    () => ({
      createCustomer: (name: string, email: string) =>
        serverActions.createCustomer(name, email, password, isTestMode),

      fetchCustomers: (email: string) =>
        serverActions.fetchCustomers(email, password, isTestMode),

      fetchCustomer: (customerId: string) =>
        serverActions.fetchCustomer(customerId, password, isTestMode),

      getPaymentMethods: () =>
        serverActions.getPaymentMethods(customer!.id, password, isTestMode),

      createFinancialConnectionsSession: (
        institutionId: string,
        stateId: string
      ) =>
        serverActions.createFinancialConnectionsSession(
          customer!.id,
          institutionId,
          stateId,
          password,
          customer!.testmode
        ),

      getFinancialConnectionsSession: (sessionId: string) =>
        serverActions.getFinancialConnectionsSession(
          sessionId,
          password,
          customer!.testmode
        ),

      createPaymentMethodsFromAccounts: (accountIds: string[]) =>
        serverActions.createPaymentMethodsFromAccounts(
          accountIds,
          customer!.name,
          customer!.id,
          password,
          customer!.testmode
        ),
    }),
    [customer?.id, password, isTestMode]
  );
}
