"use client";

import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { useActions } from "../hooks/useActions";
import { ColumnDef } from "@tanstack/react-table";
import { getAllCustomers } from "@/app/klarna/localstorage";

type Customer = {
  id: string;
  email: string;
  name: string;
  testmode: boolean;
};

import { useToast } from "@/hooks/use-toast";
import { useApp } from "../contexts/AppContext";
import { saveCustomerData } from "@/app/klarna/localstorage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TypedTable from "../TypedTable";
import { LivemodeBadge, TestmodeBadge } from "../EnvironmentBadge";
import IDSearchForm from "./IDSerachForm";
import EmailSearchForm from "./EmailSearchForm";
import NewCustomerForm from "./NewCustomerForm";

export default function CustomerLookup({ onNext }: { onNext: () => void }) {
  const { toast } = useToast();
  const actions = useActions();
  const { customer, setCustomerId } = useApp();
  const savedCustomersInObjects = getAllCustomers();
  let savedCustomers: Customer[] =
    savedCustomersInObjects &&
    Object.entries(savedCustomersInObjects).map(([id, data]) => ({
      id,
      email: data.email,
      name: data.name,
      testmode: data.testmode,
    }));

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "id",
      header: "ID",
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
          return row.original.testmode ? <TestmodeBadge /> : <LivemodeBadge />;
        }
      },
    },
    {
      id: "actions",

      cell: ({ row }) => {
        return (
          <Button
            disabled={row.original.id === customer?.id}
            onClick={() => {
              saveCustomerData({
                id: row.original.id,
                email: row.original.email,
                name: row.original.name,
                testmode: row.original.testmode,
                stateIds: {},
              });
              setCustomerId(row.original.id);
              onNext();
            }}
          >
            {row.original.id === customer?.id ? "Selected" : "Select"}
          </Button>
        );
      },
    },
  ];

  const createCustomer = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const customerEmail = form.elements.namedItem(
      "customerEmail"
    ) as HTMLInputElement;
    const customerName = form.elements.namedItem(
      "customerName"
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

    if (!customerEmail.value || !customerName.value) {
      toast({
        variant: "destructive",
        title: "Invalid Customer Details",
        description: "Customer details must be filled out.",
        duration: 3000,
      });
      return;
    }
    try {
      const customer = await actions.createCustomer(
        customerName.value,
        customerEmail.value,
        testmode
      );
      if (!customer) {
        throw new Error("No customer returned from createCustomer.");
      }
      saveCustomerData({
        id: customer.id,
        email: customer.email || "",
        name: customer.name || "",
        testmode: !customer.livemode,
        stateIds: {},
      });
      setCustomerId(customer.id);
      onNext();
    } catch (e) {
      let errorMessage = "An unknown error occurred";
      if (e instanceof Error) {
        errorMessage = e.message;
      } else if (typeof e === "object" && e !== null && "message" in e) {
        errorMessage = String((e as { message: unknown }).message);
      } else if (typeof e === "string") {
        errorMessage = e;
      }

      toast({
        variant: "destructive",
        title: "Error Creating New Customer",
        description: `Message: ${errorMessage}`,
        duration: 3000,
      });
      return;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">
          Select a Stripe Customer
        </h1>
        <p className="text-xl text-muted-foreground">
          {`Mimicking Klarna's sign-in flow`}
        </p>
      </div>
      <Tabs defaultValue="saved" className="space-y-2">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="searchId">ID Search</TabsTrigger>
          <TabsTrigger value="searchEmail">Email Search</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
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
