"use client";

import { Badge } from "@/components/ui/badge";
import { useApp } from "./contexts/AppContext";

export const TestmodeBadge = () => {
  return <Badge className="bg-[#ff8f0e] text-white cursor-default">test</Badge>;
};
export const LivemodeBadge = () => {
  return <Badge className="bg-[#4299e1] text-white cursor-default">live</Badge>;
};

const EnvironmentBadge = () => {
  const { customer } = useApp();
  if (!customer) {
    return null;
  }

  return customer.testmode ? <TestmodeBadge /> : <LivemodeBadge />;
};

export default EnvironmentBadge;
