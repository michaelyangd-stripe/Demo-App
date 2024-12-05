"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

export const ConfigFormDataSchema = z.object({
  elementTypes: z
    .enum([
      "linkAuthentication",
      "address",
      "payment",
      "paymentRequest",
      "card",
    ])
    .array(),
  mode: z.enum(["payment", "setup"], {
    required_error: "You need to select an integration type.",
  }),
  isDeferredIntent: z.boolean(),
  createCustomer: z.boolean(),
  customerEmail: z.string().email().optional().or(z.literal("")),
  billingEmail: z.string().email().optional().or(z.literal("")),
  billingName: z.string().optional().or(z.literal("")),
  performClientsideValidation: z.boolean(),
  paymentMethodTypes: z.string().array(),
  livemode: z.boolean(),
  returnUrl: z.string().optional(),
});

export type ConfigFormData = z.infer<typeof ConfigFormDataSchema>;

export function useConfigForm() {
  const form = useForm<ConfigFormData>({
    resolver: zodResolver(ConfigFormDataSchema),
    defaultValues: {
      elementTypes: ["payment"],
      mode: "payment",
      isDeferredIntent: false,
      createCustomer: true,
      customerEmail: "michaelyangd+123@stripe.com",
      billingEmail: "michaelyangd+123@stripe.com",
      billingName: undefined,
      performClientsideValidation: false,
      paymentMethodTypes: ["card", "us_bank_account"],
      livemode: false,
      returnUrl: undefined,
    },
  });
  return form;
}

export const useConfigFormContext = useFormContext<ConfigFormData>;
