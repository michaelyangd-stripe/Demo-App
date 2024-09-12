"use client";

import { useEffect, useState } from "react";
import Stripe from "stripe";
import { useToast } from "@/hooks/use-toast";
import { getStateDataByStateId } from "@/app/klarna/localstorage";
import { useActions } from "./hooks/useActions";
import { useApp } from "./contexts/AppContext";
import { BankDialog } from "./BankDialog";
import { AccountsDialog } from "./AccountsDialog";
import { Button } from "@/components/ui/button";
import { LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import TypedTable from "./TypedTable";
import { AlertTriangleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type PaymentMethod = {
  id: string;
  bankName: string;
  accountType: string;
  last4: string;
};

const columns: ColumnDef<PaymentMethod>[] = [
  {
    accessorKey: "bankName",
    header: "Bank",
  },
  {
    accessorKey: "accountType",
    header: "Type",
  },
  {
    accessorKey: "last4",
    header: "Last 4",
  },
  {
    accessorKey: "id",
    header: "FCA",
    cell: ({ row }) => (
      <a
        href={`https://go/o/${row.original.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Badge className="text-[0.625rem] px-1.5 py-[0.05rem] leading-normal">
          <LinkIcon className="w-3 h-3 mr-1" />
          {row.original.id}
        </Badge>
      </a>
    ),
  },
];

export default function PaymentMethodList({
  onBackClick,
  onSuccess,
}: {
  onBackClick: () => void;
  onSuccess: () => void;
}) {
  const [paymentMethods, setPaymentMethods] = useState<Stripe.PaymentMethod[]>(
    []
  );
  const [isPaymentMethodLoading, setIsPaymentMethodLoading] = useState(false);
  const [openBankDialog, setOpenBankDialog] = useState<boolean>(false);
  const [openAccountsDialog, setOpenAccountsDialog] = useState<boolean>(false);
  const { toast } = useToast();
  const actions = useActions();
  const { customer } = useApp();
  const [accounts, setAccounts] = useState<
    Stripe.FinancialConnections.Account[]
  >([]);

  useEffect(() => {
    if (customer?.id) {
      fetchPaymentMethods();
    }
  }, [customer?.id]);

  const [isLoading, setIsLoading] = useState(false);

  const handleCompletedConnection = async (stateId: string) => {
    setIsLoading(true);
    try {
      window?.focus();
    } catch (error) {
      console.log(error);
    }
    const stateInfo = getStateDataByStateId(stateId);
    if (!stateInfo || !stateInfo.stateData.fcId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid state data",
      });
      setIsLoading(false);
      return;
    }

    try {
      const session = await actions.getFinancialConnectionsSession(
        stateInfo.stateData.fcId
      );
      if (session && session.accounts && session.accounts.data) {
        setAccounts(session.accounts.data);
        setOpenBankDialog(false);
        setOpenAccountsDialog(true);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No accounts found in session",
        });
      }
    } catch (error) {
      console.error("Error fetching session:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch session data",
      });
    }

    setIsLoading(false);
  };

  const handleCompletedPaymentMethodSave = () => {
    fetchPaymentMethods();
    onSuccess();
  };

  if (isLoading) {
    return <div>Processing completed session</div>;
  }

  if (!customer) {
    return (
      <Alert>
        <AlertTriangleIcon className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription className="flex flex-col space-y-2">
          <span>You must select a customer first</span>
          <Button className="w-fit" onClick={onBackClick}>
            Add a Customer
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const fetchPaymentMethods = async () => {
    setIsPaymentMethodLoading(true);
    try {
      const methods = await actions.getPaymentMethods();
      setPaymentMethods(methods);
      setIsPaymentMethodLoading(false);
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
        title: "Error Creating New Session",
        description: `Message: ${errorMessage}`,
        duration: 3000,
      });
      setIsPaymentMethodLoading(false);
      return;
    }
  };

  const paymentMethodsData: PaymentMethod[] =
    paymentMethods.length > 0
      ? paymentMethods.map((pm) => ({
          id: pm.us_bank_account?.financial_connections_account || "",
          bankName: pm.us_bank_account?.bank_name || "",
          accountType: pm.us_bank_account?.account_type || "",
          last4: pm.us_bank_account?.last4 || "",
        }))
      : [];

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-row justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Saved Payment Methods
          </h1>
          <p className="text-lg text-muted-foreground">
            {`Mimicking Klarna's payment method settings page`}
          </p>
        </div>
        <Button onClick={() => setOpenBankDialog(true)}>
          Add Payment Method
        </Button>
      </div>
      <TypedTable
        columns={columns}
        data={paymentMethodsData}
        loading={isPaymentMethodLoading}
      />
      <BankDialog
        isOpen={openBankDialog}
        onClose={() => setOpenBankDialog(false)}
        handleCompletedConnection={handleCompletedConnection}
      />
      <AccountsDialog
        isOpen={openAccountsDialog}
        accounts={accounts}
        onClose={() => setOpenAccountsDialog(false)}
        handleCompletedPaymentMethodSave={handleCompletedPaymentMethodSave}
      />
    </div>
  );
}
