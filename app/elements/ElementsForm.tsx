"use client";

import { useConfigFormContext, ConfigFormData } from "./hooks/useConfigForm";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Toggle } from "@/components/ui/toggle";

export function ElementsForm({
  onSubmit,
}: {
  onSubmit: (configFormData: ConfigFormData) => Promise<void>;
}) {
  const form = useConfigFormContext();
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col overflow-auto mt-2 h-full"
      >
        <div className="flex flex-row overflow-auto py-6 px-2 w-full items-center justify-between">
          <FormField
            control={form.control}
            name="mode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Intent</FormLabel>
                <FormControl>
                  <ToggleGroup
                    type="single"
                    className="justify-start"
                    size="lg"
                    value={field.value}
                    onValueChange={(value) => {
                      if (value) field.onChange(value);
                    }}
                  >
                    <ToggleGroupItem value="payment">Payment</ToggleGroupItem>
                    <ToggleGroupItem value="setup">Setup</ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-x-6">
            <FormField
              control={form.control}
              name="isDeferredIntent"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-y-1 items-center">
                  <FormLabel>Deferred</FormLabel>
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
              name="livemode"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-y-1 items-center">
                  <FormLabel>Livemode</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <Tabs defaultValue="server" className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="server">Server</TabsTrigger>
            <TabsTrigger value="client">Client</TabsTrigger>
          </TabsList>
          <TabsContent value="server">
            <Card className="py-4">
              <CardContent className="flex flex-col gap-y-6 h-full overflow-auto">
                <FormField
                  control={form.control}
                  name="createCustomer"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-y-1">
                      <FormLabel
                        className={
                          form.getValues("isDeferredIntent") ? "opacity-20" : ""
                        }
                      >
                        Create Customer on Intent
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={form.getValues("isDeferredIntent")}
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
                      <FormLabel
                        className={
                          form.getValues("mode").startsWith("deferred_") ||
                          !form.getValues("createCustomer")
                            ? "opacity-20"
                            : ""
                        }
                      >
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="michaelyangd+123@stripe.com"
                          {...field}
                          disabled={
                            form.getValues("isDeferredIntent") ||
                            !form.getValues("createCustomer")
                          }
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
                          <ToggleGroupItem value="acss_debit">
                            acss
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="client">
            <Card className="py-4">
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
