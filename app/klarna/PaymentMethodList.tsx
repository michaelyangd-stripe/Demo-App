"use client";

import { useEffect, useState } from "react";
import Stripe from "stripe";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getStateDataByStateId } from "@/lib/stateId";
import { useActions } from "./hooks/useActions";
import { useApp } from "./contexts/AppContext";
import { BankDialog } from "./BankDialog";
import { AccountsDialog } from "./AccountsDialog";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PaymentMethodList({ onNext }: { onNext: () => void }) {
  const [paymentMethods, setPaymentMethods] = useState<Stripe.PaymentMethod[]>(
    []
  );
  const [openBankDialog, setOpenBankDialog] = useState<boolean>(false);
  const [openAccountsDialog, setOpenAccountsDialog] = useState<boolean>(false);
  const { toast } = useToast();
  const actions = useActions();
  const { customer } = useApp();
  const [accounts, setAccounts] = useState<
    Stripe.FinancialConnections.Account[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);

  const handleCompletedConnection = async (stateId: string) => {
    setIsLoading(true);
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
  };

  useEffect(() => {
    if (customer?.id) {
      fetchPaymentMethods();
    }
  }, [customer?.id]);

  if (isLoading) {
    return <div>Processing completed session</div>;
  }
  const fetchPaymentMethods = async () => {
    const methods = await actions.getPaymentMethods();
    setPaymentMethods(methods);
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">Saved Payment Methods</h2>
      <div className="grid grid-cols-2 gap-4 overflow-auto py-4">
        {paymentMethods.length > 0 ? (
          paymentMethods.map((pm) => (
            <Card key={pm.id}>
              <CardHeader className="px-4 py-3">
                <CardTitle className="text-lg">
                  {pm.us_bank_account?.bank_name}
                </CardTitle>
                <CardDescription>
                  {`${pm.us_bank_account?.account_type} - ${pm.us_bank_account?.last4}`}
                </CardDescription>
              </CardHeader>
              <CardFooter className="px-4 py-3">
                <a
                  href={`https://go/o/${pm.us_bank_account?.financial_connections_account}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Badge>
                    <Link className="w-3 h-3 mr-1" />
                    {pm.us_bank_account?.financial_connections_account}
                  </Badge>
                </a>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div>No payment methods found.</div>
        )}
      </div>
      <Button onClick={() => setOpenBankDialog(true)}>
        Add Payment Method
      </Button>
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
