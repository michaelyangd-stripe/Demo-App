"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getStateDataByStateId,
  updateStateData,
} from "@/app/klarna/localstorage";

const RedirectPageInner = () => {
  const searchParams = useSearchParams();
  const [textToShow, setTextToShow] = useState<string>(
    "Processing, please wait..."
  );
  useEffect(() => {
    try {
      const stateId = searchParams.get("stateId");
      if (!stateId) {
        setTextToShow("State Id Not Found");
        return;
      }
      const stateData = getStateDataByStateId(stateId);
      if (!stateData?.customerId) {
        setTextToShow("Customer Id Not Found");
        return;
      }
      updateStateData(stateData?.customerId, stateId, {
        status: "completed",
      });
      transferFocusAndCloseWindow();
    } catch (e) {
      setTextToShow("Update State Failed");
    }
  }, [searchParams]);

  return <div>{textToShow}</div>;
};

const transferFocusAndCloseWindow = () => {
  // Attempt to focus the parent window
  if (window.opener && !window.opener.closed) {
    window.opener.focus();
  }
  // Close this window after a short delay
  setTimeout(() => {
    window.close();
  }, 100);
};

const RedirectPage = () => {
  return (
    <Suspense>
      <RedirectPageInner />
    </Suspense>
  );
};
export default RedirectPage;
