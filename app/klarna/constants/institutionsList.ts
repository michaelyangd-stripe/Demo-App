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
  {
    id: "fcinst_QH6iLV0fYVuYEw",
    bcId: "bcinst_JFqfjYGYSxdQ8O",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--morganchase-4x.png",
    name: "Chase",
  },
  {
    id: "fcinst_QH6ixg2YuSCpjy",
    bcId: "bcinst_JFqf3Z5vUVyLs1",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--boa-4x.png",
    name: "Bank of America",
  },
  {
    id: "fcinst_QH6iJOuz7DYwD9",
    bcId: "bcinst_JFqf2wHURe59q2",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--td-4x.png",
    name: "TD Bank",
  },
  {
    id: "fcinst_QH6kn9m1ZyAejn",
    bcId: "bcinst_JFqgsmKE6POyrv",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--capitalone-4x.png",
    name: "Capital One",
  },
  {
    id: "fcinst_QH6jGYt8OLa3r8",
    bcId: "bcinst_JFqgm69DJPH2aP",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--citibank-4x.png",
    name: "Citibank",
  },
  {
    id: "fcinst_QH6iVJ0wBsjsPA",
    bcId: "bcinst_JFqfBood9FTw67",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--wellsfargo-4x.png",
    name: "Wells Fargo",
  },
  {
    id: "fcinst_QH6jY8QK1BuDBd",
    bcId: "bcinst_JFqg9N6RSs29sT",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--m&t-4x.png",
    name: "M&T Bank",
  },
  {
    id: "fcinst_QH6ig8VZ5tHptx",
    bcId: "bcinst_JFqfRR37WrSV6E",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--citizens-4x.png",
    name: "Citizens Bank",
  },
  {
    id: "fcinst_QH6kJXZQhcRU6e",
    bcId: "bcinst_JFqh179iDiQuS9",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--chime-4x.png",
    name: "Chime",
  },
  {
    id: "fcinst_QH6i6oqXu6mxwZ",
    bcId: "bcinst_JFqfK0eaW3cd2P",
    imageUrl:
      "https://b.stripecdn.com/connections-statics-srv/assets/BrandIcon--keybank-4x.png",
    name: "Key Bank",
  },
];
