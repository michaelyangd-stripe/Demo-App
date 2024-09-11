"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActions } from "./hooks/useActions";
import { ColumnDef } from "@tanstack/react-table";
import { getAllCustomers } from "@/lib/stateId";

type Customer = {
  id: string;
  email: string;
  name: string;
  testmode: boolean;
};

import { useToast } from "@/hooks/use-toast";
import { useApp } from "./contexts/AppContext";
import { saveCustomerData } from "@/lib/stateId";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import TypedTable from "./TypedTable";
import { Switch } from "@/components/ui/switch";
import { LivemodeBadge, TestmodeBadge } from "./EnvironmentBadge";

export default function CustomerLookup({ onNext }: { onNext: () => void }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [manualSearchLoading, setManualSearchLoading] = useState(false);
  const [emailSearchLoading, setEmailSearchLoading] = useState(false);
  const { toast } = useToast();
  const actions = useActions();
  const { setCustomerId } = useApp();
  const savedCustomersInObjects = getAllCustomers();
  let savedCustomers: Customer[] =
    savedCustomersInObjects &&
    Object.entries(savedCustomersInObjects).map(([id, data]) => ({
      id,
      email: data.email,
      name: data.name,
      testmode: data.testmode,
    }));

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
      header: "Environment",
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
            Select
          </Button>
        );
      },
    },
  ];

  const handleManualSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setManualSearchLoading(true);
    const form = e.currentTarget;
    const customerId = form.elements.namedItem(
      "customerId"
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

    if (!customerId.value.startsWith("cus_")) {
      toast({
        variant: "destructive",
        title: "Invalid Customer ID",
        description: "Customer ID must start with 'cus_'",
        duration: 3000,
      });
      setManualSearchLoading(false);
      return;
    }

    try {
      const customer = await actions.fetchCustomer(customerId.value, testmode);
      if (!customer) {
        toast({
          variant: "destructive",
          title: "Customer Not Found",
          description: "No customer found with the provided ID.",
          duration: 3000,
        });
        setManualSearchLoading(false);
        return;
      }

      if (customer.deleted) {
        toast({
          variant: "destructive",
          title: "Customer Has Been Deleted",
          description: "Customer was found but have been deleted.",
          duration: 3000,
        });
        setManualSearchLoading(false);
        return;
      }

      saveCustomerData({
        id: customer.id,
        email: customer.email || "",
        name: customer.name || "",
        testmode: !customer.livemode,
        stateIds: {},
      });
      setCustomerId(customer.id);
      setManualSearchLoading(false);
      onNext();
    } catch (error) {
      console.error("Error fetching customer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "An error occurred while fetching the customer. Please try again.",
        duration: 3000,
      });
      setManualSearchLoading(false);
    }
  };

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
          Mimicking Klarna's sign-in flow
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
          <TypedTable columns={columns} data={savedCustomers} />
        </TabsContent>
        <TabsContent value="searchId">
          <Card>
            <div className="space-y-2 flex flex-col justify-center items-center min-h-[300px] my-4">
              <h2 className="text-xl font-extrabold tracking-tight">
                Serach by Customer ID
              </h2>
              <form
                className="mb-4 flex flex-col gap-x-6 space-y-2 w-full max-w-[300px]"
                onSubmit={handleManualSubmit}
              >
                <Input type="text" name="customerId" placeholder="cus_" />
                <div className="flex flex-row pt-1 pb-2 items-center self-end">
                  <label className="text-sm pr-2" htmlFor="testmode">
                    Testmode
                  </label>
                  <Switch
                    name="testmode"
                    id="testmode"
                    defaultChecked={false}
                  />
                </div>
                <Button type="submit" loading={manualSearchLoading}>
                  Submit
                </Button>
              </form>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="searchEmail">
          <div className="space-y-2">
            <Card>
              <div className="space-y-2 flex flex-col justify-center items-center min-h-[300px] my-4">
                <h2 className="text-xl font-extrabold tracking-tight">
                  Serach by Email
                </h2>
                <form
                  onSubmit={onEmailSearch}
                  className="mb-4 flex flex-col gap-x-6 space-y-2 w-full max-w-[300px]"
                >
                  <Input
                    type="email"
                    name="customerEmail"
                    placeholder="email"
                  />
                  <div className="flex flex-row pt-1 pb-2 items-center self-end">
                    <label className="text-sm pr-2" htmlFor="testmode">
                      Testmode
                    </label>
                    <Switch
                      name="testmode"
                      id="testmode"
                      defaultChecked={false}
                    />
                  </div>
                  <Button type="submit" loading={emailSearchLoading}>
                    Search
                  </Button>
                </form>
              </div>
            </Card>

            <div className="w-full">
              <TypedTable columns={columns} data={customers} />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="create">
          <Card>
            <div className="space-y-2 flex flex-col justify-center items-center min-h-[300px] my-4">
              <h2 className="text-xl font-extrabold tracking-tight">
                Create a New Customer
              </h2>
              <form
                className="mb-4 flex flex-col gap-x-6 space-y-2 w-full max-w-[300px]"
                onSubmit={createCustomer}
              >
                <Input type="text" name="customerName" placeholder="Name" />
                <Input type="email" name="customerEmail" placeholder="Email" />
                <div className="flex flex-row pt-1 pb-2 items-center self-end">
                  <label className="text-sm pr-2" htmlFor="testmode">
                    Testmode
                  </label>
                  <Switch
                    name="testmode"
                    id="testmode"
                    defaultChecked={false}
                  />
                </div>
                <Button type="submit">Submit</Button>
              </form>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
