"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

export const ConfigFormDataSchema = z.object({
  intentType: z.enum(["payment_intent", "setup_intent", "deferred_intent"], {
    required_error: "You need to select a integration type.",
  }),
  createCustomer: z.boolean(),
  customerEmail: z.string().email().optional().or(z.literal("")),
  performClientsideValidation: z.boolean(),
  paymentMethodTypes: z.string().array(),
});

export type ConfigFormData = z.infer<typeof ConfigFormDataSchema>;

export function useConfigForm() {
  const form = useForm<ConfigFormData>({
    resolver: zodResolver(ConfigFormDataSchema),
    defaultValues: {
      intentType: "payment_intent",
      createCustomer: true,
      customerEmail: "",
      performClientsideValidation: false,
      paymentMethodTypes: ["card", "us_bank_account"],
    },
  });
  return form;
}

export const useConfigFormContext = useFormContext<ConfigFormData>;
