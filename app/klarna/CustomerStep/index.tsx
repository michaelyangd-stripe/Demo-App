"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { getAllCustomers } from "@/app/klarna/localstorage";
import { SearchIcon, PlusIcon, SaveIcon } from "lucide-react";

export type CustomerTableDataShape = {
  id: string;
  email?: string | null;
  name?: string | null;
  testmode: boolean;
};

import { useApp } from "../contexts/AppContext";
import { saveCustomerData } from "@/app/klarna/localstorage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TypedTable from "../TypedTable";
import { SwappableBadge } from "../EnvironmentBadge";
import IDSearchForm from "./IDSerachForm";
import EmailSearchForm from "./EmailSearchForm";
import NewCustomerForm from "./NewCustomerForm";
import { Badge } from "@/components/ui/badge";
import { CustomerBadge } from "../SelectedCustomer";

export const NotAvailableBadge = () => (
  <Badge
    className="text-[0.625rem] px-1.5 py-[0.05rem] leading-normal"
    variant="secondary"
  >
    n/a
  </Badge>
);

export default function CustomerLookup({ onNext }: { onNext: () => void }) {
  const { customer, setCustomerId } = useApp();
  const savedCustomersInObjects = getAllCustomers();
  let savedCustomers: CustomerTableDataShape[] =
    savedCustomersInObjects &&
    Object.entries(savedCustomersInObjects).map(([id, data]) => ({
      id,
      email: data.email,
      name: data.name,
      testmode: data.testmode,
    }));

  const columns: ColumnDef<CustomerTableDataShape>[] = [
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <Button
            className="w-full"
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
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="flex flex-row gap-x-1 items-center">
          <SwappableBadge isTestmode={row.original.testmode} />
          <CustomerBadge customerId={row.original.id} />
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        if (typeof row.original.name === "string") {
          return row.original.name;
        }
        return <NotAvailableBadge />;
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        if (typeof row.original.name === "string") {
          return row.original.email;
        }
        return <NotAvailableBadge />;
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">
          Select Customer
        </h1>
        <p className="text-lg text-muted-foreground">
          {`Mimicking Klarna's sign-in flow`}
        </p>
      </div>
      <Tabs
        defaultValue={savedCustomers.length === 0 ? "create" : "saved"}
        className="space-y-2"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="saved">
            <SaveIcon className="w-3 h-3 mr-1" />
            Saved
          </TabsTrigger>
          <TabsTrigger value="searchId">
            <SearchIcon className="w-3 h-3 mr-1" />
            ID
          </TabsTrigger>
          <TabsTrigger value="searchEmail">
            <SearchIcon className="w-3 h-3 mr-1" />
            Email
          </TabsTrigger>
          <TabsTrigger value="create">
            <PlusIcon className="w-3 h-3 mr-1" />
            New
          </TabsTrigger>
        </TabsList>
        <TabsContent value="saved">
          <TypedTable columns={columns} data={savedCustomers} loading={false} />
        </TabsContent>
        <TabsContent value="searchId">
          <IDSearchForm onNext={onNext} />
        </TabsContent>
        <TabsContent value="searchEmail">
          <EmailSearchForm onNext={onNext} />
        </TabsContent>
        <TabsContent value="create">
          <NewCustomerForm onNext={onNext} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
