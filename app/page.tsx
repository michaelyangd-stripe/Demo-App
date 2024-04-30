"use client";

import React, { useState } from "react";
import {
  Appearance,
  StripeElementsOptions,
  loadStripe,
} from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Separator } from "@/components/ui/separator";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import CheckoutForm from "./CheckoutForm";
import { FormProvider } from "react-hook-form";
import { useConfigForm } from "./hooks/useConfigForm";
import { ElementsForm } from "./ElementsForm";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useAppContext } from "./hooks/useAppContext";
import { useMediaQuery } from "./hooks/useMediaQuery";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  // { stripeAccount: "acct_1NRIYOBOLg168MLu" }
);

export function DrawerDialog() {
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configuration</DialogTitle>
          </DialogHeader>
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
      <DrawerContent className="py-4 px-4">
        <ElementsForm onComplete={() => setIsOpen(false)} />
      </DrawerContent>
    </Drawer>
  );
}

export default function App() {
  const methods = useConfigForm();
  const {
    state: { configFormData, clientSecret, intentId },
  } = useAppContext();

  const appearance: Appearance = {
    theme: "flat",
    variables: {
      // colorText: "#fff",
      // colorBackground: "#38363F",
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
                <div className="space-y-2">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium leading-none">
                      Client Secret
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {clientSecret}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium leading-none">Intent</h4>
                    <p className="text-sm text-muted-foreground">
                      {configFormData?.intentType}
                      {intentId && (
                        <>
                          :{" "}
                          <Button variant="link" className="px-0">
                            {intentId}
                          </Button>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <Separator className="my-2" />
                <Elements
                  options={options}
                  stripe={stripePromise}
                  key={clientSecret}
                >
                  <div className="rounded-lg bg-[#25222c] px-4 py-5">
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
                  <div className="rounded-lg bg-[#25222c] px-4 py-5">
                    <h2 className="mb-2 text-16 font-bold text-[#dee6e8]">
                      Shipping
                    </h2>
                    {/* <AddressForm /> */}
                  </div>
                  <div className="rounded-lg bg-[#25222c] px-4 py-5">
                    <h2 className="mb-2 text-16 font-bold text-[#dee6e8]">
                      Payment Methods
                    </h2>
                    <CheckoutForm />
                  </div>
                </Elements>
              </>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
