import { createContext, ReactNode, useContext, useState } from "react";

type ValidationFunction = () => Promise<boolean>;

type StepValidationContextType = {
  registerValidation: (stepId: string, validationFn: ValidationFunction) => void;
  unregisterValidation: (stepId: string) => void;
  validateStep: (stepId: string) => Promise<boolean>;
};

const StepValidationContext = createContext<StepValidationContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useStepValidation = () => {
  const context = useContext(StepValidationContext);
  if (!context) {
    throw new Error("useStepValidation must be used within a StepValidationProvider");
  }
  return context;
};

type StepValidationProviderProps = {
  children: ReactNode;
};

export const StepValidationProvider = ({ children }: StepValidationProviderProps) => {
  const [validationFunctions, setValidationFunctions] = useState<Record<string, ValidationFunction>>({});

  const registerValidation = (stepId: string, validationFn: ValidationFunction) => {
    setValidationFunctions((prev) => ({
      ...prev,
      [stepId]: validationFn,
    }));
  };

  const unregisterValidation = (stepId: string) => {
    setValidationFunctions((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [stepId]: _, ...rest } = prev;
      return rest;
    });
  };

  const validateStep = async (stepId: string): Promise<boolean> => {
    const validationFn = validationFunctions[stepId];
    if (!validationFn) {
      return true; // No validation function means step is valid
    }
    return await validationFn();
  };

  return (
    <StepValidationContext.Provider value={{ registerValidation, unregisterValidation, validateStep }}>
      {children}
    </StepValidationContext.Provider>
  );
};
