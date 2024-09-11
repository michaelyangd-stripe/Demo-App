"use client";

import React from "react";
import { useApp } from "./contexts/AppContext";
import { Badge } from "@/components/ui/badge";
import { LinkIcon } from "lucide-react";

function SelectedCustomer() {
  const { customer } = useApp();
  if (!customer) {
    return (
      <Badge className="bg-muted-foreground text-muted">
        No Customer Selected
      </Badge>
    );
  }
  return (
    <h2 className="text-md font-semibold">
      <a
        href={`https://go/o/${customer?.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Badge>
          <LinkIcon className="w-3 h-3 mr-1" />
          {customer?.id}
        </Badge>
      </a>
    </h2>
  );
}

export default SelectedCustomer;
