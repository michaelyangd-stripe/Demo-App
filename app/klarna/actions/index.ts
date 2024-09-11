"use server";

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
      const customers = await stripe.customers.list({ email });
      return serializeData(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
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
      const customer = await stripe.customers.retrieve(customerId);
      return serializeData(customer);
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
  stateId: string,
  password: string,
  isTestMode: boolean
) {
  return withAuth(password, isTestMode, async (stripe) => {
    try {
      const session = await stripe.financialConnections.sessions.create({
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
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/klarna/redirect?stateId=${stateId}`,
        },
      });
      // console.log("session", session);
      return serializeData(session);
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
      const session = await stripe.financialConnections.sessions.retrieve(
        sessionId
      );
      return serializeData(session);
    } catch (error) {
      console.error("Error retrieving Financial Connections session:", error);
      return null;
    }
  });
}

export async function createPaymentMethodsFromAccounts(
  accountIds: string[],
  customerName: string,
  customerId: string,
  password: string,
  isTestMode: boolean
) {
  return withAuth(password, isTestMode, async (stripe) => {
    try {
      const paymentMethods = await Promise.all(
        accountIds.map(async (accountId) => {
          const paymentMethod = await stripe.paymentMethods.create({
            type: "us_bank_account",
            billing_details: {
              name: customerName,
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

      return serializeData(paymentMethods);
    } catch (error) {
      console.error("Error creating payment methods:", error);
      throw error;
    }
  });
}
