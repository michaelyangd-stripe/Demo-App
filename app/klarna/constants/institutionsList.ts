// Define the institution type
export type Institution = {
  id: string;
  bcId: string;
  name: string;
  imageUrl: string;
};

// Define test and live mode institutions
export const testInstitutions: Institution[] = [
  {
    id: "fcinst_Qn1a7A4KhL42se",
    bcId: "bcinst_Jg18xEfPHevfHP",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--testmodeGreenBank-4x.png",
    name: "Test Institution",
  },
  {
    id: "fcinst_Qn1a6jqpI0Gb84",
    bcId: "bcinst_LLQZzmKZMjl0j0",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--testmodeBlueExternal-4x.png",
    name: "Test OAuth Institution",
  },
  {
    id: "fcinst_Qn1aly9zRRkWP1",
    bcId: "bcinst_LLQZzmKZMjl0jf",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--testmodeBlueFingerprint-4x.png",
    name: "Ownership accounts",
  },
  {
    id: "fcinst_Qn1aNn8l07746s",
    bcId: "bcinst_RJnR88CE2nmpVF",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--testmodeYellowSandbox-4x.png",
    name: "Sandbox Bank (OAuth)",
  },
  {
    id: "fcinst_Qn1aVTBBJ4ubmQ",
    bcId: "bcinst_RpAh7cQLyntawr",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--testmodeRedSandbox-4x.png",
    name: "Sandbox Bank (Non-OAuth)",
  },
  {
    id: "fcinst_Qn1aporTsLJQH4",
    bcId: "bcinst_JqZfPE8Ckm8kKU",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--testmodeRedMoney-4x.png",
    name: "Invalid Payment Accounts",
  },
  {
    id: "fcinst_Qn1a8Ynz2Il9zF",
    bcId: "bcinst_Job0h4OGUcHbR3",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--testmodeRedBankLightning-4x.png",
    name: "Down bank (unscheduled)",
  },
  {
    id: "fcinst_Qn1aOU8Z6Qsvpn",
    bcId: "bcinst_Jq8pfHc6UyAuCs",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--testmodeOrangeBankLightning-4x.png",
    name: "Down Bank (Error)",
  },
  {
    id: "fcinst_QH6l5zmRXAepbP",
    bcId: "bcinst_LLQZ46ou9SRTNv",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--stripe-4x.png",
    name: "Down Bank (scheduled)",
  },
  {
    id: "fcinst_Qn1aC9A7bD2EED",
    bcId: "bcinst_JoazV8C7lSyXt4",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--stripe-4x.png",
    name: "Down Bank (scheduled)",
  },
];

export const liveInstitutions: Institution[] = [
  // { id: "fcinst_live1", name: "Live Bank 1", imageUrl: "/live-bank-1.png" },
  // { id: "fcinst_live2", name: "Live Bank 2", imageUrl: "/live-bank-2.png" },
  // Add more live institutions as needed
];
