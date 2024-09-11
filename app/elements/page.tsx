"use client";

import React, { useState } from "react";
import {
  Appearance,
  StripeElementsOptions,
  loadStripe,
} from "@stripe/stripe-js";
import {
  AddressElement,
  Elements,
  LinkAuthenticationElement,
} from "@stripe/react-stripe-js";
import { Separator } from "@/components/ui/separator";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import CheckoutForm from "./CheckoutForm";
import { FormProvider } from "react-hook-form";
import {
  ConfigFormData,
  useConfigForm,
} from "@/app/elements/hooks/useConfigForm";
import { ElementsForm } from "./ElementsForm";
import { Button } from "@/components/ui/button";
import { Link, Loader2, Pencil, RefreshCw } from "lucide-react";
import { useAppContext } from "@/app/elements/hooks/useAppContext";
import { useMediaQuery } from "@/app/elements/hooks/useMediaQuery";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromiseLivemode = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_LIVE_PUBLISHABLE_KEY!
  // { stripeAccount: "acct_1NRIYOBOLg168MLu" }
);

const stripePromiseTestmode = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY!
  // { stripeAccount: "acct_1NRIYOBOLg168MLu" }
);
const DrawerDialog = ({
  onSubmit,
}: {
  onSubmit: (configFormData: ConfigFormData) => Promise<void>;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 1000px)");

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="gap-x-2">
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[96%] overflow-auto">
          <ElementsForm
            onSubmit={async (configFormData: ConfigFormData) => {
              await onSubmit(configFormData);
              setIsOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button>
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[96%] pb-4 px-4">
        <ElementsForm
          onSubmit={async (configFormData: ConfigFormData) => {
            await onSubmit(configFormData);
            setIsOpen(false);
          }}
        />
      </DrawerContent>
    </Drawer>
  );
};

export default function App() {
  const methods = useConfigForm();
  const {
    state: { configFormData, clientSecret, intentId, elementLoaded },
    updateState,
  } = useAppContext();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = async () => {
    if (configFormData) {
      setIsRefreshing(true);
      await onSubmit(configFormData);
      setIsRefreshing(false);
    }
  };

  const onSubmit = async (configFormData: ConfigFormData) => {
    if (configFormData.intentType === "deferred_intent") {
      updateState({
        configFormData: configFormData,
        intentId: null,
        clientSecret: null,
        elementLoaded: true,
      });
    } else {
      const endpoint =
        configFormData.intentType === "payment_intent"
          ? "/api/create-payment-intent"
          : "/api/create-setup-intent";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ id: "xl-tshirt", amount: 1000 }],
          createCustomer: configFormData.createCustomer,
          customerEmail: configFormData.customerEmail,
          paymentMethodTypes: configFormData.paymentMethodTypes,
          livemode: configFormData.livemode,
        }),
      });
      const { id, clientSecret } = await res.json();
      updateState({
        configFormData: configFormData,
        intentId: id,
        clientSecret: clientSecret,
        elementLoaded: true,
      });
    }
  };

  const appearance: Appearance = {
    theme: "flat",
    variables: {
      colorText: "#fff",
      colorBackground: "#38363F",
    },
  };

  let options: StripeElementsOptions = {};
  if (elementLoaded) {
    if (configFormData?.intentType === "deferred_intent") {
      options = {
        mode: "payment",
        amount: 1000,
        currency: "usd",
        appearance,
        paymentMethodTypes: configFormData.paymentMethodTypes,
        // on_behalf_of: "acct_1NRIYOBOLg168MLu",
      };
    } else {
      if (clientSecret) {
        options = {
          clientSecret,
          appearance,
          // on_behalf_of: "acct_1NRIYOBOLg168MLu",
        };
      }
    }
  }

  return (
    <FormProvider {...methods}>
      <div
        className="flex flex-col px-4 bg-background w-100"
        vaul-drawer-wrapper=""
      >
        <div className="mx-auto max-w-3xl w-full">
          <div className="flex flex-row justify-between items-center mb-6">
            <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
              Elements Demo
            </h1>
            <div className="flex flex-row gap-x-2">
              {/* Only show refresh button if there's a valid session */}
              {clientSecret && (
                <TooltipProvider>
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <Button onClick={onRefresh} disabled={isRefreshing}>
                        {isRefreshing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>New session with same settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <DrawerDialog onSubmit={onSubmit} />
            </div>
          </div>
          <div className="flex h-full w-full flex-col gap-y-2 lg:mx-auto">
            {elementLoaded && (
              <>
                <div className="space-y-4">
                  <div className="space-y-1 text-xs">
                    <h4 className="text-gray-500">Client Secret</h4>
                    {configFormData?.intentType === "deferred_intent" ? (
                      <Badge>N/A for Deferred Intent</Badge>
                    ) : (
                      <Badge>{clientSecret}</Badge>
                    )}
                  </div>
                  <div className="space-y-1 text-xs">
                    <h4 className="text-gray-500">Intent</h4>
                    {configFormData?.intentType === "deferred_intent" ? (
                      <Badge>N/A for Deferred Intent</Badge>
                    ) : (
                      <a
                        href={`https://go/o/${intentId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Badge>
                          <Link className="w-3 h-3 mr-1" />
                          {intentId}
                        </Badge>
                      </a>
                    )}
                  </div>
                </div>
                <Separator className="my-2" />
                <Elements
                  options={options}
                  stripe={
                    configFormData?.livemode
                      ? stripePromiseLivemode
                      : stripePromiseTestmode
                  }
                  key={clientSecret}
                >
                  {configFormData?.elementTypes.includes(
                    "linkAuthentication"
                  ) && (
                    <div className="rounded-lg bg-[#25222c] px-4 py-5">
                      <h2 className="mb-2 text-16 font-bold text-[#dee6e8]">
                        LinkAuthentication Element
                      </h2>
                      <LinkAuthenticationElement />
                    </div>
                  )}
                  {configFormData?.elementTypes.includes("address") && (
                    <div className="rounded-lg bg-[#25222c] px-4 py-5">
                      <h2 className="mb-2 text-16 font-bold text-[#dee6e8]">
                        Address Element
                      </h2>
                      <AddressElement options={{ mode: "shipping" }} />
                    </div>
                  )}
                  {configFormData?.elementTypes.includes("payment") && (
                    <div className="rounded-lg bg-[#25222c] px-4 py-5">
                      <h2 className="mb-2 text-16 font-bold text-[#dee6e8]">
                        Payment Element
                      </h2>
                      <CheckoutForm />
                    </div>
                  )}
                </Elements>
              </>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
