"use server";

import Stripe from "stripe";

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
  return;
}

async function withAuth<T>(
  password: string,
  isTestMode: boolean,
  action: (stripe: Stripe) => Promise<T>
): Promise<T> {
  if (!verifyPassword(password)) {
    throw new Error("Unauthorized");
  }
  const stripe = getStripeInstance(isTestMode);
  return action(stripe);
}

export async function createCustomer(
  name: string,
  email: string,
  password: string,
  isTestMode: boolean
) {
  return withAuth(password, isTestMode, async (stripe) => {
    try {
      return await stripe.customers.create({ name, email });
    } catch (error) {
      console.error("Error creating customer:", error);
      return null;
    }
  });
}

export async function fetchCustomers(
  email: string,
  password: string,
  isTestMode: boolean
) {
  return withAuth(password, isTestMode, async (stripe) => {
    try {
      return await stripe.customers.list({ email });
    } catch (error) {
      console.error("Error fetching customer:", error);
      return null;
    }
  });
}

export async function fetchCustomer(
  customerId: string,
  password: string,
  isTestMode: boolean
) {
  return withAuth(password, isTestMode, async (stripe) => {
    try {
      return await stripe.customers.retrieve(customerId);
    } catch (error) {
      console.error("Error fetching customer:", error);
      return null;
    }
  });
}

export async function getPaymentMethods(
  customerId: string,
  password: string,
  isTestMode: boolean
) {
  return withAuth(password, isTestMode, async (stripe) => {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: "us_bank_account",
      });
      return paymentMethods.data;
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      return [];
    }
  });
}

export async function createFinancialConnectionsSession(
  customerId: string,
  institutionId: string,
  password: string,
  isTestMode: boolean
) {
  console.log("customerId", customerId);
  console.log("institutionId", institutionId);
  return withAuth(password, isTestMode, async (stripe) => {
    try {
      return await stripe.financialConnections.sessions.create({
        account_holder: {
          type: "customer",
          customer: customerId,
        },
        permissions: [
          "payment_method",
          "balances",
          "ownership",
          "transactions",
        ],
        ui_mode: "hosted",
        // @ts-ignore
        filters: { countries: ["US"], institution: institutionId },
        hosted: {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/klarna/success`,
        },
      });
    } catch (error) {
      console.error("Error creating Financial Connections session:", error);
      return null;
    }
  });
}

export async function getFinancialConnectionsSession(
  sessionId: string,
  password: string,
  isTestMode: boolean
) {
  return withAuth(password, isTestMode, async (stripe) => {
    try {
      return await stripe.financialConnections.sessions.retrieve(sessionId);
    } catch (error) {
      console.error("Error retrieving Financial Connections session:", error);
      return null;
    }
  });
}
