"use client";

import { Badge } from "@/components/ui/badge";
import { useApp } from "./contexts/AppContext";

export const TestmodeBadge = () => {
  return (
    <Badge className="bg-[#ff8f0e] text-white cursor-default text-[0.625rem] px-1.5 py-[0.05rem] leading-normal">
      test
    </Badge>
  );
};
export const LivemodeBadge = () => {
  return (
    <Badge className="bg-[#0edfff] text-white cursor-default text-[0.625rem] px-1.5 py-[0.05rem] leading-normal">
      live
    </Badge>
  );
};

const EnvironmentBadge = () => {
  const { customer } = useApp();
  if (!customer) {
    return null;
  }

  return customer.testmode ? <TestmodeBadge /> : <LivemodeBadge />;
};

export default EnvironmentBadge;
