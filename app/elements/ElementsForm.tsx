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
        className="flex flex-col gap-y-2 overflow-auto mt-4 h-full"
      >
        <Card className="py-4">
          <CardContent className="flex flex-col py-0 h-full">
            <div className="flex flex-row items-baseline justify-between">
              <div className="flex flex-row gap-x-2 items-baseline">
                <FormField
                  control={form.control}
                  name="mode"
                  render={({ field }) => (
                    <FormItem>
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
                          <ToggleGroupItem value="payment">
                            Payment
                          </ToggleGroupItem>
                          <ToggleGroupItem value="setup">Setup</ToggleGroupItem>
                        </ToggleGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isDeferredIntent"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center space-y-1">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-[0.5rem]">Deferred</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="livemode"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center space-y-1">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-[0.5rem]">Livemode</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        {/* <Tabs defaultValue="server" className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="server">Server</TabsTrigger>
            <TabsTrigger value="client">Client</TabsTrigger>
          </TabsList>
          <TabsContent value="server">
          </TabsContent>
          <TabsContent value="client">
          </TabsContent>
          </Tabs> */}
        <Card className="py-4">
          <CardContent className="flex flex-col gap-y-6 h-full overflow-auto py-0">
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
                      <ToggleGroupItem value="acss_debit">acss</ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex flex-col gap-y-6 py-0">
            <FormField
              control={form.control}
              name="elementTypes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Elements</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="multiple"
                      className="justify-start flex-wrap"
                      value={field.value}
                      onValueChange={(value) => {
                        if (value) field.onChange(value);
                      }}
                    >
                      <ToggleGroupItem value="linkAuthentication">
                        LinkAuthentication
                      </ToggleGroupItem>
                      <ToggleGroupItem value="address">Address</ToggleGroupItem>
                      <ToggleGroupItem value="payment">Payment</ToggleGroupItem>
                      <ToggleGroupItem value="paymentRequest">
                        Payment Request
                      </ToggleGroupItem>
                      <ToggleGroupItem value="card">Card</ToggleGroupItem>
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
        <Card className="py-4">
          <CardContent className="flex flex-col gap-y-6 py-0">
            <FormField
              control={form.control}
              name="returnUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Return Url</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="zzz-custom://open/customtab_return"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Button
          type="submit"
          className="w-full mt-auto sticky bottom-0"
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
