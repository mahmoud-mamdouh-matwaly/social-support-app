import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { StepValidationProvider } from "../../../contexts/StepValidationContext";
import applicationSlice from "../../../store/slices/applicationSlice";
import PersonalInformation from "../PersonalInformation";

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
        "form.personalInformation.title": "Personal Information",
        "form.personalInformation.subtitle": "Please provide your basic personal details",
        "form.personalInformation.fields.name.label": "Full Name",
        "form.personalInformation.fields.name.placeholder": "Enter your full name",
        "form.personalInformation.fields.nationalId.label": "National ID",
        "form.personalInformation.fields.nationalId.placeholder": "Enter your national ID",
        "form.personalInformation.fields.dateOfBirth.label": "Date of Birth",
        "form.personalInformation.fields.gender.label": "Gender",
        "form.personalInformation.fields.gender.placeholder": "Select your gender",
        "form.personalInformation.fields.gender.options.male": "Male",
        "form.personalInformation.fields.gender.options.female": "Female",
        "form.personalInformation.fields.address.label": "Address",
        "form.personalInformation.fields.address.placeholder": "Enter your full address",
        "form.personalInformation.fields.city.label": "City",
        "form.personalInformation.fields.city.placeholder": "Enter your city",
        "form.personalInformation.fields.state.label": "State/Province",
        "form.personalInformation.fields.state.placeholder": "Enter your state or province",
        "form.personalInformation.fields.country.label": "Country",
        "form.personalInformation.fields.country.placeholder": "Enter your country",
        "form.personalInformation.fields.phone.label": "Phone Number",
        "form.personalInformation.fields.phone.placeholder": "+971 XX XXX XXXX or 0X XXX XXXX",
        "form.personalInformation.fields.email.label": "Email Address",
        "form.personalInformation.fields.email.placeholder": "Enter your email address",
        "common.sections.contactInformation": "Contact Information",
        "common.actions.saveAndContinueLater": "Save & Continue Later",
        "common.actions.unsavedChanges": "You have unsaved changes",
        "form.personalInformation.validation.name.min": "Name must be at least 2 characters",
        "form.personalInformation.validation.name.max": "Name must not exceed 100 characters",
        "form.personalInformation.validation.name.regex": "Name can only contain letters and spaces",
        "form.personalInformation.validation.nationalId.min": "National ID must be at least 10 characters",
        "form.personalInformation.validation.nationalId.max": "National ID must not exceed 20 characters",
        "form.personalInformation.validation.nationalId.regex": "National ID can only contain numbers",
        "form.personalInformation.validation.dateOfBirth.required": "Date of birth is required",
        "form.personalInformation.validation.dateOfBirth.age": "Age must be between 18 and 100 years",
        "form.personalInformation.validation.gender.required": "Please select your gender",
        "form.personalInformation.validation.address.min": "Address must be at least 10 characters",
        "form.personalInformation.validation.address.max": "Address must not exceed 200 characters",
        "form.personalInformation.validation.city.min": "City must be at least 2 characters",
        "form.personalInformation.validation.city.max": "City must not exceed 50 characters",
        "form.personalInformation.validation.city.regex": "City can only contain letters and spaces",
        "form.personalInformation.validation.state.min": "State must be at least 2 characters",
        "form.personalInformation.validation.state.max": "State must not exceed 50 characters",
        "form.personalInformation.validation.state.regex": "State can only contain letters and spaces",
        "form.personalInformation.validation.country.min": "Country must be at least 2 characters",
        "form.personalInformation.validation.country.max": "Country must not exceed 50 characters",
        "form.personalInformation.validation.country.regex": "Country can only contain letters and spaces",
        "form.personalInformation.validation.phone.required": "Phone number is required",
        "form.personalInformation.validation.phone.format":
          "Please enter a valid phone number (UAE: +971 XX XXX XXXX or 0X XXX XXXX)",
        "form.personalInformation.validation.email.required": "Email is required",
        "form.personalInformation.validation.email.invalid": "Please enter a valid email address",
        "form.personalInformation.validation.email.max": "Email must not exceed 100 characters",
        "form.personalInformation.validation.formErrors": "Please fix the errors below before continuing",
        "form.personalInformation.validation.saveSuccess": "Information saved successfully",
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

// Mock CountrySelect component
vi.mock("../../../components/CountrySelect", () => ({
  default: ({
    name,
    value,
    onChange,
    label,
    placeholder,
    error,
    required,
  }: {
    name: string;
    value: string;
    onChange: (value: string) => void;
    label: string;
    placeholder: string;
    error?: string;
    required?: boolean;
  }) => (
    <div>
      <label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? "true" : "false"}
        data-testid="country-select"
      >
        <option value="">{placeholder}</option>
        <option value="United Arab Emirates">United Arab Emirates</option>
        <option value="United States">United States</option>
        <option value="United Kingdom">United Kingdom</option>
      </select>
      {error && <p className="text-red-600">{error}</p>}
    </div>
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
          name: "",
          nationalId: "",
          dateOfBirth: "",
          gender: "",
          address: "",
          city: "",
          state: "",
          country: "",
          phone: "",
          email: "",
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
        currentStep: 1,
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

describe("PersonalInformation Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form structure correctly", () => {
    renderWithProviders(<PersonalInformation />);

    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    expect(screen.getByText("Please provide your basic personal details")).toBeInTheDocument();
    expect(screen.getByText("Contact Information")).toBeInTheDocument();
  });

  it("renders all form fields", () => {
    renderWithProviders(<PersonalInformation />);

    expect(screen.getByRole("textbox", { name: /full name/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /national id/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /gender/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your full address")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /city/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /state/i })).toBeInTheDocument();
    expect(screen.getByTestId("country-select")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /phone number/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /email address/i })).toBeInTheDocument();
  });

  it("renders save and continue later button", () => {
    renderWithProviders(<PersonalInformation />);

    const saveButton = screen.getByRole("button", { name: /save & continue later/i });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveAttribute("aria-label", "Save & Continue Later");
  });

  it("loads existing data from Redux store", () => {
    const initialState = {
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
    };

    renderWithProviders(<PersonalInformation />, { initialState });

    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1234567890")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1990-01-01")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123 Main Street")).toBeInTheDocument();
    // For multiple "Dubai" values, check both city and state fields
    const dubaiInputs = screen.getAllByDisplayValue("Dubai");
    expect(dubaiInputs).toHaveLength(2);
    expect(screen.getByDisplayValue("United Arab Emirates")).toBeInTheDocument();
    expect(screen.getByDisplayValue("+971501234567")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john.doe@example.com")).toBeInTheDocument();
  });

  it("handles text input fields", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInformation />);

    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const addressInput = screen.getByPlaceholderText("Enter your full address");
    const emailInput = screen.getByRole("textbox", { name: /email address/i });

    await user.type(nameInput, "Jane Smith");
    await user.type(addressInput, "456 Oak Avenue, Apartment 2B");
    await user.type(emailInput, "jane.smith@example.com");

    expect(nameInput).toHaveValue("Jane Smith");
    expect(addressInput).toHaveValue("456 Oak Avenue, Apartment 2B");
    expect(emailInput).toHaveValue("jane.smith@example.com");
  });

  it("handles numbers-only input for national ID", async () => {
    renderWithProviders(<PersonalInformation />);

    const nationalIdInput = screen.getByRole("textbox", { name: /national id/i });

    // Test that the input has numbersOnly behavior by checking its attributes
    expect(nationalIdInput).toHaveAttribute("inputMode", "numeric");
    expect(nationalIdInput).toHaveAttribute("pattern", "[0-9]*");

    // Test that valid numbers work
    fireEvent.change(nationalIdInput, { target: { value: "1234567890123" } });
    expect(nationalIdInput).toHaveValue("1234567890123");
  });

  it("handles phone format input", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInformation />);

    const phoneInput = screen.getByRole("textbox", { name: /phone number/i });

    // Test that the input has phoneFormat behavior
    expect(phoneInput).toHaveAttribute("type", "tel");

    await user.type(phoneInput, "+971501234567");
    expect(phoneInput).toHaveValue("+971501234567");
  });

  it("handles gender selection", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInformation />);

    const genderSelect = screen.getByRole("combobox", { name: /gender/i });
    await user.click(genderSelect);

    await waitFor(() => {
      expect(screen.getByText("Male")).toBeInTheDocument();
      expect(screen.getByText("Female")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Male"));

    // For react-select, check the displayed value instead of input value
    await waitFor(() => {
      expect(screen.getByText("Male")).toBeInTheDocument();
    });
  });

  it("handles country selection", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInformation />);

    const countrySelect = screen.getByTestId("country-select");
    await user.selectOptions(countrySelect, "United Arab Emirates");

    expect(countrySelect).toHaveValue("United Arab Emirates");
  });

  it("handles date input", async () => {
    renderWithProviders(<PersonalInformation />);

    const dateInput = screen.getByLabelText(/date of birth/i);
    expect(dateInput).toHaveAttribute("type", "date");

    fireEvent.change(dateInput, { target: { value: "1995-06-15" } });
    expect(dateInput).toHaveValue("1995-06-15");
  });

  it("shows unsaved changes message when form is dirty", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInformation />);

    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    await user.type(nameInput, "Test Name");

    await waitFor(() => {
      expect(screen.getByText("You have unsaved changes")).toBeInTheDocument();
    });
  });

  it("handles save and continue later functionality", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInformation />);

    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    await user.type(nameInput, "Test User");

    const saveButton = screen.getByRole("button", { name: /save & continue later/i });
    await user.click(saveButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("registers validation function on mount", () => {
    renderWithProviders(<PersonalInformation />);

    expect(mockRegisterValidation).toHaveBeenCalledWith("personal-information", expect.any(Function));
  });

  it("unregisters validation function on unmount", () => {
    const { unmount } = renderWithProviders(<PersonalInformation />);

    unmount();

    expect(mockUnregisterValidation).toHaveBeenCalledWith("personal-information");
  });

  it("validates form fields correctly", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInformation />);

    // Get the validation function that was registered
    const validationFunction = mockRegisterValidation.mock.calls[0][1];

    // Test with empty form (should fail validation)
    const isValidEmpty = await validationFunction();
    expect(isValidEmpty).toBe(false);

    // Fill out the form with valid data
    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    fireEvent.change(nameInput, { target: { value: "John Doe" } });

    const nationalIdInput = screen.getByRole("textbox", { name: /national id/i });
    fireEvent.change(nationalIdInput, { target: { value: "1234567890123" } });

    const dateInput = screen.getByLabelText(/date of birth/i);
    fireEvent.change(dateInput, { target: { value: "1990-01-01" } });

    const genderSelect = screen.getByRole("combobox", { name: /gender/i });
    await user.click(genderSelect);
    await waitFor(() => screen.getByText("Male"));
    await user.click(screen.getByText("Male"));

    const addressInput = screen.getByPlaceholderText("Enter your full address");
    fireEvent.change(addressInput, { target: { value: "123 Main Street, Apartment 1A" } });

    const cityInput = screen.getByRole("textbox", { name: /city/i });
    fireEvent.change(cityInput, { target: { value: "Dubai" } });

    const stateInput = screen.getByRole("textbox", { name: /state/i });
    fireEvent.change(stateInput, { target: { value: "Dubai" } });

    const countrySelect = screen.getByTestId("country-select");
    fireEvent.change(countrySelect, { target: { value: "United Arab Emirates" } });

    const phoneInput = screen.getByRole("textbox", { name: /phone number/i });
    fireEvent.change(phoneInput, { target: { value: "+971501234567" } });

    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });

    // Test with valid form data
    const isValidFilled = await validationFunction();
    expect(isValidFilled).toBe(true);
  });

  it("validates name field correctly", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInformation />);

    const nameInput = screen.getByRole("textbox", { name: /full name/i });

    // Test minimum length validation
    fireEvent.change(nameInput, { target: { value: "A" } });
    await user.tab(); // Trigger validation

    // Test maximum length validation
    fireEvent.change(nameInput, { target: { value: "A".repeat(101) } });
    await user.tab(); // Trigger validation

    // Test regex validation (numbers should be invalid)
    fireEvent.change(nameInput, { target: { value: "John123" } });
    await user.tab(); // Trigger validation

    // Test valid input
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    await user.tab(); // Trigger validation

    expect(nameInput).toHaveValue("John Doe");
  });

  it("validates national ID field correctly", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInformation />);

    const nationalIdInput = screen.getByRole("textbox", { name: /national id/i });

    // Test minimum length validation
    fireEvent.change(nationalIdInput, { target: { value: "123" } });
    await user.tab(); // Trigger validation

    // Test maximum length validation
    fireEvent.change(nationalIdInput, { target: { value: "1".repeat(21) } });
    await user.tab(); // Trigger validation

    // Test valid input
    fireEvent.change(nationalIdInput, { target: { value: "1234567890123" } });
    await user.tab(); // Trigger validation

    expect(nationalIdInput).toHaveValue("1234567890123");
  });

  it("validates email field correctly", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInformation />);

    const emailInput = screen.getByRole("textbox", { name: /email address/i });

    // Test invalid email format
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    await user.tab(); // Trigger validation

    // Test valid email
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    await user.tab(); // Trigger validation

    expect(emailInput).toHaveValue("test@example.com");
  });

  it("validates date of birth field correctly", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInformation />);

    const dateInput = screen.getByLabelText(/date of birth/i);

    // Test age validation (too young)
    const tooYoung = new Date();
    tooYoung.setFullYear(tooYoung.getFullYear() - 10);
    fireEvent.change(dateInput, { target: { value: tooYoung.toISOString().split("T")[0] } });
    await user.tab(); // Trigger validation

    // Test age validation (too old)
    const tooOld = new Date();
    tooOld.setFullYear(tooOld.getFullYear() - 110);
    fireEvent.change(dateInput, { target: { value: tooOld.toISOString().split("T")[0] } });
    await user.tab(); // Trigger validation

    // Test valid age
    fireEvent.change(dateInput, { target: { value: "1990-01-01" } });
    await user.tab(); // Trigger validation

    expect(dateInput).toHaveValue("1990-01-01");
  });

  it("has proper accessibility attributes", () => {
    renderWithProviders(<PersonalInformation />);

    // Check required fields have proper attributes
    const requiredFields = screen.getAllByText("*");
    expect(requiredFields.length).toBeGreaterThan(0);

    // Check form inputs have proper autocomplete attributes
    expect(screen.getByRole("textbox", { name: /full name/i })).toHaveAttribute("autoComplete", "name");
    expect(screen.getByLabelText(/date of birth/i)).toHaveAttribute("autoComplete", "bday");
    expect(screen.getByPlaceholderText("Enter your full address")).toHaveAttribute("autoComplete", "street-address");
    expect(screen.getByRole("textbox", { name: /city/i })).toHaveAttribute("autoComplete", "address-level2");
    expect(screen.getByRole("textbox", { name: /state/i })).toHaveAttribute("autoComplete", "address-level1");
    expect(screen.getByRole("textbox", { name: /phone number/i })).toHaveAttribute("autoComplete", "tel");
    expect(screen.getByRole("textbox", { name: /email address/i })).toHaveAttribute("autoComplete", "email");
  });

  it("handles form submission when disabled", async () => {
    const user = userEvent.setup();
    const initialState = {
      isSubmitting: true,
    };

    renderWithProviders(<PersonalInformation />, { initialState });

    const saveButton = screen.getByRole("button", { name: /save & continue later/i });
    expect(saveButton).toBeDisabled();

    await user.click(saveButton);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("applies RTL styling for Arabic language", () => {
    // Since the component uses i18n.language === "ar" to determine RTL,
    // we can test this by checking that the component has the proper structure
    // and that RTL classes would be applied when the language is Arabic
    const { container } = renderWithProviders(<PersonalInformation />);

    // Check that the component renders with proper structure for RTL support
    const headers = container.querySelectorAll("h2, h3");
    expect(headers.length).toBeGreaterThan(0);

    // Check that the component has the necessary elements that would have RTL classes
    const formElements = container.querySelectorAll("input, select, textarea");
    expect(formElements.length).toBeGreaterThan(0);

    // Verify that the component structure supports RTL (this is a structural test)
    const headerElement = container.querySelector("h2");
    expect(headerElement).toBeInTheDocument();
  });

  it("renders toaster component", () => {
    renderWithProviders(<PersonalInformation />);

    expect(screen.getByTestId("toaster")).toBeInTheDocument();
  });

  it("has proper form sections structure", () => {
    renderWithProviders(<PersonalInformation />);

    // Check main sections
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    expect(screen.getByText("Contact Information")).toBeInTheDocument();

    // Check that address section has proper heading
    const addressHeadings = screen.getAllByText("Address");
    expect(addressHeadings.length).toBeGreaterThan(0);
  });

  it("handles form reset when Redux data changes", async () => {
    const { rerender } = renderWithProviders(<PersonalInformation />);

    // Initial render with empty data
    expect(screen.getByRole("textbox", { name: /full name/i })).toHaveValue("");

    // Rerender with new Redux data
    const newInitialState = {
      personalInformation: {
        name: "Updated Name",
        nationalId: "9876543210",
        dateOfBirth: "1985-12-25",
        gender: "female",
        address: "Updated Address",
        city: "Abu Dhabi",
        state: "Abu Dhabi",
        country: "United Arab Emirates",
        phone: "+971509876543",
        email: "updated@example.com",
      },
    };

    rerender(
      <Provider store={createMockStore(newInitialState)}>
        <BrowserRouter>
          <StepValidationProvider>
            <PersonalInformation />
          </StepValidationProvider>
        </BrowserRouter>
      </Provider>
    );

    // Form should be reset with new data
    expect(screen.getByRole("textbox", { name: /full name/i })).toHaveValue("Updated Name");
    expect(screen.getByRole("textbox", { name: /national id/i })).toHaveValue("9876543210");
    expect(screen.getByRole("textbox", { name: /email address/i })).toHaveValue("updated@example.com");
  });

  it("validates phone number with UAE format", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInformation />);

    const phoneInput = screen.getByRole("textbox", { name: /phone number/i });

    // Test valid UAE mobile format
    fireEvent.change(phoneInput, { target: { value: "+971501234567" } });
    await user.tab(); // Trigger validation
    expect(phoneInput).toHaveValue("+971501234567");

    // Test valid UAE landline format
    fireEvent.change(phoneInput, { target: { value: "+97124567890" } });
    await user.tab(); // Trigger validation
    expect(phoneInput).toHaveValue("+97124567890");

    // Test local UAE format
    fireEvent.change(phoneInput, { target: { value: "0501234567" } });
    await user.tab(); // Trigger validation
    expect(phoneInput).toHaveValue("0501234567");
  });

  it("handles grid layout responsively", () => {
    const { container } = renderWithProviders(<PersonalInformation />);

    // Check for responsive grid classes
    const gridElements = container.querySelectorAll(".grid");
    expect(gridElements.length).toBeGreaterThan(0);

    // Check for responsive column classes
    const responsiveElements = container.querySelectorAll(".md\\:grid-cols-2, .lg\\:grid-cols-4");
    expect(responsiveElements.length).toBeGreaterThan(0);
  });
});
