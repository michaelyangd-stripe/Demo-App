import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(
  // This is your test secret API key.
  "sk_test_51NQvfCHMbVvEMifIvrazCziwS0x2gxFZIczT1Dd4DErgLJF6XHM0pBULegfrR6T1qSKtBHZETWE5dnionhTie2Fl00imiyZiiG"
);

export async function POST(request: NextRequest) {
  const data = await request.json();
  // console.time("pi");
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount: 1000,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
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
    JSON.stringify({ clientSecret: paymentIntent.client_secret })
  );
}
