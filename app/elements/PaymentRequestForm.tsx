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

export default function PaymentRequestForm() {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(
    null
  );

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Demo total",
          amount: 1099,
        },
      });

      // Check the availability of the Payment Request API.
      pr.canMakePayment().then((result) => {
        console.log(result);
        if (result) {
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe]);

  if (paymentRequest) {
    return <PaymentRequestButtonElement options={{ paymentRequest }} />;
  }

  return null;
}
