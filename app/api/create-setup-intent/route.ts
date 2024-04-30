import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const data = await request.json();

  const customer = data.createCustomer
    ? await stripe.customers.create({
        email: data.customerEmail,
        metadata: {
          userId: "1",
        },
        name: "alberto",
      })
    : undefined;

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
      ...(customer && { customer: customer.id }),
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
    JSON.stringify({
      id: setupIntent.id,
      clientSecret: setupIntent.client_secret,
    })
  );
}
