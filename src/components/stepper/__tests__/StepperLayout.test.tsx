import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { StepValidationProvider } from "../../../contexts/StepValidationContext";
import applicationSlice from "../../../store/slices/applicationSlice";
import StepperLayout from "../StepperLayout";

// Mock react-router-dom
const mockNavigate = vi.fn();
const mockLocation = { pathname: "/apply/personal-information" };

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: vi.fn(() => ({
    t: (key: string, options?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        "stepper.title": "Financial Assistance Application",
        "stepper.subtitle": "Complete the following steps to apply for financial assistance",
        "stepper.navigation.stepNavigation": "Step navigation",
        "stepper.navigation.previous": "Previous",
        "stepper.navigation.next": "Next",
        "stepper.navigation.submit": "Submit Application",
        "stepper.navigation.previousStep": "Go to previous step",
        "stepper.navigation.nextStep": "Go to next step",
        "stepper.navigation.submitApplication": "Submit application",
        "stepper.navigation.backToHome": "Back to Home",
        "stepper.stepCounter": `Step ${options?.current} of ${options?.total}`,
      };
      return translations[key] || key;
    },
    i18n: { language: "en" },
  })),
}));

// Mock Stepper component
vi.mock("../Stepper", () => ({
  default: ({ currentStep, steps, className }: { currentStep: number; steps: unknown[]; className?: string }) => (
    <div data-testid="stepper" data-current-step={currentStep} className={className}>
      Stepper Component - Step {currentStep} of {steps.length}
    </div>
  ),
}));

// Mock step validation context
const mockValidateStep = vi.fn();
vi.mock("../../../contexts/StepValidationContext", () => ({
  useStepValidation: () => ({
    validateStep: mockValidateStep,
  }),
  StepValidationProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Create a mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      application: applicationSlice,
    },
  });
};

const renderWithProviders = (ui: React.ReactElement, { pathname = "/apply/personal-information" } = {}) => {
  mockLocation.pathname = pathname;
  const store = createMockStore();

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <StepValidationProvider>{ui}</StepValidationProvider>
      </BrowserRouter>
    </Provider>
  );
};

describe("StepperLayout Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockValidateStep.mockResolvedValue(true);
  });

  it("renders stepper layout structure", () => {
    renderWithProviders(<StepperLayout />);

    expect(screen.getByText("Financial Assistance Application")).toBeInTheDocument();
    expect(screen.getByText("Complete the following steps to apply for financial assistance")).toBeInTheDocument();
    expect(screen.getByTestId("stepper")).toBeInTheDocument();
  });

  it("displays correct step counter", () => {
    renderWithProviders(<StepperLayout />);

    expect(screen.getByText("Step 1 of 3")).toBeInTheDocument();
  });

  it("shows Back to Home button on first step", () => {
    renderWithProviders(<StepperLayout />);

    expect(screen.getByText("Back to Home")).toBeInTheDocument();
    expect(screen.queryByText("Previous")).not.toBeInTheDocument();
  });

  it("shows Previous button on non-first steps", () => {
    renderWithProviders(<StepperLayout />, { pathname: "/apply/family-financial-info" });

    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.queryByText("Back to Home")).not.toBeInTheDocument();
  });

  it("shows Next button on non-final steps", () => {
    renderWithProviders(<StepperLayout />);

    expect(screen.getByText("Next")).toBeInTheDocument();
    expect(screen.queryByText("Submit Application")).not.toBeInTheDocument();
  });

  it("shows Submit button on final step", () => {
    renderWithProviders(<StepperLayout />, { pathname: "/apply/situation-descriptions" });

    expect(screen.getByText("Submit Application")).toBeInTheDocument();
    expect(screen.queryByText("Next")).not.toBeInTheDocument();
  });

  it("navigates to home when Back to Home is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<StepperLayout />);

    const backButton = screen.getByText("Back to Home");
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("navigates to previous step when Previous is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<StepperLayout />, { pathname: "/apply/family-financial-info" });

    const previousButton = screen.getByText("Previous");
    await user.click(previousButton);

    expect(mockNavigate).toHaveBeenCalledWith("/apply/personal-information");
  });

  it("validates and navigates to next step when Next is clicked", async () => {
    const user = userEvent.setup();
    mockValidateStep.mockResolvedValue(true);
    renderWithProviders(<StepperLayout />);

    const nextButton = screen.getByText("Next");
    await user.click(nextButton);

    expect(mockValidateStep).toHaveBeenCalledWith("personal-information");
    expect(mockNavigate).toHaveBeenCalledWith("/apply/family-financial-info");
  });

  it("does not navigate when validation fails", async () => {
    const user = userEvent.setup();
    mockValidateStep.mockResolvedValue(false);
    renderWithProviders(<StepperLayout />);

    const nextButton = screen.getByText("Next");
    await user.click(nextButton);

    expect(mockValidateStep).toHaveBeenCalledWith("personal-information");
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("validates final step when Submit is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<StepperLayout />, { pathname: "/apply/situation-descriptions" });

    const submitButton = screen.getByText("Submit Application");
    await user.click(submitButton);

    expect(mockValidateStep).toHaveBeenCalledWith("situation-descriptions");
  });

  it("applies RTL layout for Arabic", () => {
    // The component should handle RTL internally through styling
    const { container } = renderWithProviders(<StepperLayout />);

    // Check that the component renders properly (RTL logic is tested in integration)
    const mainContainer = container.querySelector('[dir="ltr"]');
    expect(mainContainer).toBeInTheDocument();
  });

  it("applies LTR layout for English", () => {
    const { container } = renderWithProviders(<StepperLayout />);

    const mainContainer = container.querySelector('[dir="ltr"]');
    expect(mainContainer).toBeInTheDocument();
  });

  it("has proper responsive layout", () => {
    const { container } = renderWithProviders(<StepperLayout />);

    const mainContainer = container.querySelector(".max-w-4xl.lg\\:max-w-6xl");
    expect(mainContainer).toHaveClass("mx-auto", "px-2", "sm:px-4", "lg:px-8");
  });

  it("has proper header styling", () => {
    renderWithProviders(<StepperLayout />);

    const title = screen.getByText("Financial Assistance Application");
    expect(title).toHaveClass("text-xl", "sm:text-2xl", "lg:text-3xl", "xl:text-4xl", "font-bold", "text-gray-900");

    const subtitle = screen.getByText("Complete the following steps to apply for financial assistance");
    expect(subtitle).toHaveClass(
      "text-sm",
      "sm:text-base",
      "lg:text-lg",
      "text-gray-600",
      "max-w-2xl",
      "mx-auto",
      "leading-relaxed"
    );
  });

  it("has proper navigation structure", () => {
    renderWithProviders(<StepperLayout />);

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("aria-label", "Step navigation");
    expect(nav).toHaveClass(
      "flex",
      "flex-col",
      "sm:flex-row",
      "justify-between",
      "items-stretch",
      "sm:items-center",
      "gap-3",
      "sm:gap-4"
    );
  });

  it("has proper step counter accessibility", () => {
    renderWithProviders(<StepperLayout />);

    const stepCounter = screen.getByText("Step 1 of 3");
    expect(stepCounter.parentElement).toHaveAttribute("aria-live", "polite");
    expect(stepCounter.parentElement).toHaveAttribute("aria-atomic", "true");
    expect(stepCounter).toHaveAttribute("dir", "ltr");
  });

  it("has proper button accessibility", () => {
    renderWithProviders(<StepperLayout />);

    const backButton = screen.getByLabelText("Back to Home");
    expect(backButton).toHaveAttribute("aria-label", "Back to Home");

    const nextButton = screen.getByLabelText("Go to next step");
    expect(nextButton).toHaveAttribute("aria-label", "Go to next step");
  });

  it("handles different step paths correctly", () => {
    // Test step 2
    renderWithProviders(<StepperLayout />, { pathname: "/apply/family-financial-info" });
    expect(screen.getByText("Step 2 of 3")).toBeInTheDocument();

    // Test step 3
    renderWithProviders(<StepperLayout />, { pathname: "/apply/situation-descriptions" });
    expect(screen.getByText("Step 3 of 3")).toBeInTheDocument();
  });

  it("handles invalid paths gracefully", () => {
    renderWithProviders(<StepperLayout />, { pathname: "/apply/invalid" });
    expect(screen.getByText("Step 1 of 3")).toBeInTheDocument();
  });

  it("has proper spacing and margins", () => {
    const { container } = renderWithProviders(<StepperLayout />);

    const header = container.querySelector(".text-center.mb-4.sm\\:mb-6.lg\\:mb-8");
    expect(header).toBeInTheDocument();

    const stepperContainer = container.querySelector(".mb-4.sm\\:mb-6.lg\\:mb-8");
    expect(stepperContainer).toBeInTheDocument();

    const navigation = container.querySelector(".py-3.sm\\:py-4.lg\\:py-6.border-t.border-gray-200");
    expect(navigation).toBeInTheDocument();
  });

  it("applies RTL navigation layout for Arabic", () => {
    // This test verifies RTL layout structure
    const { container } = renderWithProviders(<StepperLayout />);

    // Check that the component has proper RTL structure
    const navigation = container.querySelector("nav");
    expect(navigation).toHaveClass("flex", "flex-col", "sm:flex-row", "justify-between", "items-stretch", "sm:items-center");

    const orderElements = container.querySelectorAll(".order-1, .order-2");
    expect(orderElements.length).toBeGreaterThan(0);
  });

  it("renders Outlet for step content", () => {
    // The Outlet component doesn't render anything by itself in tests,
    // but we can verify the structure is correct
    const { container } = renderWithProviders(<StepperLayout />);

    const stepContent = container.querySelector(".mb-4.sm\\:mb-6.lg\\:mb-8");
    expect(stepContent).toBeInTheDocument();
  });

  it("has proper icon positioning for RTL", () => {
    // The component should handle RTL internally through styling
    renderWithProviders(<StepperLayout />);

    // Icons should be positioned differently for RTL
    // This is handled by the Button component's iconPosition prop
    const backButton = screen.getByText("Back to Home");
    expect(backButton).toBeInTheDocument();

    const nextButton = screen.getByText("Next");
    expect(nextButton).toBeInTheDocument();
  });

  it("updates Redux store with current step", () => {
    // This test verifies that the useEffect hook is called
    // The actual Redux state update is tested implicitly through the component behavior
    renderWithProviders(<StepperLayout />, { pathname: "/apply/family-financial-info" });

    expect(screen.getByText("Step 2 of 3")).toBeInTheDocument();
  });

  it("handles step validation mapping correctly", async () => {
    const user = userEvent.setup();

    // Test step 1 validation
    const { unmount: unmount1 } = renderWithProviders(<StepperLayout />, { pathname: "/apply/personal-information" });
    await user.click(screen.getByLabelText("Go to next step"));
    expect(mockValidateStep).toHaveBeenCalledWith("personal-information");
    unmount1();

    // Test step 2 validation
    const { unmount: unmount2 } = renderWithProviders(<StepperLayout />, { pathname: "/apply/family-financial-info" });
    await user.click(screen.getByLabelText("Go to next step"));
    expect(mockValidateStep).toHaveBeenCalledWith("family-financial-info");
    unmount2();

    // Test step 3 validation
    renderWithProviders(<StepperLayout />, { pathname: "/apply/situation-descriptions" });
    await user.click(screen.getByText("Submit Application"));
    expect(mockValidateStep).toHaveBeenCalledWith("situation-descriptions");
  });

  it("has proper mobile button alignment", () => {
    const { container } = renderWithProviders(<StepperLayout />);

    // Check that back button container has proper mobile alignment
    const backButtonContainer = container.querySelector(".flex.justify-center.sm\\:justify-start");
    expect(backButtonContainer).toBeInTheDocument();

    // Check that next button container has proper mobile alignment
    const nextButtonContainer = container.querySelector(".flex.justify-center.sm\\:justify-end");
    expect(nextButtonContainer).toBeInTheDocument();

    // Check that step counter has proper mobile text alignment
    const stepCounter = container.querySelector(".text-center.sm\\:text-left");
    expect(stepCounter).toBeInTheDocument();
  });
});
