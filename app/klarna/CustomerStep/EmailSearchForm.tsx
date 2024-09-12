"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActions } from "../hooks/useActions";
import { ColumnDef } from "@tanstack/react-table";

type Customer = {
  id: string;
  email: string;
  name: string;
  testmode: boolean;
};

import { useToast } from "@/hooks/use-toast";
import { useApp } from "../contexts/AppContext";
import { saveCustomerData } from "@/app/klarna/localstorage";
import { Card } from "@/components/ui/card";
import TypedTable from "../TypedTable";
import { Switch } from "@/components/ui/switch";
import { SwappableBadge } from "../EnvironmentBadge";
import { Badge } from "@/components/ui/badge";
import { LinkIcon } from "lucide-react";

export default function EmailSearchForm({ onNext }: { onNext: () => void }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [emailSearchLoading, setEmailSearchLoading] = useState(false);
  const [testmode, setTestmode] = useState(false);
  const { toast } = useToast();
  const actions = useActions();
  const { customer, setCustomerId } = useApp();

  const onEmailSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailSearchLoading(true);
    const form = e.currentTarget;
    const customerEmail = form.elements.namedItem(
      "customerEmail"
    ) as HTMLInputElement;
    const testmodeElements = form.elements.namedItem(
      "testmode"
    ) as RadioNodeList;

    // Check if any of the elements in the RadioNodeList is checked
    const testmode = Array.from(testmodeElements).some((element) => {
      if (element instanceof HTMLInputElement) {
        return element.checked;
      }
      return false;
    });

    if (!customerEmail.value) {
      toast({
        variant: "destructive",
        title: "Empty E-mail",
        description: "Please provide an email to look up.",
        duration: 3000,
      });
      setEmailSearchLoading(false);
      return;
    }
    try {
      const response = await actions.fetchCustomers(
        customerEmail.value,
        testmode
      );
      if (response && response.data) {
        if (response.data.length === 0) {
          toast({
            variant: "destructive",
            title: "No Customer Found",
            description: "There were no cusomters found for this email.",
            duration: 3000,
          });
          setEmailSearchLoading(false);
          return;
        }
        setCustomers(
          response.data.map((customer) => ({
            id: customer.id,
            email: customer.email || "",
            name: customer.name || "",
            testmode: !customer.livemode,
          }))
        );
      }
      setEmailSearchLoading(false);
    } catch (error) {
      console.error("Error searching customer by email:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "An error occurred while searching by email. Please try again.",
        duration: 3000,
      });
      setEmailSearchLoading(false);
    }
  };

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        return (
          <a
            href={`https://go/o/${row.original.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Badge className="text-[0.625rem] px-1.5 py-[0.05rem] leading-normal">
              <LinkIcon className="w-3 h-3 mr-1" />
              {customer?.id}
            </Badge>
          </a>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "testmode",
      header: "Env",
      cell: ({ row }) => {
        if (typeof row.original.testmode == "boolean") {
          return <SwappableBadge isTestmode={row.original.testmode} />;
        }
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <Button
            variant={row.original.id === customer?.id ? "outline" : "default"}
            onClick={() => {
              if (row.original.id === customer?.id) {
                onNext();
              } else {
                saveCustomerData({
                  id: row.original.id,
                  email: row.original.email,
                  name: row.original.name,
                  testmode: row.original.testmode,
                  stateIds: {},
                });
                setCustomerId(row.original.id);
                onNext();
              }
            }}
          >
            {row.original.id === customer?.id ? "Selected" : "Select"}
          </Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-2">
      <Card>
        <div className="space-y-2 flex flex-col justify-center items-center min-h-[300px] my-4">
          <SwappableBadge isTestmode={testmode} />
          <h2 className="text-xl font-extrabold tracking-tight">
            Serach by Email
          </h2>
          <form
            onSubmit={onEmailSearch}
            className="mb-4 flex flex-col gap-x-6 space-y-2 w-full max-w-[300px]"
          >
            <Input type="email" name="customerEmail" placeholder="email" />
            <div className="flex flex-row pt-1 pb-2 items-center self-end">
              <label className="text-sm pr-2" htmlFor="testmode">
                Testmode
              </label>
              <Switch
                name="testmode"
                id="testmode"
                checked={testmode}
                onCheckedChange={(e) => setTestmode(!!e)}
              />
            </div>
            <Button type="submit" loading={emailSearchLoading}>
              Search
            </Button>
          </form>
        </div>
      </Card>
      <div className="w-full">
        <TypedTable
          columns={columns}
          data={customers}
          loading={emailSearchLoading}
        />
      </div>
    </div>
  );
}
