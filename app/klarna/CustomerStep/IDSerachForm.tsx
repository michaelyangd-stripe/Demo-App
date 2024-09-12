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

export default function IDSearchForm({ onNext }: { onNext: () => void }) {
  const [manualSearchLoading, setManualSearchLoading] = useState(false);
  const [testmode, setTestmode] = useState(false);
  const { toast } = useToast();
  const actions = useActions();
  const { setCustomerId } = useApp();

  const handleManualSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setManualSearchLoading(true);
    const form = e.currentTarget;
    const customerId = form.elements.namedItem(
      "customerId"
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

    if (!customerId.value.startsWith("cus_")) {
      toast({
        variant: "destructive",
        title: "Invalid Customer ID",
        description: "Customer ID must start with 'cus_'",
        duration: 3000,
      });
      setManualSearchLoading(false);
      return;
    }

    try {
      const customer = await actions.fetchCustomer(customerId.value, testmode);
      if (!customer) {
        toast({
          variant: "destructive",
          title: "Customer Not Found",
          description: "No customer found with the provided ID.",
          duration: 3000,
        });
        setManualSearchLoading(false);
        return;
      }

      if (customer.deleted) {
        toast({
          variant: "destructive",
          title: "Customer Has Been Deleted",
          description: "Customer was found but have been deleted.",
          duration: 3000,
        });
        setManualSearchLoading(false);
        return;
      }

      saveCustomerData({
        id: customer.id,
        email: customer.email || "",
        name: customer.name || "",
        testmode: !customer.livemode,
        stateIds: {},
      });
      setCustomerId(customer.id);
      setManualSearchLoading(false);
      onNext();
    } catch (error) {
      console.error("Error fetching customer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "An error occurred while fetching the customer. Please try again.",
        duration: 3000,
      });
      setManualSearchLoading(false);
    }
  };

  return (
    <Card>
      <div className="space-y-2 flex flex-col justify-center items-center min-h-[300px] my-4">
        <SwappableBadge isTestmode={testmode} />
        <h2 className="text-xl font-extrabold tracking-tight">
          Serach by Customer ID
        </h2>
        <form
          className="mb-4 flex flex-col gap-x-6 space-y-2 w-full max-w-[300px]"
          onSubmit={handleManualSubmit}
        >
          <Input type="text" name="customerId" placeholder="cus_" />
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
          <Button type="submit" loading={manualSearchLoading}>
            Submit
          </Button>
        </form>
      </div>
    </Card>
  );
}
