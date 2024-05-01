"use client";

import React, { useState } from "react";
import {
  Appearance,
  StripeElementsOptions,
  loadStripe,
} from "@stripe/stripe-js";
import { Elements, LinkAuthenticationElement } from "@stripe/react-stripe-js";
import { Separator } from "@/components/ui/separator";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import CheckoutForm from "./CheckoutForm";
import { FormProvider } from "react-hook-form";
import { useConfigForm } from "./hooks/useConfigForm";
import { ElementsForm } from "./ElementsForm";
import { Button } from "@/components/ui/button";
import { Link, Pencil } from "lucide-react";
import { useAppContext } from "./hooks/useAppContext";
import { useMediaQuery } from "./hooks/useMediaQuery";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import AddressForm from "./AddressForm";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  // { stripeAccount: "acct_1NRIYOBOLg168MLu" }
);

const DrawerDialog = () => {
  const [isOpen, setIsOpen] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 1000px)");

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <ElementsForm onComplete={() => setIsOpen(false)} />
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
      <DrawerContent className="pb-4 px-4">
        <ElementsForm onComplete={() => setIsOpen(false)} />
      </DrawerContent>
    </Drawer>
  );
};

export default function App() {
  const methods = useConfigForm();
  const {
    state: { configFormData, clientSecret, intentId },
  } = useAppContext();

  const appearance: Appearance = {
    theme: "flat",
    variables: {
      colorText: "#fff",
      colorBackground: "#38363F",
    },
  };
  // const options: StripeElementsOptions = {
  //   mode: "payment",
  //   amount: 1000,
  //   currency: "usd",
  //   appearance,
  //   // on_behalf_of: "acct_1NRIYOBOLg168MLu",
  // };

  const options: StripeElementsOptions = clientSecret
    ? {
        clientSecret,
        appearance,
        // on_behalf_of: "acct_1NRIYOBOLg168MLu",
      }
    : {};

  return (
    <FormProvider {...methods}>
      <div
        className="flex w-screen h-screen flex-col px-4 bg-background"
        vaul-drawer-wrapper=""
      >
        <div className="mx-auto max-w-3xl w-full my-10">
          <div className="flex flex-row justify-between items-center mb-6">
            <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
              Elements Demo
            </h1>
            <DrawerDialog />
          </div>
          <div className="flex h-full w-full flex-col gap-y-2 lg:mx-auto">
            {clientSecret && (
              <>
                <div className="space-y-4">
                  <div className="space-y-1 text-xs">
                    <h4 className="text-gray-500">Client Secret</h4>
                    <p>{clientSecret}</p>
                  </div>
                  <div className="space-y-1 text-xs">
                    <h4 className="text-gray-500">Intent</h4>
                    {configFormData?.intentType === "deferred_intent" ? (
                      <Badge>Deferred Intent</Badge>
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
                  stripe={stripePromise}
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
                      <AddressForm />
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
