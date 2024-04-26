"use client";

import React from "react";
import {
  Appearance,
  StripeElementsOptions,
  loadStripe,
} from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./CheckoutForm";
import AddressForm from "./AddressForm";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  // "pk_test_51NQvfCHMbVvEMifIhSjLofAeUyJdGRgHfkH8UOuZ2aiZ6N7ofiXnQA4SdJEAwcdzYD0ZJI6vtecTMpJvDqNNXOfu00eGNjjKDl"
  "pk_live_51NQvfCHMbVvEMifIes0wH9TI1nZdDNv5HrwzMXxlU0FEf5nHC2EM4OrWHtbUimYlhpD4Xv9xEY8t1x8mz5HJbSNI00TDvNjTCA"
  // { stripeAccount: "acct_1NRIYOBOLg168MLu" }
);

export default function App() {
  const [clientSecret, setClientSecret] = React.useState("");

  React.useEffect(() => {
    console.time("piClient");
    // Create PaymentIntent as soon as the page loads
    fetch("/api/create-setup-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id: "xl-tshirt", amount: 1000 }] }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        console.timeEnd("piClient");
      });
  }, []);

  const appearance: Appearance = {
    theme: "flat",
    variables: {
      colorText: "#fff",
      colorBackground: "#38363F",
      // colorText: "#ffffff",
      // colorBackground: "#000",
    },
  };
  // const options: StripeElementsOptions = {
  //   mode: "payment",
  //   amount: 1000,
  //   currency: "usd",
  //   appearance,
  //   // on_behalf_of: "acct_1NRIYOBOLg168MLu",
  // };

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
    // on_behalf_of: "acct_1NRIYOBOLg168MLu",
  };
  return (
    <div className="flex h-full w-full flex-col overflow-y-auto lg:h-dvh lg:flex-row lg:overflow-hidden">
      <div className="mx-auto max-w-3xl w-full mt-20">
        <div className="relative flex h-full w-full flex-col gap-y-2 lg:mx-auto">
          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <div className="rounded-lg bg-[#25222c] px-4 py-5 lg:mb-0 lg:rounded-b-none lg:rounded-t-lg lg:px-6 ">
                <h2 className="mb-2 text-16 font-bold text-[#dee6e8]">
                  Contact
                </h2>
                <p className="fs-mask text-16 font-medium text-[#9d9aa4] sm:text-16">
                  Phone:{" "}
                </p>
                <p className="fs-mask text-16 font-medium text-[#9d9aa4] sm:text-16">
                  Email:{" "}
                </p>
              </div>
              <div className="rounded-lg bg-[#25222c] px-4 py-5 lg:mb-0 lg:rounded-b-none lg:rounded-t-lg lg:px-6 ">
                <h2 className="mb-2 text-16 font-bold text-[#dee6e8]">
                  Shipping
                </h2>
                <AddressForm />
              </div>
              <div className="rounded-lg bg-[#25222c] px-4 py-5 lg:mb-0 lg:rounded-b-none lg:rounded-t-lg lg:px-6 ">
                <h2 className="mb-2 text-16 font-bold text-[#dee6e8]">
                  Payment Methods
                </h2>
                <CheckoutForm />
              </div>
              {/* {clientSecret} */}
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}
