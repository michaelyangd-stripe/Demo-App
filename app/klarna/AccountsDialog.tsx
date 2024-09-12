// components/BankDialog.tsx
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "./contexts/AppContext";
import { useActions } from "./hooks/useActions";
import Stripe from "stripe";
import { cn } from "@/lib/utils";
import { AlertTriangleIcon } from "lucide-react";

interface AccountsDialogProps {
  isOpen: boolean;
  accounts: Stripe.FinancialConnections.Account[];
  onClose: () => void;
  handleCompletedPaymentMethodSave: () => void;
}

export function AccountsDialog({
  isOpen,
  accounts,
  onClose,
  handleCompletedPaymentMethodSave,
}: AccountsDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { customer } = useApp();
  const actions = useActions();
  const supportedAccounts = accounts.filter((account) =>
    account.supported_payment_method_types.includes("us_bank_account")
  );
  if (!customer) {
    if (isOpen) {
      toast({
        variant: "destructive",
        title: "Customer Required",
        description: "Customer must be set to open Bank Dialog",
        duration: 3000,
      });
    }
    return null;
  }

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const supportedAccountIds = supportedAccounts.map(
        (account) => account.id
      );
      const session = await actions.createPaymentMethodsFromAccounts({
        accountIds: supportedAccountIds,
      });

      if (!session) {
        throw new Error(
          "No session returned from createFinancialConnectionsSession"
        );
      }
      handleCompletedPaymentMethodSave();
      onClose();
      setIsLoading(false);
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
        title: "Error Saving PaymentMethod",
        description: `${errorMessage}`,
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="pt-12 px-10">
        <DialogHeader className="min-h-96">
          <DialogTitle className="text-2xl tracking-tight">
            Save as Payment Methods
          </DialogTitle>
          <p className="text-md text-muted-foreground">
            {(() => {
              if (accounts.length === 0) {
                return "No accounts found.";
              }
              if (accounts.length !== supportedAccounts.length) {
                return `We found ${accounts.length} account${
                  accounts.length === 1 ? "" : "s"
                }, out of which ${supportedAccounts.length} ${
                  supportedAccounts.length === 1 ? "is" : "are"
                } supported`;
              }
              return `We found ${accounts.length} account${
                accounts.length === 1 ? "" : "s"
              } that you can save`;
            })()}
          </p>
          <div className="grid grid-cols-1 gap-2 overflow-auto py-4">
            {accounts.map((acc) => (
              <li key={acc.id} className="flex flex-row h-min gap-x-2">
                <span
                  className={cn(
                    "text-sm",
                    acc.supported_payment_method_types.includes(
                      "us_bank_account"
                    )
                      ? ""
                      : "opacity-50"
                  )}
                >
                  {acc.display_name} - {acc.last4}
                </span>
                {!acc.supported_payment_method_types.includes(
                  "us_bank_account"
                ) && (
                  <span className="ml-1 text-sm text-destructive flex flex-row justify-center items-center">
                    <AlertTriangleIcon className="w-2 h-2 mr-1" />
                    Unsupported
                  </span>
                )}
              </li>
            ))}
          </div>
        </DialogHeader>
        <DialogFooter>
          {supportedAccounts.length === 0 ? (
            <Button type="submit" className="w-full" onClick={onClose}>
              Close
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full"
              onClick={onSubmit}
              loading={isLoading}
            >
              Save
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
