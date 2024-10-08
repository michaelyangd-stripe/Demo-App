"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActions } from "../hooks/useActions";

import { useToast } from "@/hooks/use-toast";
import { useApp } from "../contexts/AppContext";
import { saveCustomerData } from "@/app/klarna/localstorage";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { SwappableBadge } from "../EnvironmentBadge";

export default function NewCustomerForm({ onNext }: { onNext: () => void }) {
  const { toast } = useToast();
  const actions = useActions();
  const [createLoading, setCreateLoading] = useState(false);
  const [testmode, setTestmode] = useState(false);
  const { setCustomerId } = useApp();

  const createCustomer = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const form = e.currentTarget;
      const customerEmail = form.elements.namedItem(
        "customerEmail"
      ) as HTMLInputElement;
      const customerName = form.elements.namedItem(
        "customerName"
      ) as HTMLInputElement;
      const testmodeElements = form.elements.namedItem(
        "testmode"
      ) as RadioNodeList;

      // Check if any of the elements in the RadioNodeList is checked
      const testmode = Array.from(testmodeElements).some((element) => {
        if (element instanceof HTMLInputElement) {
          return element.checked;
        }
        return false;
      });

      const customer = await actions.createCustomer({
        name: customerName.value || undefined,
        email: customerEmail.value || undefined,
        isTestMode: testmode,
      });

      if (!customer) {
        setCreateLoading(false);
        throw new Error("No customer returned from createCustomer.");
      }
      saveCustomerData({
        id: customer.id,
        email: customer.email,
        name: customer.name,
        testmode: !customer.livemode,
        stateIds: {},
      });
      setCustomerId(customer.id);
      setCreateLoading(false);
      onNext();
    } catch (e) {
      let errorMessage = "An unknown error occurred";
      if (e instanceof Error) {
        errorMessage = e.message;
      } else if (typeof e === "object" && e !== null && "message" in e) {
        errorMessage = String((e as { message: unknown }).message);
      } else if (typeof e === "string") {
        errorMessage = e;
      }

      toast({
        variant: "destructive",
        title: "Error Creating New Customer",
        description: `${errorMessage}`,
        duration: 3000,
      });
      setCreateLoading(false);
      return;
    }
  };

  return (
    <Card className="bg-transparent">
      <div className="space-y-2 flex flex-col justify-center items-center min-h-[300px] my-4">
        <SwappableBadge isTestmode={testmode} />
        <h2 className="text-xl font-extrabold tracking-tight">
          Create a New Customer
        </h2>
        <form
          className="mb-4 flex flex-col gap-x-6 space-y-2 w-full max-w-[300px]"
          onSubmit={createCustomer}
        >
          <Input type="text" name="customerName" placeholder="Name" />
          <Input type="email" name="customerEmail" placeholder="Email" />
          <div className="flex flex-row pt-1 pb-2 items-center self-end">
            <label className="text-sm pr-2" htmlFor="testmode">
              Testmode
            </label>
            <Switch
              name="testmode"
              id="testmode"
              checked={testmode}
              onCheckedChange={(e) => setTestmode(!!e)}
            />
          </div>
          <Button type="submit" loading={createLoading}>
            Submit
          </Button>
        </form>
      </div>
    </Card>
  );
}
