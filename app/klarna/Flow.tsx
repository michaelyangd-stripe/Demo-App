"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon, Link } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import CustomerLookup from "./CustomerLookup";
import PaymentMethodList from "./PaymentMethodList";

export default function Flow() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [direction, setDirection] = useState(0);
  const [customerId, setCustomerId] = useState("");

  const pageVariants = {
    initial: (direction: number) => {
      return {
        x: direction > 0 ? "20%" : "-20%",
        opacity: 0,
      };
    },
    in: {
      x: 0,
      opacity: 1,
    },
    out: (direction: number) => {
      return {
        x: direction < 0 ? "20%" : "-20%",
        opacity: 0,
      };
    },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4,
  };

  const nextStep = () => {
    setDirection(1);
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    window.scrollTo({ top: 0 });
  };

  const previousStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0 });
  };

  const steps = [
    <CustomerLookup
      key="0"
      setCustomerId={(id: string) => setCustomerId(id)}
      onNext={nextStep}
    />,
    <PaymentMethodList key="1" customerId={customerId} onNext={nextStep} />,
  ];

  return (
    <div className="w-full md:w-[85%] max-w-xl flex flex-col mx-auto min-h-[100dvh] gap-y-2 items-center pt-5 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] overflow-hidden">
      <div className="flex flex-row w-full justify-between items-center">
        <button
          onClick={previousStep}
          type="button"
          className={cn("transition-all w-fit h-fit", {
            "opacity-0": currentStep === 0,
          })}
        >
          <span className="sr-only">Back</span>
          <ArrowLeftIcon className="w-6 h-6 text-otsa_black hover:text-gray-600 transition-all" />
        </button>
        {customerId && (
          <h2 className="text-md font-semibold">
            Selected Customer:{" "}
            <a
              href={`https://go/o/${customerId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Badge>
                <Link className="w-3 h-3 mr-1" />
                {customerId}
              </Badge>
            </a>
          </h2>
        )}
      </div>
      <div className="flex justify-between rounded py-2 mb-2 w-full select-none">
        <Step step={0} currentStep={currentStep} />
        <Step step={1} currentStep={currentStep} />
        <Step step={2} currentStep={currentStep} />
      </div>
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentStep}
          custom={direction}
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          transition={pageTransition}
          className="flex-1 w-full "
        >
          {steps[currentStep]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Step({ step, currentStep }: { step: number; currentStep: number }) {
  let status =
    currentStep === step
      ? "active"
      : currentStep < step
      ? "inactive"
      : "complete";

  return (
    <motion.div animate={status} className="relative">
      <motion.div
        variants={{
          active: {
            scale: 1,
            transition: {
              delay: 0,
              duration: 0.2,
            },
          },
          complete: {
            scale: 1.25,
          },
        }}
        transition={{
          duration: 0.6,
          delay: 0.2,
          type: "tween",
          ease: "circOut",
        }}
        className="absolute inset-0 rounded-full"
      ></motion.div>

      <motion.div
        initial={false}
        variants={{
          inactive: {
            backgroundColor: "hsl(var(--background))",
            borderColor: "hsl(var(--muted))",
            color: "hsl(var(--muted))",
          },
          active: {
            backgroundColor: "hsl(var(--background))",
            borderColor: "hsl(var(--primary))",
            color: "hsl(var(--primary))",
          },
          complete: {
            backgroundColor: "hsl(var(--primary))",
            borderColor: "hsl(var(--primary))",
            color: "hsl(var(--background))",
          },
        }}
        transition={{ duration: 0.2 }}
        className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold`}
      >
        <div className="flex items-center justify-center">
          {status === "complete" ? (
            <CheckIcon className="h-6 w-6" />
          ) : (
            <span>{step + 1}</span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          type: "tween",
          ease: "easeOut",
          duration: 0.3,
          delay: 0.05,
        }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
