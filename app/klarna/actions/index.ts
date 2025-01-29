"use server";

import { getBaseUrl } from "@/lib/utils";
import Stripe from "stripe";

function serializeData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

const getStripeInstance = (isTestMode: boolean) => {
  const apiKey = isTestMode
    ? process.env.STRIPE_TEST_SECRET_KEY!
    : process.env.STRIPE_LIVE_SECRET_KEY!;

  return new Stripe(apiKey, {
    // @ts-ignore
    apiVersion: "2024-06-20; financial_connections_hosted_beta=v1",
  });
};

export async function verifyPassword(password: string) {
  if (password !== process.env.ADMIN_PASSWORD) {
    throw new Error("Unauthorized");
  }
}

// Common parameters type
type CommonParams = {
  password: string;
  isTestMode: boolean;
};

// Error handling function
function handleError(e: unknown): never {
  let errorMessage = "An unknown error occurred";
  if (e instanceof Error) {
    errorMessage = e.message;
  } else if (typeof e === "object" && e !== null && "message" in e) {
    errorMessage = String((e as { message: unknown }).message);
  } else if (typeof e === "string") {
    errorMessage = e;
  }
  throw new Error(errorMessage);
}

// Higher-order function to create API functions
function createApiFunction<T, P>(
  action: (stripe: Stripe, params: P) => Promise<T>
) {
  return async (params: P & CommonParams): Promise<T> => {
    await verifyPassword(params.password);
    const stripe = getStripeInstance(params.isTestMode);
    try {
      const result = await action(stripe, params);
      return serializeData(result);
    } catch (e) {
      handleError(e);
    }
  };
}

// API Functions
export const createCustomer = createApiFunction<
  Stripe.Customer,
  { name?: string; email?: string }
>(async (stripe, { name, email }) => {
  return await stripe.customers.create({ name, email });
});

export const fetchCustomers = createApiFunction<
  Stripe.ApiList<Stripe.Customer>,
  { email: string }
>(async (stripe, { email }) => {
  return await stripe.customers.list({ email });
});

export const fetchCustomer = createApiFunction<
  Stripe.Customer | Stripe.DeletedCustomer,
  { customerId: string }
>(async (stripe, { customerId }) => {
  return await stripe.customers.retrieve(customerId);
});

export const getPaymentMethods = createApiFunction<
  Stripe.PaymentMethod[],
  { customerId: string }
>(async (stripe, { customerId }) => {
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: "us_bank_account",
  });
  return paymentMethods.data;
});

export const createFinancialConnectionsSession = createApiFunction<
  Stripe.FinancialConnections.Session,
  {
    customerId: string;
    institutionId: string;
    stateId: string;
    requireInstitutionLogin: boolean;
  }
>(
  async (
    stripe,
    { customerId, institutionId, stateId, requireInstitutionLogin }
  ) => {
    const baseUrl = getBaseUrl();
    return await stripe.financialConnections.sessions.create({
      account_holder: {
        type: "customer",
        customer: customerId,
      },
      permissions: ["payment_method", "balances", "ownership", "transactions"],
      ui_mode: "hosted",
      // @ts-ignore
      filters: { countries: ["US"], institution: institutionId },
      hosted: {
        return_url: `${baseUrl}/klarna/redirect?stateId=${stateId}`,
      },
      ...(requireInstitutionLogin ? { require_institution_login: true } : {}),
    });
  }
);

export const getFinancialConnectionsSession = createApiFunction<
  Stripe.FinancialConnections.Session,
  { sessionId: string }
>(async (stripe, { sessionId }) => {
  return await stripe.financialConnections.sessions.retrieve(sessionId);
});

export const createPaymentMethodsFromAccounts = createApiFunction<
  Stripe.PaymentMethod[],
  {
    accountIds: string[];
    customerId: string;
    customerName?: string;
  }
>(async (stripe, { accountIds, customerId, customerName }) => {
  return await Promise.all(
    accountIds.map(async (accountId) => {
      const paymentMethod = await stripe.paymentMethods.create({
        type: "us_bank_account",
        billing_details: {
          name: customerName ?? "Place Holder",
        },
        us_bank_account: {
          financial_connections_account: accountId,
        },
      });

      await stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customerId,
      });

      return paymentMethod;
    })
  );
});
