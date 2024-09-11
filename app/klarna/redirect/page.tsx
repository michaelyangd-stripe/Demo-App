"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getStateDataByStateId,
  updateStateData,
} from "@/app/klarna/localstorage";

const _RedirectPage = () => {
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
      window.close();
    } catch (e) {
      setTextToShow("Update State Failed");
    }
  }, [searchParams]);

  return <div>{textToShow}</div>;
};

const RedirectPage = () => {
  return (
    <Suspense>
      <_RedirectPage />
    </Suspense>
  );
};
export default RedirectPage;
