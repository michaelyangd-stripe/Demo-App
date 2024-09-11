"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomerStep from "./CustomerStep";
import PaymentMethodList from "./PaymentMethodList";
import { Confetti, ConfettiRef } from "@/components/ui/confetti";

export default function Flow() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [direction, setDirection] = useState(0);
  const confettiRef = useRef<ConfettiRef>(null);

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

  const goToStep = (stepNumber: number) => {
    if (stepNumber > currentStep) {
      setDirection(1);
      setCurrentStep(stepNumber);
      window.scrollTo({ top: 0 });
    } else if (stepNumber < currentStep) {
      setDirection(-1);
      setCurrentStep(stepNumber);
      window.scrollTo({ top: 0 });
    }
  };

  const steps = [
    <CustomerStep key="0" onNext={nextStep} />,
    <PaymentMethodList
      key="1"
      onBackClick={previousStep}
      onSuccess={() => confettiRef.current?.fire({})}
    />,
  ];

  return (
    <div className="w-full max-w-3xl px-4 2xl:px-0 flex flex-col mx-auto">
      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-0 size-full pointer-events-none"
        manualstart
      />
      <div className="flex justify-around rounded py-4 mb-4 w-full select-none">
        <Step
          step={0}
          currentStep={currentStep}
          onClick={() => goToStep(0)}
          title="Customer"
        />
        <Step
          step={1}
          currentStep={currentStep}
          onClick={() => goToStep(1)}
          title="Payment Methods"
        />
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

function Step({
  step,
  currentStep,
  title,
  onClick,
}: {
  step: number;
  currentStep: number;
  title: string;
  onClick: () => void;
}) {
  let status =
    currentStep === step
      ? "active"
      : currentStep < step
      ? "inactive"
      : "complete";

  return (
    <motion.div
      animate={status}
      className="relative flex flex-col justify-center items-center space-y-0.5 cursor-pointer"
      onClick={onClick}
    >
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
      <motion.span
        initial={false}
        variants={{
          inactive: {
            color: "hsl(var(--muted))",
          },
          active: {
            color: "hsl(var(--primary))",
          },
          complete: {
            color: "hsl(var(--primary))",
          },
        }}
        transition={{ duration: 0.2 }}
        className="text-[0.5rem]"
      >
        {title}
      </motion.span>
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
