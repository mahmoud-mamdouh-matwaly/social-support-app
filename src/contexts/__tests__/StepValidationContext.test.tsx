import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { StepValidationProvider, useStepValidation } from "../StepValidationContext";

// Test component to interact with the context
const TestComponent = ({ stepId, shouldValidate = true }: { stepId: string; shouldValidate?: boolean }) => {
  const { registerValidation, unregisterValidation, validateStep } = useStepValidation();

  const handleRegister = () => {
    const validationFn = vi.fn().mockResolvedValue(shouldValidate);
    registerValidation(stepId, validationFn);
  };

  const handleUnregister = () => {
    unregisterValidation(stepId);
  };

  const handleValidate = async () => {
    const result = await validateStep(stepId);
    // Display result for testing
    const resultElement = document.createElement("div");
    resultElement.setAttribute("data-testid", "validation-result");
    resultElement.textContent = result.toString();
    document.body.appendChild(resultElement);
  };

  return (
    <div>
      <button onClick={handleRegister} data-testid="register-button">
        Register {stepId}
      </button>
      <button onClick={handleUnregister} data-testid="unregister-button">
        Unregister {stepId}
      </button>
      <button onClick={handleValidate} data-testid="validate-button">
        Validate {stepId}
      </button>
    </div>
  );
};

// Component to test hook outside provider
const TestComponentWithoutProvider = () => {
  try {
    useStepValidation();
    return <div data-testid="no-error">No error</div>;
  } catch (error) {
    return <div data-testid="error-message">{(error as Error).message}</div>;
  }
};

describe("StepValidationContext", () => {
  beforeEach(() => {
    // Clean up any previous validation results
    const existingResults = document.querySelectorAll(
      '[data-testid^="validation-result"], [data-testid="async-validation-result"]'
    );
    existingResults.forEach((element) => element.remove());
    const existingErrors = document.querySelectorAll('[data-testid="validation-error"]');
    existingErrors.forEach((element) => element.remove());
  });

  describe("StepValidationProvider", () => {
    it("renders children correctly", () => {
      render(
        <StepValidationProvider>
          <div data-testid="child-component">Test Child</div>
        </StepValidationProvider>
      );

      expect(screen.getByTestId("child-component")).toBeInTheDocument();
      expect(screen.getByText("Test Child")).toBeInTheDocument();
    });

    it("provides context value to children", () => {
      render(
        <StepValidationProvider>
          <TestComponent stepId="test-step" />
        </StepValidationProvider>
      );

      // Should render without errors, indicating context is available
      expect(screen.getByTestId("register-button")).toBeInTheDocument();
      expect(screen.getByTestId("unregister-button")).toBeInTheDocument();
      expect(screen.getByTestId("validate-button")).toBeInTheDocument();
    });
  });

  describe("useStepValidation hook", () => {
    it("throws error when used outside provider", () => {
      render(<TestComponentWithoutProvider />);

      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(screen.getByText("useStepValidation must be used within a StepValidationProvider")).toBeInTheDocument();
    });

    it("returns context value when used within provider", () => {
      render(
        <StepValidationProvider>
          <TestComponent stepId="test-step" />
        </StepValidationProvider>
      );

      // Should not throw error and render buttons
      expect(screen.getByTestId("register-button")).toBeInTheDocument();
      expect(screen.getByTestId("unregister-button")).toBeInTheDocument();
      expect(screen.getByTestId("validate-button")).toBeInTheDocument();
    });
  });

  describe("registerValidation", () => {
    it("registers a validation function for a step", async () => {
      render(
        <StepValidationProvider>
          <TestComponent stepId="personal-info" shouldValidate={true} />
        </StepValidationProvider>
      );

      // Register validation function
      await act(async () => {
        screen.getByTestId("register-button").click();
      });

      // Validate the step
      await act(async () => {
        screen.getByTestId("validate-button").click();
      });

      // Should return true (validation passed)
      expect(screen.getByTestId("validation-result")).toHaveTextContent("true");
    });

    it("allows registering multiple validation functions for different steps", async () => {
      const MultiStepComponent = () => (
        <div>
          <TestComponent stepId="step-1" shouldValidate={true} />
          <TestComponent stepId="step-2" shouldValidate={false} />
        </div>
      );

      render(
        <StepValidationProvider>
          <MultiStepComponent />
        </StepValidationProvider>
      );

      const registerButtons = screen.getAllByTestId("register-button");
      const validateButtons = screen.getAllByTestId("validate-button");

      // Register both validation functions
      await act(async () => {
        registerButtons[0].click(); // step-1
        registerButtons[1].click(); // step-2
      });

      // Validate step-1 (should pass)
      await act(async () => {
        validateButtons[0].click();
      });

      let results = screen.getAllByTestId("validation-result");
      expect(results[0]).toHaveTextContent("true");

      // Validate step-2 (should fail)
      await act(async () => {
        validateButtons[1].click();
      });

      results = screen.getAllByTestId("validation-result");
      expect(results[1]).toHaveTextContent("false");
    });

    it("overwrites existing validation function for the same step", async () => {
      const mockValidation1 = vi.fn().mockResolvedValue(true);
      const mockValidation2 = vi.fn().mockResolvedValue(false);

      const TestComponentWithMocks = () => {
        const { registerValidation, validateStep } = useStepValidation();

        const handleRegisterFirst = () => {
          registerValidation("test-step", mockValidation1);
        };

        const handleRegisterSecond = () => {
          registerValidation("test-step", mockValidation2);
        };

        const handleValidate = async () => {
          const result = await validateStep("test-step");
          const resultElement = document.createElement("div");
          resultElement.setAttribute("data-testid", "validation-result");
          resultElement.textContent = result.toString();
          document.body.appendChild(resultElement);
        };

        return (
          <div>
            <button onClick={handleRegisterFirst} data-testid="register-first">
              Register First
            </button>
            <button onClick={handleRegisterSecond} data-testid="register-second">
              Register Second
            </button>
            <button onClick={handleValidate} data-testid="validate">
              Validate
            </button>
          </div>
        );
      };

      render(
        <StepValidationProvider>
          <TestComponentWithMocks />
        </StepValidationProvider>
      );

      // Register first validation function
      await act(async () => {
        screen.getByTestId("register-first").click();
      });

      // Register second validation function (should overwrite first)
      await act(async () => {
        screen.getByTestId("register-second").click();
      });

      // Validate - should use second function
      await act(async () => {
        screen.getByTestId("validate").click();
      });

      expect(screen.getByTestId("validation-result")).toHaveTextContent("false");
      expect(mockValidation1).not.toHaveBeenCalled();
      expect(mockValidation2).toHaveBeenCalledOnce();
    });
  });

  describe("unregisterValidation", () => {
    it("removes validation function for a step", async () => {
      render(
        <StepValidationProvider>
          <TestComponent stepId="test-step" shouldValidate={false} />
        </StepValidationProvider>
      );

      // Register validation function
      await act(async () => {
        screen.getByTestId("register-button").click();
      });

      // Unregister validation function
      await act(async () => {
        screen.getByTestId("unregister-button").click();
      });

      // Validate the step (should return true since no validation function exists)
      await act(async () => {
        screen.getByTestId("validate-button").click();
      });

      expect(screen.getByTestId("validation-result")).toHaveTextContent("true");
    });

    it("handles unregistering non-existent step gracefully", async () => {
      const TestComponentForUnregister = () => {
        const { unregisterValidation, validateStep } = useStepValidation();

        const handleUnregister = () => {
          unregisterValidation("non-existent-step");
        };

        const handleValidate = async () => {
          const result = await validateStep("non-existent-step");
          const resultElement = document.createElement("div");
          resultElement.setAttribute("data-testid", "validation-result");
          resultElement.textContent = result.toString();
          document.body.appendChild(resultElement);
        };

        return (
          <div>
            <button onClick={handleUnregister} data-testid="unregister">
              Unregister
            </button>
            <button onClick={handleValidate} data-testid="validate">
              Validate
            </button>
          </div>
        );
      };

      render(
        <StepValidationProvider>
          <TestComponentForUnregister />
        </StepValidationProvider>
      );

      // Unregister non-existent step (should not throw error)
      await act(async () => {
        screen.getByTestId("unregister").click();
      });

      // Validate should still work and return true
      await act(async () => {
        screen.getByTestId("validate").click();
      });

      expect(screen.getByTestId("validation-result")).toHaveTextContent("true");
    });

    it("only removes the specified step validation", async () => {
      const MultiStepUnregisterComponent = () => {
        const { registerValidation, unregisterValidation, validateStep } = useStepValidation();

        const handleRegisterBoth = () => {
          registerValidation("step-1", vi.fn().mockResolvedValue(true));
          registerValidation("step-2", vi.fn().mockResolvedValue(false));
        };

        const handleUnregisterStep1 = () => {
          unregisterValidation("step-1");
        };

        const handleValidateStep1 = async () => {
          const result = await validateStep("step-1");
          const resultElement = document.createElement("div");
          resultElement.setAttribute("data-testid", "validation-result-1");
          resultElement.textContent = result.toString();
          document.body.appendChild(resultElement);
        };

        const handleValidateStep2 = async () => {
          const result = await validateStep("step-2");
          const resultElement = document.createElement("div");
          resultElement.setAttribute("data-testid", "validation-result-2");
          resultElement.textContent = result.toString();
          document.body.appendChild(resultElement);
        };

        return (
          <div>
            <button onClick={handleRegisterBoth} data-testid="register-both">
              Register Both
            </button>
            <button onClick={handleUnregisterStep1} data-testid="unregister-step-1">
              Unregister Step 1
            </button>
            <button onClick={handleValidateStep1} data-testid="validate-step-1">
              Validate Step 1
            </button>
            <button onClick={handleValidateStep2} data-testid="validate-step-2">
              Validate Step 2
            </button>
          </div>
        );
      };

      render(
        <StepValidationProvider>
          <MultiStepUnregisterComponent />
        </StepValidationProvider>
      );

      // Register both validation functions
      await act(async () => {
        screen.getByTestId("register-both").click();
      });

      // Unregister only step-1
      await act(async () => {
        screen.getByTestId("unregister-step-1").click();
      });

      // Validate step-1 (should return true - no validation function)
      await act(async () => {
        screen.getByTestId("validate-step-1").click();
      });

      // Validate step-2 (should return false - validation function still exists)
      await act(async () => {
        screen.getByTestId("validate-step-2").click();
      });

      expect(screen.getByTestId("validation-result-1")).toHaveTextContent("true");
      expect(screen.getByTestId("validation-result-2")).toHaveTextContent("false");
    });
  });

  describe("validateStep", () => {
    it("returns true when no validation function is registered", async () => {
      render(
        <StepValidationProvider>
          <TestComponent stepId="unregistered-step" />
        </StepValidationProvider>
      );

      // Validate without registering
      await act(async () => {
        screen.getByTestId("validate-button").click();
      });

      expect(screen.getByTestId("validation-result")).toHaveTextContent("true");
    });

    it("calls the registered validation function and returns its result", async () => {
      const mockValidation = vi.fn().mockResolvedValue(false);

      const TestComponentWithMock = () => {
        const { registerValidation, validateStep } = useStepValidation();

        const handleRegister = () => {
          registerValidation("test-step", mockValidation);
        };

        const handleValidate = async () => {
          const result = await validateStep("test-step");
          const resultElement = document.createElement("div");
          resultElement.setAttribute("data-testid", "validation-result");
          resultElement.textContent = result.toString();
          document.body.appendChild(resultElement);
        };

        return (
          <div>
            <button onClick={handleRegister} data-testid="register">
              Register
            </button>
            <button onClick={handleValidate} data-testid="validate">
              Validate
            </button>
          </div>
        );
      };

      render(
        <StepValidationProvider>
          <TestComponentWithMock />
        </StepValidationProvider>
      );

      // Register validation function
      await act(async () => {
        screen.getByTestId("register").click();
      });

      // Validate
      await act(async () => {
        screen.getByTestId("validate").click();
      });

      expect(mockValidation).toHaveBeenCalledOnce();
      expect(screen.getByTestId("validation-result")).toHaveTextContent("false");
    });

    it("handles async validation functions correctly", async () => {
      const mockAsyncValidation = vi.fn().mockResolvedValue(true);

      const TestComponentWithAsyncValidation = () => {
        const { registerValidation, validateStep } = useStepValidation();

        const handleRegister = () => {
          registerValidation("async-step", mockAsyncValidation);
        };

        const handleValidate = async () => {
          const result = await validateStep("async-step");
          const resultElement = document.createElement("div");
          resultElement.setAttribute("data-testid", "async-validation-result");
          resultElement.textContent = result.toString();
          document.body.appendChild(resultElement);
        };

        return (
          <div>
            <button onClick={handleRegister} data-testid="register">
              Register
            </button>
            <button onClick={handleValidate} data-testid="validate">
              Validate
            </button>
          </div>
        );
      };

      render(
        <StepValidationProvider>
          <TestComponentWithAsyncValidation />
        </StepValidationProvider>
      );

      // Register async validation function
      await act(async () => {
        screen.getByTestId("register").click();
      });

      // Validate (should wait for async function)
      await act(async () => {
        screen.getByTestId("validate").click();
      });

      // Wait for the async validation result to appear
      await waitFor(() => {
        expect(screen.getByTestId("async-validation-result")).toBeInTheDocument();
      });

      expect(mockAsyncValidation).toHaveBeenCalledOnce();
      expect(screen.getByTestId("async-validation-result")).toHaveTextContent("true");
    });

    it("handles validation function errors gracefully", async () => {
      const mockValidationWithError = vi.fn().mockRejectedValue(new Error("Validation error"));

      const TestComponentWithError = () => {
        const { registerValidation, validateStep } = useStepValidation();

        const handleRegister = () => {
          registerValidation("error-step", mockValidationWithError);
        };

        const handleValidate = async () => {
          try {
            const result = await validateStep("error-step");
            const resultElement = document.createElement("div");
            resultElement.setAttribute("data-testid", "validation-result");
            resultElement.textContent = result.toString();
            document.body.appendChild(resultElement);
          } catch (error) {
            const errorElement = document.createElement("div");
            errorElement.setAttribute("data-testid", "validation-error");
            errorElement.textContent = (error as Error).message;
            document.body.appendChild(errorElement);
          }
        };

        return (
          <div>
            <button onClick={handleRegister} data-testid="register">
              Register
            </button>
            <button onClick={handleValidate} data-testid="validate">
              Validate
            </button>
          </div>
        );
      };

      render(
        <StepValidationProvider>
          <TestComponentWithError />
        </StepValidationProvider>
      );

      // Register validation function that throws error
      await act(async () => {
        screen.getByTestId("register").click();
      });

      // Validate (should handle error)
      await act(async () => {
        screen.getByTestId("validate").click();
      });

      expect(mockValidationWithError).toHaveBeenCalledOnce();
      expect(screen.getByTestId("validation-error")).toHaveTextContent("Validation error");
    });
  });

  describe("integration scenarios", () => {
    it("handles complete registration, validation, and unregistration cycle", async () => {
      const mockValidation = vi.fn().mockResolvedValue(true);

      const IntegrationTestComponent = () => {
        const { registerValidation, unregisterValidation, validateStep } = useStepValidation();

        const handleRegister = () => {
          registerValidation("integration-step", mockValidation);
        };

        const handleValidate = async () => {
          const result = await validateStep("integration-step");
          const resultElement = document.createElement("div");
          resultElement.setAttribute("data-testid", "validation-result");
          resultElement.textContent = result.toString();
          document.body.appendChild(resultElement);
        };

        const handleUnregister = () => {
          unregisterValidation("integration-step");
        };

        return (
          <div>
            <button onClick={handleRegister} data-testid="register">
              Register
            </button>
            <button onClick={handleValidate} data-testid="validate">
              Validate
            </button>
            <button onClick={handleUnregister} data-testid="unregister">
              Unregister
            </button>
          </div>
        );
      };

      render(
        <StepValidationProvider>
          <IntegrationTestComponent />
        </StepValidationProvider>
      );

      // 1. Validate before registration (should return true)
      await act(async () => {
        screen.getByTestId("validate").click();
      });
      expect(screen.getAllByTestId("validation-result")[0]).toHaveTextContent("true");

      // 2. Register validation function
      await act(async () => {
        screen.getByTestId("register").click();
      });

      // 3. Validate after registration (should call function and return true)
      await act(async () => {
        screen.getByTestId("validate").click();
      });
      expect(mockValidation).toHaveBeenCalledOnce();
      expect(screen.getAllByTestId("validation-result")[1]).toHaveTextContent("true");

      // 4. Unregister validation function
      await act(async () => {
        screen.getByTestId("unregister").click();
      });

      // 5. Validate after unregistration (should return true without calling function)
      await act(async () => {
        screen.getByTestId("validate").click();
      });
      expect(mockValidation).toHaveBeenCalledOnce(); // Still only called once
      expect(screen.getAllByTestId("validation-result")[2]).toHaveTextContent("true");
    });

    it("maintains separate validation state for multiple providers", () => {
      const TestComponentInProvider = ({ providerId }: { providerId: string }) => {
        const { registerValidation, validateStep } = useStepValidation();

        const handleRegister = () => {
          const validationFn = vi.fn().mockResolvedValue(providerId === "provider-1");
          registerValidation("test-step", validationFn);
        };

        const handleValidate = async () => {
          const result = await validateStep("test-step");
          const resultElement = document.createElement("div");
          resultElement.setAttribute("data-testid", `validation-result-${providerId}`);
          resultElement.textContent = result.toString();
          document.body.appendChild(resultElement);
        };

        return (
          <div>
            <button onClick={handleRegister} data-testid={`register-${providerId}`}>
              Register {providerId}
            </button>
            <button onClick={handleValidate} data-testid={`validate-${providerId}`}>
              Validate {providerId}
            </button>
          </div>
        );
      };

      render(
        <div>
          <StepValidationProvider>
            <TestComponentInProvider providerId="provider-1" />
          </StepValidationProvider>
          <StepValidationProvider>
            <TestComponentInProvider providerId="provider-2" />
          </StepValidationProvider>
        </div>
      );

      // Both providers should work independently
      expect(screen.getByTestId("register-provider-1")).toBeInTheDocument();
      expect(screen.getByTestId("register-provider-2")).toBeInTheDocument();
      expect(screen.getByTestId("validate-provider-1")).toBeInTheDocument();
      expect(screen.getByTestId("validate-provider-2")).toBeInTheDocument();
    });
  });
});
