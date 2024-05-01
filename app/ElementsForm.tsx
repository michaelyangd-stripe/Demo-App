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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppContext } from "./hooks/useAppContext";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const startSession = async (
  type: ConfigFormData["intentType"],
  paymentMethodTypes: string[],
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
      paymentMethodTypes,
    }),
  }).then((res) => res.json());
};

export function ElementsForm({ onComplete }: { onComplete: () => void }) {
  const form = useConfigFormContext();
  const { updateState } = useAppContext();

  async function onSubmit(values: z.infer<typeof ConfigFormDataSchema>) {
    const { id, clientSecret } = await startSession(
      values.intentType,
      values.paymentMethodTypes,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="pt-6">
        <Tabs defaultValue="server">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="server">Server</TabsTrigger>
            <TabsTrigger value="client">Client</TabsTrigger>
          </TabsList>
          <TabsContent value="server">
            <Card>
              <CardHeader>
                <CardTitle>Server</CardTitle>
                <CardDescription>
                  Variables used on the server-side
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-y-6 h-96">
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
                            <FormLabel className="font-normal">
                              PaymentIntent
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="setup_intent" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Setup Intent
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 opacity-20">
                            <FormControl>
                              <RadioGroupItem
                                value="deferred_intent"
                                disabled
                              />
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
                    <FormItem className="flex flex-col gap-y-1">
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
                          placeholder="michaelyangd+123@stripe.com"
                          {...field}
                          disabled={!form.getValues("createCustomer")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentMethodTypes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PaymentMethodTypes</FormLabel>
                      <FormControl>
                        <ToggleGroup
                          type="multiple"
                          className="justify-start"
                          value={field.value}
                          onValueChange={(value) => {
                            if (value) field.onChange(value);
                          }}
                        >
                          <ToggleGroupItem value="card">card</ToggleGroupItem>
                          <ToggleGroupItem value="us_bank_account">
                            us_bank_account
                          </ToggleGroupItem>
                          <ToggleGroupItem value="link">link</ToggleGroupItem>
                        </ToggleGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="client">
            <Card>
              <CardHeader>
                <CardTitle>Client</CardTitle>
                <CardDescription>
                  Variables used on the client-side
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-y-6 h-96">
                <FormField
                  control={form.control}
                  name="elementTypes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Elements</FormLabel>
                      <FormControl>
                        <ToggleGroup
                          type="multiple"
                          className="justify-start"
                          value={field.value}
                          onValueChange={(value) => {
                            if (value) field.onChange(value);
                          }}
                        >
                          <ToggleGroupItem value="linkAuthentication">
                            LinkAuthentication
                          </ToggleGroupItem>
                          <ToggleGroupItem value="address">
                            Address
                          </ToggleGroupItem>
                          <ToggleGroupItem value="payment">
                            Payment
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="billingEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="michaelyangd+123@stripe.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="billingName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Michael" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="performClientsideValidation"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-y-1">
                      <FormLabel>Perform Client Validation</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Button
          type="submit"
          className="w-full mt-4"
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
