"use client";

import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";

import { StripePaymentElementOptions, PaymentRequest } from "@stripe/stripe-js";
import { useAppContext } from "./hooks/useAppContext";
import { getBaseUrl } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function PaymentRequestForm() {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(
    null
  );
  const [amount, setAmount] = useState(1099);

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Demo total",
          amount: amount,
        },
      });
      console.log("pr: ", pr);
      // Check the availability of the Payment Request API.
      pr.canMakePayment().then((result) => {
        console.log(result);
        if (result) {
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe, amount]);

  if (paymentRequest) {
    return (
      <div className="flex flex-col gap-2">
        <PaymentRequestButtonElement options={{ paymentRequest }} />
        <Input
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>
    );
  }

  return <div className="text-red-500">Payment Request cannot be used.</div>;
}
