"use server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function verifyPassword(password: string) {
  if (password !== process.env.ADMIN_PASSWORD) {
    throw new Error("Unauthorized");
  }
  return;
}

export async function fetchCustomers(email: string, password: string) {
  console.log(password);
  if (!verifyPassword(password)) {
    throw new Error("Unauthorized");
  }

  try {
    const customers = await stripe.customers.list({ email: email });
    return customers;
  } catch (error) {
    console.error("Error fetching customer:", error);
    return null;
  }
}

export async function fetchCustomer(customerId: string) {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return customer;
  } catch (error) {
    console.error("Error fetching customer:", error);
    return null;
  }
}

export async function getPaymentMethods(customerId: string) {
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
}

export async function createFinancialConnectionsSession(
  customerId: string,
  institutionId: string
) {
  try {
    const session = await stripe.financialConnections.sessions.create({
      account_holder: {
        type: "customer",
        customer: customerId,
      },
      permissions: ["payment_method", "balances", "ownership", "transactions"],
      ui_mode: "hosted",
      // @ts-ignore
      filters: { countries: ["US"], institution: institutionId },
      hosted: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/klarna/success`,
      },
    });
    return session;
  } catch (error) {
    console.error("Error creating Financial Connections session:", error);
    return null;
  }
}

export async function getFinancialConnectionsSession(sessionId: string) {
  try {
    const session = await stripe.financialConnections.sessions.retrieve(
      sessionId
    );
    return session;
  } catch (error) {
    console.error("Error retrieving Financial Connections session:", error);
    return null;
  }
}
