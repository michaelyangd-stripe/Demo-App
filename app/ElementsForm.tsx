"use client";

import {
  ConfigFormDataSchema,
  useConfigFormContext,
  ConfigFormData,
} from "./hooks/useConfigForm";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppContext } from "./hooks/useAppContext";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

const startSession = async (
  type: ConfigFormData["intentType"],
  createCustomer: boolean,
  customerEmail?: string
) => {
  const endpoint =
    type === "payment_intent"
      ? "/api/create-payment-intent"
      : "/api/create-setup-intent";
  return fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: [{ id: "xl-tshirt", amount: 1000 }],
      createCustomer,
      customerEmail,
    }),
  }).then((res) => res.json());
};

export function ElementsForm({ onComplete }: { onComplete: () => void }) {
  const form = useConfigFormContext();
  const { updateState } = useAppContext();

  async function onSubmit(values: z.infer<typeof ConfigFormDataSchema>) {
    console.log(values);
    const { id, clientSecret } = await startSession(
      values.intentType,
      values.createCustomer,
      values.customerEmail
    );
    updateState({
      configFormData: form.getValues(),
      intentId: id,
      clientSecret: clientSecret,
    });
    onComplete();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="intentType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Intent Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="payment_intent" />
                    </FormControl>
                    <FormLabel className="font-normal">PaymentIntent</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="setup_intent" />
                    </FormControl>
                    <FormLabel className="font-normal">Setup Intent</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 opacity-20">
                    <FormControl>
                      <RadioGroupItem value="deferred_intent" disabled />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Deferred Intent
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="createCustomer"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-3">
              <FormLabel>Create Customer</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customerEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="...@gmail.com"
                  {...field}
                  disabled={!form.getValues("createCustomer")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Submit
        </Button>
      </form>
    </Form>
  );
}
