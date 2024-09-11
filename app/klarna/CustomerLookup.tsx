"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActions } from "./hooks/useActions";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Separator } from "@/components/ui/separator";
import { getAllCustomers } from "@/lib/stateId";

type Customer = {
  id: string;
  email: string;
  name: string;
  testmode: boolean;
};

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "./contexts/AppContext";
import { saveCustomerData } from "@/lib/stateId";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const CustomerTable = <TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {(table.getCanPreviousPage() || table.getCanNextPage()) && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default function CustomerLookup({ onNext }: { onNext: () => void }) {
  const [email, setEmail] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
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

  const fetchCustomers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        variant: "destructive",
        title: "Empty E-mail",
        description: "Please provide an email to look up.",
        duration: 3000,
      });
      return;
    }

    const response = await actions.fetchCustomers(email);
    if (response && response.data) {
      if (response.data.length === 0) {
        toast({
          variant: "destructive",
          title: "No Customer Found",
          description: "There were no cusomters found for this email.",
          duration: 3000,
        });
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
      header: "testmode",
      cell: ({ row }) => {
        if (typeof row.original.testmode == "boolean") {
          return (
            <Badge
              className={
                row.original.testmode
                  ? "bg-[#ff8f0e] text-white"
                  : "bg-[#4299e1] text-white"
              }
            >
              {row.original.testmode ? "test" : "livemode"}
            </Badge>
          );
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
    const form = e.currentTarget;
    const customerId = form.elements.namedItem(
      "customerId"
    ) as HTMLInputElement;
    if (!customerId.value.startsWith("cus_")) {
      toast({
        variant: "destructive",
        title: "Invalid Customer ID",
        description: "Customer ID must start with 'cus_'",
        duration: 3000,
      });
      return;
    }

    try {
      const customer = await actions.fetchCustomer(customerId.value);
      if (!customer) {
        toast({
          variant: "destructive",
          title: "Customer Not Found",
          description: "No customer found with the provided ID.",
          duration: 3000,
        });
        return;
      }

      if (customer.deleted) {
        toast({
          variant: "destructive",
          title: "Customer Has Been Deleted",
          description: "Customer was found but have been deleted.",
          duration: 3000,
        });
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
        customerEmail.value
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
          <CustomerTable columns={columns} data={savedCustomers} />
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
                <Button type="submit">Submit</Button>
              </form>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="searchEmail">
          <div className="space-y-2">
            <Card>
              <div className="space-y-2 flex flex-col justify-center items-center min-h-[146px] my-4">
                <h2 className="text-xl font-extrabold tracking-tight">
                  Serach by Email
                </h2>
                <form
                  onSubmit={fetchCustomers}
                  className="flex flex-row gap-x-4 w-full max-w-[300px]"
                >
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email"
                    className="mb-2"
                  />
                  <Button type="submit">Search</Button>
                </form>
              </div>
            </Card>

            <div className="w-full">
              <CustomerTable columns={columns} data={customers} />
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
                <Button type="submit">Submit</Button>
              </form>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
