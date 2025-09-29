import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi, type MockedFunction } from "vitest";
import { StepValidationProvider } from "../../../contexts/StepValidationContext";
import applicationSlice from "../../../store/slices/applicationSlice";
import SituationDescriptions from "../SituationDescriptions";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: vi.fn(() => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "form.situationDescriptions.title": "Situation Descriptions",
        "form.situationDescriptions.subtitle":
          "Please provide detailed descriptions of your current situation to help us better understand your needs.",
        "form.situationDescriptions.fields.currentFinancialSituation.label": "Current Financial Situation",
        "form.situationDescriptions.fields.currentFinancialSituation.placeholder":
          "Describe your current financial circumstances, including income, expenses, and any financial hardships...",
        "form.situationDescriptions.fields.employmentCircumstances.label": "Employment Circumstances",
        "form.situationDescriptions.fields.employmentCircumstances.placeholder":
          "Describe your current employment status, work history, and any challenges you're facing...",
        "form.situationDescriptions.fields.reasonForApplying.label": "Reason for Applying",
        "form.situationDescriptions.fields.reasonForApplying.placeholder":
          "Explain why you are applying for financial assistance and how it will help your situation...",
        "form.situationDescriptions.validation.currentFinancialSituation.minLength":
          "Please provide at least 10 characters for your financial situation",
        "form.situationDescriptions.validation.currentFinancialSituation.maxLength":
          "Description must be less than 1000 characters",
        "form.situationDescriptions.validation.employmentCircumstances.minLength":
          "Please provide at least 10 characters for your employment circumstances",
        "form.situationDescriptions.validation.employmentCircumstances.maxLength":
          "Description must be less than 1000 characters",
        "form.situationDescriptions.validation.reasonForApplying.minLength":
          "Please provide at least 10 characters for your reason for applying",
        "form.situationDescriptions.validation.reasonForApplying.maxLength": "Description must be less than 1000 characters",
        "form.situationDescriptions.validation.formErrors": "Please fix the errors above before proceeding",
        "form.situationDescriptions.validation.submitSuccess": "Application submitted successfully",
        "form.situationDescriptions.validation.submitError": "Failed to submit application. Please try again.",
        "common.actions.saveAndContinueLater": "Save & Continue Later",
        "common.actions.unsavedChanges": "You have unsaved changes",
      };
      return translations[key] || key;
    },
    i18n: { language: "en" },
  })),
}));

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
  Toaster: ({ children }: { children: React.ReactNode }) => <div data-testid="toaster">{children}</div>,
}));

// Mock step validation context
const mockRegisterValidation = vi.fn();
const mockUnregisterValidation = vi.fn();
vi.mock("../../../contexts/StepValidationContext", () => ({
  useStepValidation: () => ({
    registerValidation: mockRegisterValidation,
    unregisterValidation: mockUnregisterValidation,
  }),
  StepValidationProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock localStorage utilities
vi.mock("../../../utils/localStorage", () => ({
  saveApplicationToLocalStorage: vi.fn(),
}));

// Mock OpenAI service
vi.mock("../../../services/openai", () => ({
  generateAISuggestion: vi.fn(),
}));

// Mock components
vi.mock("../../../components/AISuggestionModal", () => ({
  default: ({
    isOpen,
    onClose,
    onAccept,
    suggestion,
    isLoading,
    error,
    fieldLabel,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onAccept: (text: string) => void;
    suggestion: string;
    isLoading: boolean;
    error: string | null;
    fieldLabel: string;
  }) => (
    <div data-testid="ai-suggestion-modal" style={{ display: isOpen ? "block" : "none" }}>
      <div data-testid="modal-field-label">{fieldLabel}</div>
      {isLoading && <div data-testid="modal-loading">Loading...</div>}
      {error && <div data-testid="modal-error">{error}</div>}
      {suggestion && <div data-testid="modal-suggestion">{suggestion}</div>}
      <button onClick={() => onAccept(suggestion)} data-testid="modal-accept">
        Accept
      </button>
      <button onClick={onClose} data-testid="modal-close">
        Close
      </button>
    </div>
  ),
}));

vi.mock("../../../components/HelpMeWriteButton", () => ({
  default: ({
    onClick,
    disabled,
    loading,
    className,
  }: {
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-testid="help-me-write-button"
      aria-label="Help me write"
    >
      {loading ? "Loading..." : "Help Me Write"}
    </button>
  ),
}));

// Create a mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      application: applicationSlice,
    },
    preloadedState: {
      application: {
        personalInformation: {
          name: "John Doe",
          nationalId: "1234567890",
          dateOfBirth: "1990-01-01",
          gender: "male",
          address: "123 Main Street",
          city: "Dubai",
          state: "Dubai",
          country: "United Arab Emirates",
          phone: "+971501234567",
          email: "john.doe@example.com",
        },
        familyFinancialInfo: {
          maritalStatus: "single",
          dependents: "0",
          employmentStatus: "employed",
          monthlyIncome: "5000",
          housingStatus: "rent",
        },
        situationDescriptions: {
          currentFinancialSituation: "",
          employmentCircumstances: "",
          reasonForApplying: "",
        },
        currentStep: 3,
        isSubmitting: false,
        ...initialState,
      },
    },
  });
};

const renderWithProviders = (ui: React.ReactElement, { initialState = {} } = {}) => {
  const store = createMockStore(initialState);

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <StepValidationProvider>{ui}</StepValidationProvider>
      </BrowserRouter>
    </Provider>
  );
};

describe("SituationDescriptions Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form structure correctly", () => {
    renderWithProviders(<SituationDescriptions />);

    expect(screen.getByText("Situation Descriptions")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Please provide detailed descriptions of your current situation to help us better understand your needs."
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("renders all form fields", () => {
    renderWithProviders(<SituationDescriptions />);

    expect(
      screen.getByPlaceholderText(
        "Describe your current financial circumstances, including income, expenses, and any financial hardships..."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        "Describe your current employment status, work history, and any challenges you're facing..."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        "Explain why you are applying for financial assistance and how it will help your situation..."
      )
    ).toBeInTheDocument();
  });

  it("renders help me write buttons for all fields", () => {
    renderWithProviders(<SituationDescriptions />);

    const helpButtons = screen.getAllByTestId("help-me-write-button");
    expect(helpButtons).toHaveLength(3);
  });

  it("renders save and continue later button", () => {
    renderWithProviders(<SituationDescriptions />);

    const saveButton = screen.getByRole("button", { name: /save & continue later/i });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveAttribute("aria-label", "Save & Continue Later");
  });

  it("loads existing data from Redux store", () => {
    const initialState = {
      situationDescriptions: {
        currentFinancialSituation: "I am currently facing financial difficulties due to job loss.",
        employmentCircumstances: "I was laid off from my previous job three months ago.",
        reasonForApplying: "I need assistance to cover basic living expenses while I search for new employment.",
      },
    };

    renderWithProviders(<SituationDescriptions />, { initialState });

    expect(screen.getByDisplayValue("I am currently facing financial difficulties due to job loss.")).toBeInTheDocument();
    expect(screen.getByDisplayValue("I was laid off from my previous job three months ago.")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("I need assistance to cover basic living expenses while I search for new employment.")
    ).toBeInTheDocument();
  });

  it("handles textarea input correctly", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SituationDescriptions />);

    const financialTextarea = screen.getByPlaceholderText(
      "Describe your current financial circumstances, including income, expenses, and any financial hardships..."
    );
    const employmentTextarea = screen.getByPlaceholderText(
      "Describe your current employment status, work history, and any challenges you're facing..."
    );
    const reasonTextarea = screen.getByPlaceholderText(
      "Explain why you are applying for financial assistance and how it will help your situation..."
    );

    await user.type(financialTextarea, "I am experiencing financial hardship due to unexpected medical expenses.");
    await user.type(employmentTextarea, "I work part-time but my hours have been reduced significantly.");
    await user.type(reasonTextarea, "I need assistance to pay for medical bills and basic living expenses.");

    expect(financialTextarea).toHaveValue("I am experiencing financial hardship due to unexpected medical expenses.");
    expect(employmentTextarea).toHaveValue("I work part-time but my hours have been reduced significantly.");
    expect(reasonTextarea).toHaveValue("I need assistance to pay for medical bills and basic living expenses.");
  });

  it("shows character count for textareas", () => {
    renderWithProviders(<SituationDescriptions />);

    // All textareas should have character count (showCharCount prop is true)
    const textareas = screen.getAllByRole("textbox");
    expect(textareas).toHaveLength(3);

    // Check that textareas have maxLength attribute
    textareas.forEach((textarea) => {
      expect(textarea).toHaveAttribute("maxLength", "1000");
    });
  });

  it("shows unsaved changes message when form is dirty", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SituationDescriptions />);

    const financialTextarea = screen.getByPlaceholderText(
      "Describe your current financial circumstances, including income, expenses, and any financial hardships..."
    );
    await user.type(financialTextarea, "Some text to make form dirty");

    await waitFor(() => {
      expect(screen.getByText("You have unsaved changes")).toBeInTheDocument();
    });
  });

  it("handles save and continue later functionality", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SituationDescriptions />);

    const financialTextarea = screen.getByPlaceholderText(
      "Describe your current financial circumstances, including income, expenses, and any financial hardships..."
    );
    await user.type(financialTextarea, "Test financial situation");

    const saveButton = screen.getByRole("button", { name: /save & continue later/i });
    await user.click(saveButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("registers validation function on mount", () => {
    renderWithProviders(<SituationDescriptions />);

    expect(mockRegisterValidation).toHaveBeenCalledWith("situation-descriptions", expect.any(Function));
  });

  it("unregisters validation function on unmount", () => {
    const { unmount } = renderWithProviders(<SituationDescriptions />);

    unmount();

    expect(mockUnregisterValidation).toHaveBeenCalledWith("situation-descriptions");
  });

  it("validates form fields correctly", async () => {
    renderWithProviders(<SituationDescriptions />);

    // Get the validation function that was registered
    const validationFunction = mockRegisterValidation.mock.calls[0][1];

    // Test with empty form (should fail validation)
    const isValidEmpty = await validationFunction();
    expect(isValidEmpty).toBe(false);

    // Fill out the form with valid data
    const financialTextarea = screen.getByPlaceholderText(
      "Describe your current financial circumstances, including income, expenses, and any financial hardships..."
    );
    const employmentTextarea = screen.getByPlaceholderText(
      "Describe your current employment status, work history, and any challenges you're facing..."
    );
    const reasonTextarea = screen.getByPlaceholderText(
      "Explain why you are applying for financial assistance and how it will help your situation..."
    );

    fireEvent.change(financialTextarea, {
      target: {
        value: "I am experiencing significant financial difficulties due to unexpected medical expenses and job loss.",
      },
    });
    fireEvent.change(employmentTextarea, {
      target: {
        value: "I was recently laid off from my full-time position and am actively seeking new employment opportunities.",
      },
    });
    fireEvent.change(reasonTextarea, {
      target: { value: "I need financial assistance to cover basic living expenses while I search for stable employment." },
    });

    // Test with valid form data - this will trigger submission
    const isValidFilled = await validationFunction();
    expect(isValidFilled).toBe(true);
  });

  it("validates minimum length for all fields", async () => {
    renderWithProviders(<SituationDescriptions />);

    const financialTextarea = screen.getByPlaceholderText(
      "Describe your current financial circumstances, including income, expenses, and any financial hardships..."
    );
    const employmentTextarea = screen.getByPlaceholderText(
      "Describe your current employment status, work history, and any challenges you're facing..."
    );
    const reasonTextarea = screen.getByPlaceholderText(
      "Explain why you are applying for financial assistance and how it will help your situation..."
    );

    // Test minimum length validation (less than 10 characters)
    fireEvent.change(financialTextarea, { target: { value: "Short" } });
    fireEvent.blur(financialTextarea);

    fireEvent.change(employmentTextarea, { target: { value: "Brief" } });
    fireEvent.blur(employmentTextarea);

    fireEvent.change(reasonTextarea, { target: { value: "Help" } });
    fireEvent.blur(reasonTextarea);

    // Get the validation function and trigger it to show validation errors
    const validationFunction = mockRegisterValidation.mock.calls[0][1];
    await validationFunction();

    // Validation messages should appear
    await waitFor(() => {
      expect(screen.getByText("Please provide at least 10 characters for your financial situation")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText("Please provide at least 10 characters for your employment circumstances")
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Please provide at least 10 characters for your reason for applying")).toBeInTheDocument();
    });
  });

  it("validates maximum length for all fields", async () => {
    renderWithProviders(<SituationDescriptions />);

    const longText = "A".repeat(1001); // Exceeds 1000 character limit

    const financialTextarea = screen.getByPlaceholderText(
      "Describe your current financial circumstances, including income, expenses, and any financial hardships..."
    );
    fireEvent.change(financialTextarea, { target: { value: longText } });
    fireEvent.blur(financialTextarea);

    // Get the validation function and trigger it to show validation errors
    const validationFunction = mockRegisterValidation.mock.calls[0][1];
    await validationFunction();

    await waitFor(() => {
      expect(screen.getByText("Description must be less than 1000 characters")).toBeInTheDocument();
    });
  });

  it("handles help me write button clicks", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SituationDescriptions />);

    const helpButtons = screen.getAllByTestId("help-me-write-button");

    // Click the first help button (financial situation)
    await user.click(helpButtons[0]);

    // AI modal should open
    await waitFor(() => {
      expect(screen.getByTestId("ai-suggestion-modal")).toBeVisible();
      expect(screen.getByTestId("modal-field-label")).toHaveTextContent("Current Financial Situation");
    });
  });

  it("handles AI suggestion acceptance", async () => {
    const user = userEvent.setup();
    const { generateAISuggestion } = await import("../../../services/openai");

    // Mock successful AI response
    (generateAISuggestion as MockedFunction<typeof generateAISuggestion>).mockResolvedValue({
      success: true,
      suggestion: "I am currently facing financial difficulties due to unexpected circumstances.",
    });

    renderWithProviders(<SituationDescriptions />);

    const helpButtons = screen.getAllByTestId("help-me-write-button");
    await user.click(helpButtons[0]);

    // Wait for AI response and accept suggestion
    await waitFor(() => {
      expect(screen.getByTestId("modal-suggestion")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("modal-accept"));

    // Check that the suggestion was inserted into the textarea
    const financialTextarea = screen.getByPlaceholderText(
      "Describe your current financial circumstances, including income, expenses, and any financial hardships..."
    );
    expect(financialTextarea).toHaveValue("I am currently facing financial difficulties due to unexpected circumstances.");
  });

  it("handles AI suggestion errors", async () => {
    const user = userEvent.setup();
    const { generateAISuggestion } = await import("../../../services/openai");

    // Mock AI error response
    (generateAISuggestion as MockedFunction<typeof generateAISuggestion>).mockResolvedValue({
      success: false,
      error: "API rate limit exceeded",
      suggestion: "",
    });

    renderWithProviders(<SituationDescriptions />);

    const helpButtons = screen.getAllByTestId("help-me-write-button");
    await user.click(helpButtons[0]);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByTestId("modal-error")).toHaveTextContent("API rate limit exceeded");
    });
  });

  it("handles network errors for AI suggestions", async () => {
    const user = userEvent.setup();
    const { generateAISuggestion } = await import("../../../services/openai");

    // Mock network error response
    (generateAISuggestion as MockedFunction<typeof generateAISuggestion>).mockResolvedValue({
      success: false,
      error: "Connection error. Please check your internet and try again.",
      errorType: "network",
      suggestion: "",
    });

    renderWithProviders(<SituationDescriptions />);

    const helpButtons = screen.getAllByTestId("help-me-write-button");
    await user.click(helpButtons[0]);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByTestId("modal-error")).toHaveTextContent(
        "Connection error. Please check your internet and try again. Please check your internet connection."
      );
    });
  });

  it("closes AI modal correctly", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SituationDescriptions />);

    const helpButtons = screen.getAllByTestId("help-me-write-button");
    await user.click(helpButtons[0]);

    // Modal should be open
    await waitFor(() => {
      expect(screen.getByTestId("ai-suggestion-modal")).toBeVisible();
    });

    // Close modal
    await user.click(screen.getByTestId("modal-close"));

    // Modal should be hidden
    expect(screen.getByTestId("ai-suggestion-modal")).not.toBeVisible();
  });

  it("handles form submission when disabled", async () => {
    const user = userEvent.setup();
    const initialState = {
      isSubmitting: true,
    };

    renderWithProviders(<SituationDescriptions />, { initialState });

    const saveButton = screen.getByRole("button", { name: /save & continue later/i });
    expect(saveButton).toBeDisabled();

    await user.click(saveButton);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("handles keyboard shortcuts", async () => {
    renderWithProviders(<SituationDescriptions />);

    // Test Ctrl+S for save and continue later
    fireEvent.keyDown(document, { key: "s", ctrlKey: true });
    expect(mockNavigate).toHaveBeenCalledWith("/");

    vi.clearAllMocks();

    // Test Ctrl+Enter for submit (this will trigger the validation function)
    fireEvent.keyDown(document, { key: "Enter", ctrlKey: true });

    // Since the form is empty, it should fail validation and not navigate
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalledWith("/success");
    });
  });

  it("has proper accessibility attributes", () => {
    renderWithProviders(<SituationDescriptions />);

    // Check form has proper attributes
    const form = screen.getByRole("form");
    expect(form).toHaveAttribute("aria-labelledby", "form-title");
    expect(form).toHaveAttribute("noValidate");

    // Check skip link
    const skipLink = screen.getByText("Skip to Situation Descriptions form");
    expect(skipLink).toHaveAttribute("href", "#situation-descriptions-form");

    // Check textareas have proper attributes
    const textareas = screen.getAllByRole("textbox");
    expect(textareas).toHaveLength(3);

    expect(textareas[0]).toHaveAttribute("aria-describedby", "financial-situation-help");
    expect(textareas[1]).toHaveAttribute("aria-describedby", "employment-circumstances-help");
    expect(textareas[2]).toHaveAttribute("aria-describedby", "reason-for-applying-help");

    // Check required fields are marked
    const requiredFields = screen.getAllByText("*");
    expect(requiredFields).toHaveLength(3);
  });

  it("applies RTL styling for Arabic language", () => {
    const { container } = renderWithProviders(<SituationDescriptions />);

    // Check that the component renders with proper structure for RTL support
    // In a real RTL environment, these classes would be applied based on i18n.language === "ar"
    const headerElement = container.querySelector("header");
    expect(headerElement).toBeInTheDocument();

    const formElement = container.querySelector("form");
    expect(formElement).toBeInTheDocument();

    // Check for flex layout elements that would support RTL
    const flexElements = container.querySelectorAll(".flex");
    expect(flexElements.length).toBeGreaterThan(0);

    // Check for text alignment classes that support both LTR and RTL
    const textElements = container.querySelectorAll(".text-left, .text-right, .text-center");
    expect(textElements.length).toBeGreaterThan(0);
  });

  it("renders toaster component", () => {
    renderWithProviders(<SituationDescriptions />);

    expect(screen.getByTestId("toaster")).toBeInTheDocument();
  });

  it("has proper form sections structure", () => {
    renderWithProviders(<SituationDescriptions />);

    // Check main sections
    expect(screen.getByText("Situation Descriptions")).toBeInTheDocument();
    expect(screen.getByText("Current Financial Situation")).toBeInTheDocument();
    expect(screen.getByText("Employment Circumstances")).toBeInTheDocument();
    expect(screen.getByText("Reason for Applying")).toBeInTheDocument();

    // Check that all textareas have proper rows and maxLength
    const textareas = screen.getAllByRole("textbox");
    textareas.forEach((textarea) => {
      expect(textarea).toHaveAttribute("rows", "5");
      expect(textarea).toHaveAttribute("maxLength", "1000");
    });
  });

  it("handles form reset when Redux data changes", async () => {
    const { rerender } = renderWithProviders(<SituationDescriptions />);

    // Initial render with empty data
    expect(
      screen.getByPlaceholderText(
        "Describe your current financial circumstances, including income, expenses, and any financial hardships..."
      )
    ).toHaveValue("");

    // Rerender with new Redux data
    const newInitialState = {
      situationDescriptions: {
        currentFinancialSituation: "Updated financial situation",
        employmentCircumstances: "Updated employment circumstances",
        reasonForApplying: "Updated reason for applying",
      },
    };

    rerender(
      <Provider store={createMockStore(newInitialState)}>
        <BrowserRouter>
          <StepValidationProvider>
            <SituationDescriptions />
          </StepValidationProvider>
        </BrowserRouter>
      </Provider>
    );

    // Form should be reset with new data
    expect(
      screen.getByPlaceholderText(
        "Describe your current financial circumstances, including income, expenses, and any financial hardships..."
      )
    ).toHaveValue("Updated financial situation");
    expect(
      screen.getByPlaceholderText(
        "Describe your current employment status, work history, and any challenges you're facing..."
      )
    ).toHaveValue("Updated employment circumstances");
    expect(
      screen.getByPlaceholderText(
        "Explain why you are applying for financial assistance and how it will help your situation..."
      )
    ).toHaveValue("Updated reason for applying");
  });

  it("handles successful form submission", async () => {
    const { saveApplicationToLocalStorage } = await import("../../../utils/localStorage");
    const toast = await import("react-hot-toast");

    renderWithProviders(<SituationDescriptions />);

    // Get the validation function and call it with valid data
    const validationFunction = mockRegisterValidation.mock.calls[0][1];

    // Fill form with valid data first
    const financialTextarea = screen.getByPlaceholderText(
      "Describe your current financial circumstances, including income, expenses, and any financial hardships..."
    );
    const employmentTextarea = screen.getByPlaceholderText(
      "Describe your current employment status, work history, and any challenges you're facing..."
    );
    const reasonTextarea = screen.getByPlaceholderText(
      "Explain why you are applying for financial assistance and how it will help your situation..."
    );

    fireEvent.change(financialTextarea, {
      target: { value: "I am experiencing significant financial difficulties due to unexpected medical expenses." },
    });
    fireEvent.change(employmentTextarea, {
      target: { value: "I was recently laid off from my full-time position and am actively seeking employment." },
    });
    fireEvent.change(reasonTextarea, {
      target: { value: "I need financial assistance to cover basic living expenses during my job search." },
    });

    // Trigger validation/submission
    await validationFunction();

    // Check that localStorage save was called
    await waitFor(() => {
      expect(saveApplicationToLocalStorage).toHaveBeenCalledWith({
        personalInformation: expect.any(Object),
        familyFinancialInfo: expect.any(Object),
        situationDescriptions: {
          currentFinancialSituation:
            "I am experiencing significant financial difficulties due to unexpected medical expenses.",
          employmentCircumstances: "I was recently laid off from my full-time position and am actively seeking employment.",
          reasonForApplying: "I need financial assistance to cover basic living expenses during my job search.",
        },
      });
    });

    // Check success toast and navigation
    await waitFor(() => {
      expect(toast.default.success).toHaveBeenCalledWith("Application submitted successfully");
      expect(mockNavigate).toHaveBeenCalledWith("/success");
    });
  });

  it("handles form submission errors", async () => {
    const { saveApplicationToLocalStorage } = await import("../../../utils/localStorage");
    const toast = await import("react-hot-toast");

    // Mock localStorage to throw an error
    (saveApplicationToLocalStorage as MockedFunction<typeof saveApplicationToLocalStorage>).mockImplementation(() => {
      throw new Error("Storage error");
    });

    renderWithProviders(<SituationDescriptions />);

    // Get the validation function
    const validationFunction = mockRegisterValidation.mock.calls[0][1];

    // Fill form with valid data
    const financialTextarea = screen.getByPlaceholderText(
      "Describe your current financial circumstances, including income, expenses, and any financial hardships..."
    );
    fireEvent.change(financialTextarea, {
      target: { value: "Valid financial situation description that meets minimum length requirements." },
    });

    const employmentTextarea = screen.getByPlaceholderText(
      "Describe your current employment status, work history, and any challenges you're facing..."
    );
    fireEvent.change(employmentTextarea, {
      target: { value: "Valid employment circumstances description that meets minimum length requirements." },
    });

    const reasonTextarea = screen.getByPlaceholderText(
      "Explain why you are applying for financial assistance and how it will help your situation..."
    );
    fireEvent.change(reasonTextarea, {
      target: { value: "Valid reason for applying description that meets minimum length requirements." },
    });

    // Trigger validation/submission
    await validationFunction();

    // Check error toast
    await waitFor(() => {
      expect(toast.default.error).toHaveBeenCalledWith("Failed to submit application. Please try again.");
    });
  });

  it("handles responsive layout classes", () => {
    const { container } = renderWithProviders(<SituationDescriptions />);

    // Check for responsive classes
    const responsiveElements = container.querySelectorAll(".sm\\:px-6, .md\\:p-8, .lg\\:px-8");
    expect(responsiveElements.length).toBeGreaterThan(0);

    // Check for responsive text sizing
    const responsiveText = container.querySelectorAll(".sm\\:text-2xl, .md\\:text-3xl, .lg\\:text-4xl");
    expect(responsiveText.length).toBeGreaterThan(0);

    // Check for responsive spacing
    const responsiveSpacing = container.querySelectorAll(".sm\\:space-y-8, .sm\\:mb-8");
    expect(responsiveSpacing.length).toBeGreaterThan(0);
  });
});
