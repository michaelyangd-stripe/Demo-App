// app/redirect/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getFinancialConnectionsSession } from "../actions";

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const handleRedirect = async () => {
      const customerId = localStorage.getItem("customerId");
      const lasId = localStorage.getItem("lasId");
      if (customerId && lasId) {
        // const session = await getFinancialConnectionsSession(lasId);
        // if (session.status === "succeeded") {
        //   // Process the linked accounts
        //   router.push("/");
        // }
      }
    };

    handleRedirect();
  }, [router]);

  return <div>Processing...</div>;
}
