import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const stripe = new Stripe(
    data.livemode
      ? process.env.STRIPE_LIVE_SECRET_KEY!
      : process.env.STRIPE_TEST_SECRET_KEY!
  );
  console.log(data.livemode);
  const customer = data.createCustomer
    ? await stripe.customers.create({
        email: data.customerEmail,
        metadata: {
          userId: "1",
        },
        name: "alberto",
      })
    : undefined;
  const returnUrl = data.returnUrl;
  const useOnBehalfOf = data.useOnBehalfOf;
  // console.time("pi");
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create(
    {
      ...(customer && { customer: customer.id }),
      amount: 1000,
      currency: "usd",
      payment_method_types: data.paymentMethodTypes,
      payment_method_options: {
        acss_debit: {
          mandate_options: {
            payment_schedule: "interval",
            interval_description: "First day of every month",
            transaction_type: "personal",
          },
        },
      },
      ...(returnUrl && { return_url: returnUrl }),
      // payment_method_data: {
      //   type: "us_bank_account",
      //   billing_details: {
      //     email: "",
      //   },
      // },
      // transfer_data: {
      //   destination: "acct_1NRIYOBOLg168MLu",
      // },
      ...(useOnBehalfOf && { on_behalf_of: "acct_1NRIYOBOLg168MLu" }),
    }
    // {
    //   stripeAccount: "acct_1NRIYOBOLg168MLu",
    // }
  );
  // console.timeEnd("pi");
  return new NextResponse(
    JSON.stringify({
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    })
  );
}
