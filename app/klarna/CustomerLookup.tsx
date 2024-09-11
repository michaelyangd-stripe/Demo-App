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

type Customer = {
  id: string;
  email: string;
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

export default function CustomerLookup({
  setCustomerId,
  onNext,
}: {
  setCustomerId: (id: string) => void;
  onNext: () => void;
}) {
  const [email, setEmail] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const { toast } = useToast();
  const actions = useActions();

  const handleSubmit = async (e: React.FormEvent) => {
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
      accessorKey: "email",
      header: "Email",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <Button
            onClick={() => {
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

  const handleManualSubmit = (e: FormEvent<HTMLFormElement>) => {
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
    setCustomerId(customerId.value);
    onNext();
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
        throw Error("No customer returned.");
      }
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
    <div>
      <h1 className="text-xl font-semibold mb-4">Provide Customer Id</h1>
      <div className="space-y-2">
        <h2 className="text-md">Create a Customer</h2>
        <form className="mb-4 flex flex-row gap-x-6" onSubmit={createCustomer}>
          <Input type="text" name="customerName" placeholder="Name" />
          <Input type="email" name="customerEmail" placeholder="Email" />
          <Button type="submit">Submit</Button>
        </form>
      </div>
      <Separator className="my-10" />
      <div className="space-y-2">
        <h2 className="text-md">Manual</h2>
        <form
          className="mb-4 flex flex-row gap-x-6"
          onSubmit={handleManualSubmit}
        >
          <Input type="text" name="customerId" placeholder="cus_" />
          <Button type="submit">Submit</Button>
        </form>
      </div>
      <Separator className="my-10" />
      <div className="space-y-2">
        <h2 className="text-md">Search Customers by Email</h2>
        <form onSubmit={handleSubmit} className="mb-4 flex flex-row gap-x-6">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="mb-2"
          />
          <Button type="submit">Fetch Customers</Button>
        </form>
        <CustomerTable columns={columns} data={customers} />
      </div>
    </div>
  );
}
