"use client";

import { FormEvent, useEffect, useState } from "react";
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
import { generateStateId, updateStateData, getStateData } from "@/lib/stateId";
import {
  testInstitutions,
  liveInstitutions,
} from "./constants/institutionsList";
import { useActions } from "./hooks/useActions";
import { useApp } from "./contexts/AppContext";
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
  const actions = useActions();
  const { isTestMode } = useApp();
  const [stateId, setStateId] = useState<string | null>(null);

  const institutions = isTestMode ? testInstitutions : liveInstitutions;

  useEffect(() => {
    if (customerId) {
      fetchPaymentMethods(customerId);
    }
  }, [customerId]);

  const fetchPaymentMethods = async (customerId: string) => {
    const methods = await actions.getPaymentMethods(customerId);
    setPaymentMethods(methods);
  };

  const onInstitutionSelect = async (institutionId: string) => {
    const session = await actions.createFinancialConnectionsSession(
      customerId,
      institutionId
    );
    if (!session) {
      toast({
        variant: "destructive",
        title: "Empty Session Returned",
        description: "An empty session was returned.",
        duration: 3000,
      });
      return;
    }
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
        <DialogContent className="pt-12 px-10">
          <DialogHeader className="min-h-96">
            <DialogTitle>
              {dialogStep === 1 ? "Link your bank account" : "Choose your bank"}
            </DialogTitle>
            {dialogStep === 1 ? (
              <DialogDescription>
                Upgrade your Klarna experience and unlock a new way to pay
                directly from your checking account.
              </DialogDescription>
            ) : (
              <div className="grid grid-cols-2 gap-4 overflow-auto py-4">
                {institutions.map((inst) => (
                  <Button
                    key={inst.id}
                    variant={"outline"}
                    className="flex flex-col h-min gap-x-2 w-11/12 mx-auto overflow-auto"
                    onClick={() => onInstitutionSelect(inst.id)}
                  >
                    <Image
                      src={inst.imageUrl}
                      alt={inst.name}
                      width={50}
                      height={50}
                    />
                    <span className="text-[0.7rem] mt-2">{inst.name}</span>
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
                <form
                  onSubmit={onCustomInstitutionSubmit}
                  className="w-full flex flex-row gap-x-6"
                >
                  <Input
                    type="text"
                    name="customInstitutionId"
                    placeholder="fcinst_customxyz"
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
