import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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