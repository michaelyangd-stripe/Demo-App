"use client";

import React from "react";
import { useApp } from "./contexts/AppContext";
import { Badge } from "@/components/ui/badge";
import { LinkIcon } from "lucide-react";
import { SwappableBadge } from "./EnvironmentBadge";

export const CustomerBadge = ({ customerId }: { customerId: string }) => {
  return (
    <a
      className="flex"
      href={`https://go/o/${customerId}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Badge className="text-[0.625rem] px-1.5 py-[0.05rem] leading-normal bg-green-600 dark:bg-green-400 hover:bg-green-400 dark:hover:bg-green-200 transition-colors">
        <LinkIcon className="w-2 h-2 mr-1" />
        {customerId}
      </Badge>
    </a>
  );
};

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
    <div className="flex flex-row gap-x-1 items-center justify-center">
      <SwappableBadge isTestmode={customer.testmode} />
      <CustomerBadge customerId={customer.id} />
    </div>
  );
}

export default SelectedCustomer;
