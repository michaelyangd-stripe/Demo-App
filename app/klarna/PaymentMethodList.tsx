"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  createFinancialConnectionsSession,
  getPaymentMethods,
} from "./actions";
import Stripe from "stripe";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import Image from "next/image";

// Define the institution type
type Institution = {
  id: string;
  bcId: string;
  name: string;
  imageUrl: string;
};

// Define test and live mode institutions
const testInstitutions: Institution[] = [
  {
    id: "fcinst_Qn1a7A4KhL42se",
    bcId: "bcinst_Jg18xEfPHevfHP",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--testmodeGreenBank-4x.png",
    name: "Test Institution",
  },
  {
    id: "fcinst_Qn1a6jqpI0Gb84",
    bcId: "bcinst_LLQZzmKZMjl0j0",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--testmodeBlueExternal-4x.png",
    name: "Test OAuth Institution",
  },
  {
    id: "fcinst_Qn1aly9zRRkWP1",
    bcId: "bcinst_LLQZzmKZMjl0jf",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--testmodeBlueFingerprint-4x.png",
    name: "Ownership accounts",
  },
  {
    id: "fcinst_Qn1aNn8l07746s",
    bcId: "bcinst_RJnR88CE2nmpVF",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--testmodeYellowSandbox-4x.png",
    name: "Sandbox Bank (OAuth)",
  },
  {
    id: "fcinst_Qn1aVTBBJ4ubmQ",
    bcId: "bcinst_RpAh7cQLyntawr",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--testmodeRedSandbox-4x.png",
    name: "Sandbox Bank (Non-OAuth)",
  },
  {
    id: "fcinst_Qn1aporTsLJQH4",
    bcId: "bcinst_JqZfPE8Ckm8kKU",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--testmodeRedMoney-4x.png",
    name: "Invalid Payment Accounts",
  },
  {
    id: "fcinst_Qn1a8Ynz2Il9zF",
    bcId: "bcinst_Job0h4OGUcHbR3",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--testmodeRedBankLightning-4x.png",
    name: "Down bank (unscheduled)",
  },
  {
    id: "fcinst_Qn1aOU8Z6Qsvpn",
    bcId: "bcinst_Jq8pfHc6UyAuCs",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--testmodeOrangeBankLightning-4x.png",
    name: "Down Bank (Error)",
  },
  {
    id: "fcinst_QH6l5zmRXAepbP",
    bcId: "bcinst_LLQZ46ou9SRTNv",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--stripe-4x.png",
    name: "Down Bank (scheduled)",
  },
  {
    id: "fcinst_Qn1aC9A7bD2EED",
    bcId: "bcinst_JoazV8C7lSyXt4",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--stripe-4x.png",
    name: "Down Bank (scheduled)",
  },
];

const liveInstitutions: Institution[] = [
  // { id: "fcinst_live1", name: "Live Bank 1", imageUrl: "/live-bank-1.png" },
  // { id: "fcinst_live2", name: "Live Bank 2", imageUrl: "/live-bank-2.png" },
  // Add more live institutions as needed
];

export default function PaymentMethodList({
  customerId,
  onNext,
}: {
  customerId: string;
  onNext: () => void;
}) {
  const [paymentMethods, setPaymentMethods] = useState<Stripe.PaymentMethod[]>(
    []
  );
  const [dialogStep, setDialogStep] = useState<number | null>(1);
  const { toast } = useToast();

  const institutions = true ? testInstitutions : liveInstitutions;

  useEffect(() => {
    if (customerId) {
      fetchPaymentMethods(customerId);
    }
  }, [customerId]);

  const fetchPaymentMethods = async (customerId: string) => {
    const methods = await getPaymentMethods(customerId);
    setPaymentMethods(methods);
  };

  const onInstitutionSelect = async (institutionId: string) => {
    await createFinancialConnectionsSession(customerId, institutionId);
    // onNext();
  };

  const onCustomInstitutionSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const customInstitutionId = form.elements.namedItem(
      "customInstitutionId"
    ) as HTMLInputElement;
    if (!customInstitutionId.value.startsWith("fcinst_")) {
      toast({
        variant: "destructive",
        title: "Invalid Institution ID",
        description: "Institution ID must start with 'fcinst_'",
        duration: 3000,
      });
      return;
    }
    await onInstitutionSelect(customInstitutionId.value);
    // onNext();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Saved Payment Methods</h2>
      {paymentMethods.length > 0 ? (
        paymentMethods.map((pm) => (
          <div key={pm.id}>
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          </div>
        ))
      ) : (
        <div>No payment methods found.</div>
      )}
      <Dialog>
        <DialogTrigger asChild>
          <Button onClick={() => setDialogStep(1)}>Add payment method</Button>
        </DialogTrigger>
        <DialogContent className="pt-14 px-10">
          <DialogHeader className="h-96">
            <DialogTitle>
              {dialogStep === 1 ? "Link your bank account" : "Choose your bank"}
            </DialogTitle>
            {dialogStep === 1 ? (
              <DialogDescription className="">
                Upgrade your Klarna experience and unlock a new way to pay
                directly from your checking account.
              </DialogDescription>
            ) : (
              <div className="grid grid-cols-1 gap-4 overflow-auto py-4">
                {institutions.map((inst) => (
                  <Button
                    key={inst.id}
                    variant={"outline"}
                    className="flex flex-row h-full justify-start gap-x-4"
                    onClick={() => onInstitutionSelect(inst.id)}
                  >
                    <Image
                      src={inst.imageUrl}
                      alt={inst.name}
                      width={50}
                      height={50}
                    />
                    <span className="mt-2">{inst.name}</span>
                  </Button>
                ))}
              </div>
            )}
          </DialogHeader>
          <DialogFooter>
            {dialogStep == 1 ? (
              <Button
                type="submit"
                className="w-full"
                onClick={() => setDialogStep(2)}
              >
                Continue with bank login
              </Button>
            ) : (
              <div className="space-y-2 w-full">
                <h2 className="text-md">Custom Institution</h2>
                <form
                  onSubmit={onCustomInstitutionSubmit}
                  className="w-full flex flex-row gap-x-6"
                >
                  <Input
                    type="text"
                    name="customInstitutionId"
                    placeholder="fcinst_"
                  />
                  <Button type="submit" className="w-full">
                    Submit
                  </Button>
                </form>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
