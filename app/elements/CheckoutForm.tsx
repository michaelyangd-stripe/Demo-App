import React from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { StripePaymentElementOptions } from "@stripe/stripe-js";
import { useAppContext } from "./hooks/useAppContext";
import { getBaseUrl } from "@/lib/utils";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const baseUrl = getBaseUrl();
  const {
    state: { configFormData },
  } = useAppContext();
  const [message, setMessage] = React.useState<string | null | undefined>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  React.useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    if (configFormData?.performClientsideValidation) {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setMessage(submitError.message);
        setIsLoading(false);
        return;
      }
    }

    let clientSecret = null;
    if (configFormData?.isDeferredIntent) {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ id: "xl-tshirt", amount: 1000 }] }),
      });
      const parsedResult = await res.json();
      clientSecret = parsedResult.clientSecret;
    }

    const { error } =
      configFormData?.mode === "setup"
        ? await stripe.confirmSetup({
            elements,
            ...(configFormData?.isDeferredIntent && {
              clientSecret,
            }),
            confirmParams: {
              return_url: `${baseUrl}/elements/success`,
            },
          })
        : await stripe.confirmPayment({
            elements,
            ...(configFormData?.isDeferredIntent && {
              clientSecret,
            }),
            confirmParams: {
              return_url: `${baseUrl}/elements/success`,
            },
          });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "tabs",
    terms: { card: "never" },
    defaultValues: {
      billingDetails: {
        ...(configFormData?.billingName && {
          name: configFormData?.billingName,
        }),
        ...(configFormData?.billingEmail && {
          email: configFormData?.billingEmail,
        }),
      },
    },
    // @ts-ignore
    financialConnections: {
      onEvent: (event: any) => console.log("Event Received: ", event),
    },
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="whitespace-nowrap cursor-pointer relative inline-flex items-center justify-center uppercase rounded-2xl tracking-wider max-h-full bg-[#cbf062] text-black box-border border-2 border-transparent hover:bg-[#a0bc50] py-3 px-8 text-16 w-full mt-4 font-bold"
      >
        <span id="button-text">
          {isLoading ? (
            <div className="spinner" id="spinner"></div>
          ) : (
            "SAVE PAYMENT METHOD"
          )}
        </span>
      </button>
    </form>
  );
}
