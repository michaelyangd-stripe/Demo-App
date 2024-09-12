"use client";

import React from "react";
import { useApp } from "./contexts/AppContext";
import { Badge } from "@/components/ui/badge";
import { LinkIcon } from "lucide-react";
import { SwappableBadge } from "./EnvironmentBadge";

function SelectedCustomer() {
  const { isAuthenticated, customer } = useApp();
  if (!isAuthenticated) {
    return null;
  }

  if (!customer) {
    return (
      <Badge className="bg-muted text-muted-foreground cursor-default">
        No Customer Selected
      </Badge>
    );
  }

  return (
    <div className="flex-1 justify-center flex flex-col gap-y-1 items-center">
      <SwappableBadge isTestmode={customer.testmode} />
      <a
        href={`https://go/o/${customer?.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Badge className="text-[0.625rem] px-1.5 py-[0.05rem] leading-normal">
          <LinkIcon className="w-3 h-3 mr-1" />
          {customer?.id}
        </Badge>
      </a>
    </div>
  );
}

export default SelectedCustomer;
