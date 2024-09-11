"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

export const ConfigFormDataSchema = z.object({
  elementTypes: z.enum(["linkAuthentication", "address", "payment"]).array(),
  intentType: z.enum(["payment_intent", "setup_intent", "deferred_intent"], {
    required_error: "You need to select a integration type.",
  }),
  createCustomer: z.boolean(),
  customerEmail: z.string().email().optional().or(z.literal("")),
  billingEmail: z.string().email().optional().or(z.literal("")),
  billingName: z.string().optional().or(z.literal("")),
  performClientsideValidation: z.boolean(),
  paymentMethodTypes: z.string().array(),
  livemode: z.boolean(),
});

export type ConfigFormData = z.infer<typeof ConfigFormDataSchema>;

export function useConfigForm() {
  const form = useForm<ConfigFormData>({
    resolver: zodResolver(ConfigFormDataSchema),
    defaultValues: {
      elementTypes: ["payment"],
      intentType: "payment_intent",
      createCustomer: true,
      customerEmail: "michaelyangd+123@stripe.com",
      billingEmail: "michaelyangd+123@stripe.com",
      billingName: "",
      performClientsideValidation: false,
      paymentMethodTypes: ["card", "us_bank_account"],
      livemode: false,
    },
  });
  return form;
}

export const useConfigFormContext = useFormContext<ConfigFormData>;
