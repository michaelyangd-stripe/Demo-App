import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(
  // This is your test secret API key.
  // "sk_test_51NQvfCHMbVvEMifIvrazCziwS0x2gxFZIczT1Dd4DErgLJF6XHM0pBULegfrR6T1qSKtBHZETWE5dnionhTie2Fl00imiyZiiG"
  "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"
);

export async function POST(request: NextRequest) {
  const data = await request.json();

  const customer = await stripe.customers.create({
    email: "didehgns@gmail.com",
  });

  // EXAMPLE REQUEST FROM RARE
  // {
  //   customer: "cus_PzZzrjzVY2doyT",
  //   payment_method_options: {
  //     us_bank_account: {
  //       financial_connections: {
  //         permissions: {
  //           0: "payment_method",
  //         },
  //       },
  //     },
  //   },
  //   payment_method_types: {
  //     0: "card",
  //     1: "us_bank_account",
  //   },
  // }
  const setupIntent = await stripe.setupIntents.create(
    {
      customer: customer.id,
      payment_method_options: {
        us_bank_account: {
          financial_connections: {
            permissions: ["payment_method"],
          },
        },
      },
      payment_method_types: ["card", "us_bank_account"],
      // transfer_data: {
      //   destination: "acct_1NRIYOBOLg168MLu",
      // },
      // on_behalf_of: "acct_1NRIYOBOLg168MLu",
    }
    // {
    //   stripeAccount: "acct_1NRIYOBOLg168MLu",
    // }
  );
  // console.timeEnd("pi");
  return new NextResponse(
    JSON.stringify({ clientSecret: setupIntent.client_secret })
  );
}
