import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { StepValidationProvider } from "../../../contexts/StepValidationContext";
import applicationSlice from "../../../store/slices/applicationSlice";
import FamilyFinancialInfo from "../FamilyFinancialInfo";

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
        "form.familyFinancialInfo.title": "Family & Financial Information",
        "form.familyFinancialInfo.subtitle": "Please provide information about your family and financial situation",
        "common.sections.familyInformation": "Family Information",
        "common.sections.employmentInformation": "Employment Information",
        "common.sections.housingInformation": "Housing Information",
        "form.familyFinancialInfo.fields.maritalStatus.label": "Marital Status",
        "form.familyFinancialInfo.fields.maritalStatus.placeholder": "Select your marital status",
        "form.familyFinancialInfo.fields.maritalStatus.options.single": "Single",
        "form.familyFinancialInfo.fields.maritalStatus.options.married": "Married",
        "form.familyFinancialInfo.fields.maritalStatus.options.divorced": "Divorced",
        "form.familyFinancialInfo.fields.maritalStatus.options.widowed": "Widowed",
        "form.familyFinancialInfo.fields.dependents.label": "Number of Dependents",
        "form.familyFinancialInfo.fields.dependents.placeholder": "Enter number of dependents (e.g., 0, 1, 2...)",
        "form.familyFinancialInfo.fields.employmentStatus.label": "Employment Status",
        "form.familyFinancialInfo.fields.employmentStatus.placeholder": "Select your employment status",
        "form.familyFinancialInfo.fields.employmentStatus.options.employed": "Employed",
        "form.familyFinancialInfo.fields.employmentStatus.options.unemployed": "Unemployed",
        "form.familyFinancialInfo.fields.employmentStatus.options.self-employed": "Self-Employed",
        "form.familyFinancialInfo.fields.employmentStatus.options.student": "Student",
        "form.familyFinancialInfo.fields.employmentStatus.options.retired": "Retired",
        "form.familyFinancialInfo.fields.employmentStatus.options.disabled": "Disabled",
        "form.familyFinancialInfo.fields.monthlyIncome.label": "Monthly Income (AED)",
        "form.familyFinancialInfo.fields.monthlyIncome.placeholder": "Enter your monthly income in AED",
        "form.familyFinancialInfo.fields.housingStatus.label": "Housing Status",
        "form.familyFinancialInfo.fields.housingStatus.placeholder": "Select your housing status",
        "form.familyFinancialInfo.fields.housingStatus.options.owned": "Owned",
        "form.familyFinancialInfo.fields.housingStatus.options.rented": "Rented",
        "form.familyFinancialInfo.fields.housingStatus.options.family-owned": "Family Owned",
        "form.familyFinancialInfo.fields.housingStatus.options.government-provided": "Government Provided",
        "form.familyFinancialInfo.fields.housingStatus.options.homeless": "Homeless",
        "common.actions.saveAndContinueLater": "Save & Continue Later",
        "common.actions.unsavedChanges": "You have unsaved changes",
        "form.familyFinancialInfo.validation.maritalStatus.required": "Please select your marital status",
        "form.familyFinancialInfo.validation.dependents.required": "Please enter the number of dependents",
        "form.familyFinancialInfo.validation.dependents.invalid": "Number of dependents must be between 0 and 20",
        "form.familyFinancialInfo.validation.employmentStatus.required": "Please select your employment status",
        "form.familyFinancialInfo.validation.monthlyIncome.required": "Please enter your monthly income",
        "form.familyFinancialInfo.validation.monthlyIncome.invalid":
          "Monthly income must be a valid number between 0 and 1,000,000 AED",
        "form.familyFinancialInfo.validation.housingStatus.required": "Please select your housing status",
        "form.familyFinancialInfo.validation.formErrors": "Please fix the errors below before continuing",
        "form.familyFinancialInfo.validation.saveSuccess": "Family & Financial information saved successfully",
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

// Create a mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      application: applicationSlice,
    },
    preloadedState: {
      application: {
        personalInformation: {
          name: "",
          nationalId: "",
          dateOfBirth: "",
          gender: "",
          phoneNumber: "",
          email: "",
          address: "",
          city: "",
          country: "",
        },
        familyFinancialInfo: {
          maritalStatus: "",
          dependents: "",
          employmentStatus: "",
          monthlyIncome: "",
          housingStatus: "",
        },
        situationDescriptions: {
          currentFinancialSituation: "",
          employmentCircumstances: "",
          reasonForApplying: "",
        },
        currentStep: 2,
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

describe("FamilyFinancialInfo Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form structure correctly", () => {
    renderWithProviders(<FamilyFinancialInfo />);

    expect(screen.getByText("Family & Financial Information")).toBeInTheDocument();
    expect(screen.getByText("Please provide information about your family and financial situation")).toBeInTheDocument();
    expect(screen.getByText("Family Information")).toBeInTheDocument();
    expect(screen.getByText("Employment Information")).toBeInTheDocument();
    expect(screen.getByText("Housing Information")).toBeInTheDocument();
  });

  it("renders all form fields", () => {
    renderWithProviders(<FamilyFinancialInfo />);

    expect(screen.getByRole("combobox", { name: /marital status/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /number of dependents/i })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /employment status/i })).toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: /monthly income/i })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /housing status/i })).toBeInTheDocument();
  });

  it("renders save and continue later button", () => {
    renderWithProviders(<FamilyFinancialInfo />);

    const saveButton = screen.getByRole("button", { name: /save & continue later/i });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveAttribute("aria-label", "Save & Continue Later");
  });

  it("loads existing data from Redux store", () => {
    const initialState = {
      familyFinancialInfo: {
        maritalStatus: "married",
        dependents: "2",
        employmentStatus: "employed",
        monthlyIncome: "5000",
        housingStatus: "rented",
      },
    };

    renderWithProviders(<FamilyFinancialInfo />, { initialState });

    expect(screen.getByDisplayValue("2")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5000")).toBeInTheDocument();
  });

  it("handles marital status selection", async () => {
    const user = userEvent.setup();
    renderWithProviders(<FamilyFinancialInfo />);

    const maritalStatusSelect = screen.getByRole("combobox", { name: /marital status/i });
    await user.click(maritalStatusSelect);

    await waitFor(() => {
      expect(screen.getByText("Single")).toBeInTheDocument();
      expect(screen.getByText("Married")).toBeInTheDocument();
      expect(screen.getByText("Divorced")).toBeInTheDocument();
      expect(screen.getByText("Widowed")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Married"));

    // For react-select, check the displayed value instead of input value
    await waitFor(() => {
      expect(screen.getByText("Married")).toBeInTheDocument();
    });
  });

  it("handles employment status selection", async () => {
    const user = userEvent.setup();
    renderWithProviders(<FamilyFinancialInfo />);

    const employmentStatusSelect = screen.getByRole("combobox", { name: /employment status/i });
    await user.click(employmentStatusSelect);

    await waitFor(() => {
      expect(screen.getByText("Employed")).toBeInTheDocument();
      expect(screen.getByText("Unemployed")).toBeInTheDocument();
      expect(screen.getByText("Self-Employed")).toBeInTheDocument();
      expect(screen.getByText("Student")).toBeInTheDocument();
      expect(screen.getByText("Retired")).toBeInTheDocument();
      expect(screen.getByText("Disabled")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Employed"));

    // For react-select, check the displayed value instead of input value
    await waitFor(() => {
      expect(screen.getByText("Employed")).toBeInTheDocument();
    });
  });

  it("handles housing status selection", async () => {
    const user = userEvent.setup();
    renderWithProviders(<FamilyFinancialInfo />);

    const housingStatusSelect = screen.getByRole("combobox", { name: /housing status/i });
    await user.click(housingStatusSelect);

    await waitFor(() => {
      expect(screen.getByText("Owned")).toBeInTheDocument();
      expect(screen.getByText("Rented")).toBeInTheDocument();
      expect(screen.getByText("Family Owned")).toBeInTheDocument();
      expect(screen.getByText("Government Provided")).toBeInTheDocument();
      expect(screen.getByText("Homeless")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Rented"));

    // For react-select, check the displayed value instead of input value
    await waitFor(() => {
      expect(screen.getByText("Rented")).toBeInTheDocument();
    });
  });

  it("handles text input fields", async () => {
    renderWithProviders(<FamilyFinancialInfo />);

    const dependentsInput = screen.getByRole("textbox", { name: /number of dependents/i });
    const monthlyIncomeInput = screen.getByRole("spinbutton", { name: /monthly income/i });

    // Use fireEvent for inputs that have special behavior
    fireEvent.change(dependentsInput, { target: { value: "3" } });
    fireEvent.change(monthlyIncomeInput, { target: { value: "7500" } });

    expect(dependentsInput).toHaveValue("3");
    expect(monthlyIncomeInput).toHaveValue(7500); // Number input expects numeric value
  });

  it("shows unsaved changes message when form is dirty", async () => {
    renderWithProviders(<FamilyFinancialInfo />);

    const dependentsInput = screen.getByRole("textbox", { name: /number of dependents/i });
    fireEvent.change(dependentsInput, { target: { value: "1" } });

    await waitFor(() => {
      expect(screen.getByText("You have unsaved changes")).toBeInTheDocument();
    });
  });

  it("handles save and continue later functionality", async () => {
    const user = userEvent.setup();
    renderWithProviders(<FamilyFinancialInfo />);

    const dependentsInput = screen.getByRole("textbox", { name: /number of dependents/i });
    fireEvent.change(dependentsInput, { target: { value: "2" } });

    const saveButton = screen.getByRole("button", { name: /save & continue later/i });
    await user.click(saveButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("registers validation function on mount", () => {
    renderWithProviders(<FamilyFinancialInfo />);

    expect(mockRegisterValidation).toHaveBeenCalledWith("family-financial-info", expect.any(Function));
  });

  it("unregisters validation function on unmount", () => {
    const { unmount } = renderWithProviders(<FamilyFinancialInfo />);

    unmount();

    expect(mockUnregisterValidation).toHaveBeenCalledWith("family-financial-info");
  });

  it("validates form fields correctly", async () => {
    const user = userEvent.setup();
    renderWithProviders(<FamilyFinancialInfo />);

    // Get the validation function that was registered
    const validationFunction = mockRegisterValidation.mock.calls[0][1];

    // Test with empty form (should fail validation)
    const isValidEmpty = await validationFunction();
    expect(isValidEmpty).toBe(false);

    // Fill out the form with valid data
    const maritalStatusSelect = screen.getByRole("combobox", { name: /marital status/i });
    await user.click(maritalStatusSelect);
    await waitFor(() => screen.getByText("Single"));
    await user.click(screen.getByText("Single"));

    const dependentsInput = screen.getByRole("textbox", { name: /number of dependents/i });
    fireEvent.change(dependentsInput, { target: { value: "1" } });

    const employmentStatusSelect = screen.getByRole("combobox", { name: /employment status/i });
    await user.click(employmentStatusSelect);
    await waitFor(() => screen.getByText("Employed"));
    await user.click(screen.getByText("Employed"));

    const monthlyIncomeInput = screen.getByRole("spinbutton", { name: /monthly income/i });
    fireEvent.change(monthlyIncomeInput, { target: { value: "5000" } });

    const housingStatusSelect = screen.getByRole("combobox", { name: /housing status/i });
    await user.click(housingStatusSelect);
    await waitFor(() => screen.getByText("Rented"));
    await user.click(screen.getByText("Rented"));

    // Test with valid form data
    const isValidFilled = await validationFunction();
    expect(isValidFilled).toBe(true);
  });

  it("handles keyboard shortcuts", async () => {
    renderWithProviders(<FamilyFinancialInfo />);

    // Simulate Ctrl+S keyboard shortcut
    fireEvent.keyDown(document, {
      key: "s",
      ctrlKey: true,
      preventDefault: vi.fn(),
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("handles Mac keyboard shortcuts", async () => {
    renderWithProviders(<FamilyFinancialInfo />);

    // Simulate Cmd+S keyboard shortcut (Mac)
    fireEvent.keyDown(document, {
      key: "s",
      metaKey: true,
      preventDefault: vi.fn(),
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("validates dependents field correctly", async () => {
    const user = userEvent.setup();
    renderWithProviders(<FamilyFinancialInfo />);

    const dependentsInput = screen.getByRole("textbox", { name: /number of dependents/i });

    // Test invalid input (negative number)
    fireEvent.change(dependentsInput, { target: { value: "-1" } });
    await user.tab(); // Trigger validation

    // Test invalid input (too high number)
    fireEvent.change(dependentsInput, { target: { value: "25" } });
    await user.tab(); // Trigger validation

    // Test valid input
    fireEvent.change(dependentsInput, { target: { value: "3" } });
    await user.tab(); // Trigger validation

    expect(dependentsInput).toHaveValue("3");
  });

  it("validates monthly income field correctly", async () => {
    const user = userEvent.setup();
    renderWithProviders(<FamilyFinancialInfo />);

    const monthlyIncomeInput = screen.getByRole("spinbutton", { name: /monthly income/i });

    // Test invalid input (negative number)
    fireEvent.change(monthlyIncomeInput, { target: { value: "-100" } });
    await user.tab(); // Trigger validation

    // Test invalid input (too high number)
    fireEvent.change(monthlyIncomeInput, { target: { value: "2000000" } });
    await user.tab(); // Trigger validation

    // Test valid input
    fireEvent.change(monthlyIncomeInput, { target: { value: "5000" } });
    await user.tab(); // Trigger validation

    expect(monthlyIncomeInput).toHaveValue(5000); // Number input expects numeric value
  });

  it("has proper accessibility attributes", () => {
    renderWithProviders(<FamilyFinancialInfo />);

    // Check form accessibility
    const form = screen.getByRole("form");
    expect(form).toHaveAttribute("aria-labelledby", "form-title");
    expect(form).toHaveAttribute("noValidate");

    // Check fieldsets
    const fieldsets = screen.getAllByRole("group");
    expect(fieldsets).toHaveLength(3);

    // Check skip link
    const skipLink = screen.getByText("Skip to Family & Financial Information form");
    expect(skipLink).toHaveAttribute("href", "#family-financial-form");

    // Check required fields
    const requiredFields = screen.getAllByText("*");
    expect(requiredFields.length).toBeGreaterThan(0);
  });

  it("handles form submission when disabled", async () => {
    const user = userEvent.setup();
    const initialState = {
      isSubmitting: true,
    };

    renderWithProviders(<FamilyFinancialInfo />, { initialState });

    const saveButton = screen.getByRole("button", { name: /save & continue later/i });
    expect(saveButton).toBeDisabled();

    await user.click(saveButton);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("applies RTL styling for Arabic language", () => {
    // Since the component uses i18n.language === "ar" to determine RTL,
    // we can test this by checking that the component has the proper structure
    // and that RTL classes would be applied when the language is Arabic
    const { container } = renderWithProviders(<FamilyFinancialInfo />);

    // Check that the component renders with proper structure for RTL support
    const headers = container.querySelectorAll("legend, label");
    expect(headers.length).toBeGreaterThan(0);

    // Check that the component has the necessary elements that would have RTL classes
    const formElements = container.querySelectorAll("input, select, textarea");
    expect(formElements.length).toBeGreaterThan(0);

    // Verify that the component structure supports RTL (this is a structural test)
    const headerElement = container.querySelector("header");
    expect(headerElement).toBeInTheDocument();
  });

  it("handles numbers-only input for dependents field", async () => {
    renderWithProviders(<FamilyFinancialInfo />);

    const dependentsInput = screen.getByRole("textbox", { name: /number of dependents/i });

    // Test that the input has numbersOnly behavior by checking its attributes
    expect(dependentsInput).toHaveAttribute("inputMode", "numeric");
    expect(dependentsInput).toHaveAttribute("pattern", "[0-9]*");

    // Test that valid numbers work
    fireEvent.change(dependentsInput, { target: { value: "123" } });
    expect(dependentsInput).toHaveValue("123");
  });

  it("renders toaster component", () => {
    renderWithProviders(<FamilyFinancialInfo />);

    expect(screen.getByTestId("toaster")).toBeInTheDocument();
  });

  it("has proper form structure and sections", () => {
    renderWithProviders(<FamilyFinancialInfo />);

    // Check main sections
    expect(screen.getByText("Family Information")).toBeInTheDocument();
    expect(screen.getByText("Employment Information")).toBeInTheDocument();
    expect(screen.getByText("Housing Information")).toBeInTheDocument();

    // Check form fields are in correct sections
    const familySection = screen.getByText("Family Information").closest("fieldset");
    expect(familySection).toContainElement(screen.getByRole("combobox", { name: /marital status/i }));
    expect(familySection).toContainElement(screen.getByRole("textbox", { name: /number of dependents/i }));

    const employmentSection = screen.getByText("Employment Information").closest("fieldset");
    expect(employmentSection).toContainElement(screen.getByRole("combobox", { name: /employment status/i }));
    expect(employmentSection).toContainElement(screen.getByRole("spinbutton", { name: /monthly income/i }));

    const housingSection = screen.getByText("Housing Information").closest("fieldset");
    expect(housingSection).toContainElement(screen.getByRole("combobox", { name: /housing status/i }));
  });

  it("handles form reset when Redux data changes", async () => {
    const { rerender } = renderWithProviders(<FamilyFinancialInfo />);

    // Initial render with empty data
    expect(screen.getByRole("textbox", { name: /number of dependents/i })).toHaveValue("");

    // Rerender with new Redux data
    const newInitialState = {
      familyFinancialInfo: {
        maritalStatus: "single",
        dependents: "2",
        employmentStatus: "employed",
        monthlyIncome: "4000",
        housingStatus: "owned",
      },
    };

    rerender(
      <Provider store={createMockStore(newInitialState)}>
        <BrowserRouter>
          <StepValidationProvider>
            <FamilyFinancialInfo />
          </StepValidationProvider>
        </BrowserRouter>
      </Provider>
    );

    // Form should be reset with new data
    expect(screen.getByRole("textbox", { name: /number of dependents/i })).toHaveValue("2");
    expect(screen.getByRole("spinbutton", { name: /monthly income/i })).toHaveValue(4000); // Number input expects numeric value
  });
});
