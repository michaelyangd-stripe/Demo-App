// components/BankDialog.tsx
import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "./contexts/AppContext";
import {
  testInstitutions,
  liveInstitutions,
} from "./constants/institutionsList";
import {
  generateStateId,
  getStateStatus,
  updateStateData,
} from "@/lib/stateId";
import { useActions } from "./hooks/useActions";
import { LoaderIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface BankDialogProps {
  isOpen: boolean;
  onClose: () => void;
  handleCompletedConnection: (stateId: string) => void;
}

export function BankDialog({
  isOpen,
  onClose,
  handleCompletedConnection,
}: BankDialogProps) {
  const [dialogStep, setDialogStep] = useState(1);
  const [consentChecked, setConsentChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { customer } = useApp();
  const institutions = customer!.testmode ? testInstitutions : liveInstitutions;
  const actions = useActions();
  const [stateIdToPoll, setStateIdToPoll] = useState<string | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // This effect will run whenever the dialog is opened
  useEffect(() => {
    if (isOpen) {
      setDialogStep(1);
      setConsentChecked(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && stateIdToPoll && customer) {
      // Start polling when the dialog is opened and we have a state ID
      pollIntervalRef.current = setInterval(() => {
        const status = getStateStatus(customer.id, stateIdToPoll);
        if (status) {
          if (status === "completed") {
            handleCompletedConnection(stateIdToPoll);
            // Stop polling
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
            }
          } else if (status === "failed") {
            // Handle failed connection
            toast({
              variant: "destructive",
              title: "Connection Failed",
              description:
                "The bank connection process failed. Please try again.",
              duration: 3000,
            });

            // Stop polling
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
            }
          }
        }
      }, 1000); // Poll every second

      // Clean up the interval when the dialog is closed or component unmounts
      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [isOpen, stateIdToPoll, customer?.id]);

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

  const onInstitutionSelect = async (institutionId: string) => {
    setIsLoading(true);
    try {
      const stateId = generateStateId(customer.id);
      const session = await actions.createFinancialConnectionsSession(
        institutionId,
        stateId
      );

      if (!session) {
        throw new Error(
          "No session returned from createFinancialConnectionsSession"
        );
      }
      updateStateData(customer.id, stateId, {
        fcId: session.id,
        status: "pending",
      });

      // @ts-ignore
      const url: string = session.url;
      if (!url) {
        throw new Error(
          "No URL returned from createFinancialConnectionsSession"
        );
      }
      window.open(url, "_blank");
      setIsLoading(false);
      setStateIdToPoll(stateId);
      setDialogStep(3);
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
      setIsLoading(false);
      return;
    }
  };

  const onCustomInstitutionSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const customInstitutionId = form.elements.namedItem(
      "customInstitutionId"
    ) as HTMLInputElement;
    if (!customInstitutionId.value.startsWith("fcinst_")) {
      toast({
        variant: "destructive",
        title: "Invalid Institution ID",
        description: "Institution ID must start with 'fcinst_'",
        duration: 3000,
      });
      return;
    }
    await onInstitutionSelect(customInstitutionId.value);
    // onNext();
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
            {(() => {
              if (dialogStep === 1) {
                return "Link your bank account";
              }
              if (dialogStep === 2) {
                return "Choose your bank";
              }
              if (dialogStep === 3) {
                return "Waiting for completion";
              }
            })()}
          </DialogTitle>
          {(() => {
            if (dialogStep === 1) {
              return (
                <div>
                  <p className="text-md text-muted-foreground">
                    Upgrade your Klarna experience and unlock a new way to pay
                    directly from your checking account.
                  </p>
                  <div className="flex flex-col text-sm py-4 px-4 space-y-4">
                    <span>
                      Verify your bank details and get an additional layer of
                      security
                    </span>
                    <Separator />
                    <span>Never worry about expired cards again</span>
                    <Separator />
                    <span>Get the most accurate credit options</span>
                    <Separator />
                  </div>
                </div>
              );
            }
            if (dialogStep === 2) {
              return (
                <div className="grid grid-cols-2 gap-4 overflow-auto py-4">
                  {institutions.map((inst) => (
                    <Button
                      key={inst.id}
                      variant={"outline"}
                      className="flex flex-col h-min gap-x-2 w-11/12 mx-auto overflow-auto"
                      onClick={() => onInstitutionSelect(inst.id)}
                      disabled={isLoading}
                    >
                      <Image
                        src={inst.imageUrl}
                        alt={inst.name}
                        width={50}
                        height={50}
                      />
                      <span className="text-[0.7rem] mt-2">{inst.name}</span>
                    </Button>
                  ))}
                </div>
              );
            }
            if (dialogStep === 3) {
              return (
                <DialogDescription className="flex flex-col gap-2 justify-center items-center py-6">
                  StateId: {stateIdToPoll}
                  <LoaderIcon className="animate-spin" />
                </DialogDescription>
              );
            }
          })()}
        </DialogHeader>
        <DialogFooter>
          {(() => {
            if (dialogStep === 1) {
              return (
                <div className="space-y-4 w-full">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={consentChecked}
                      onCheckedChange={(checked) =>
                        setConsentChecked(!!checked)
                      }
                    />
                    <label htmlFor="terms" className="text-xs">
                      I agree to the above and authorize Klarna to view and take
                      payments from my bank account per my existing payment
                      authorizations. I've also reviewed Klarna's Privacy
                      Notice.
                    </label>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!consentChecked}
                    onClick={() => setDialogStep(2)}
                  >
                    Continue with bank login
                  </Button>
                </div>
              );
            }
            if (dialogStep === 2) {
              return (
                <div className="space-y-2 w-full">
                  <form
                    onSubmit={onCustomInstitutionSubmit}
                    className="w-full flex flex-row gap-x-6"
                  >
                    <Input
                      type="text"
                      name="customInstitutionId"
                      placeholder="fcinst_customxyz"
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      Submit
                    </Button>
                  </form>
                </div>
              );
            }
            if (dialogStep === 3) {
              return (
                <Button
                  type="submit"
                  className="w-full"
                  onClick={() => {
                    setStateIdToPoll(null);
                    setDialogStep(2);
                  }}
                >
                  Go back
                </Button>
              );
            }
          })()}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
