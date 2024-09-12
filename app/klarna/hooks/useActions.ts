"use client";

import { useApp } from "../contexts/AppContext";
import * as serverActions from "../actions";
import { useMemo } from "react";

type ServerActions = typeof serverActions;

type ActionParams<T extends keyof ServerActions> = Parameters<
  ServerActions[T]
>[0];

type OmitCommon<T> = Omit<T, "password" | "isTestMode">;

export function useActions() {
  const { password, customer } = useApp();

  return useMemo(
    () => ({
      createCustomer: (
        params: OmitCommon<ActionParams<"createCustomer">> & {
          isTestMode: boolean;
        }
      ) => serverActions.createCustomer({ ...params, password }),

      fetchCustomers: (
        params: OmitCommon<ActionParams<"fetchCustomers">> & {
          isTestMode: boolean;
        }
      ) => serverActions.fetchCustomers({ ...params, password }),

      fetchCustomer: (
        params: OmitCommon<ActionParams<"fetchCustomer">> & {
          isTestMode: boolean;
        }
      ) => serverActions.fetchCustomer({ ...params, password }),

      getPaymentMethods: () =>
        serverActions.getPaymentMethods({
          customerId: customer!.id,
          password,
          isTestMode: customer!.testmode,
        }),

      createFinancialConnectionsSession: (
        params: Omit<
          OmitCommon<ActionParams<"createFinancialConnectionsSession">>,
          "customerId"
        >
      ) =>
        serverActions.createFinancialConnectionsSession({
          ...params,
          customerId: customer!.id,
          password,
          isTestMode: customer!.testmode,
        }),

      getFinancialConnectionsSession: (
        params: OmitCommon<ActionParams<"getFinancialConnectionsSession">>
      ) =>
        serverActions.getFinancialConnectionsSession({
          ...params,
          password,
          isTestMode: customer!.testmode,
        }),

      createPaymentMethodsFromAccounts: (
        params: Omit<
          OmitCommon<ActionParams<"createPaymentMethodsFromAccounts">>,
          "customerId" | "customerName"
        >
      ) =>
        serverActions.createPaymentMethodsFromAccounts({
          ...params,
          customerId: customer!.id,
          customerName: customer!.name || undefined,
          password,
          isTestMode: customer!.testmode,
        }),
    }),
    [customer, password]
  );
}
