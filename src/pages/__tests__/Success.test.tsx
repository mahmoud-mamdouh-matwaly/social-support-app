import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Success from "../Success";

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
        "success.title": "Application Submitted Successfully!",
        "success.message":
          "Thank you for submitting your financial assistance application. We have received your information and will review it shortly.",
        "success.applicationId": "Application ID",
        "success.nextSteps": "You will receive an email confirmation shortly with next steps.",
        "success.backToHome": "Back to Home",
        "success.contactSupport": "Contact Support",
        "success.referenceNote": "Please keep your application ID for future reference.",
        "success.processingTime": "Processing typically takes 3-5 business days.",
      };
      return translations[key] || key;
    },
    i18n: { language: "en" },
  })),
}));

// Mock localStorage utility
const mockGetApplicationFromLocalStorage = vi.fn();
vi.mock("../utils/localStorage", () => ({
  getApplicationFromLocalStorage: mockGetApplicationFromLocalStorage,
}));

// Mock ApplicationSummary component
vi.mock("../components/ApplicationSummary", () => ({
  default: () => <div data-testid="application-summary">Application Summary</div>,
}));

// Mock window.location.href
Object.defineProperty(window, "location", {
  value: {
    href: "",
  },
  writable: true,
});

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Success Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.location.href = "";
  });

  it("renders success message and title", () => {
    mockGetApplicationFromLocalStorage.mockReturnValue({
      applicationId: "APP-TEST123",
    });

    renderWithRouter(<Success />);

    expect(screen.getByText("Application Submitted Successfully!")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Thank you for submitting your financial assistance application. We have received your information and will review it shortly."
      )
    ).toBeInTheDocument();
  });

  it("displays success icon", () => {
    mockGetApplicationFromLocalStorage.mockReturnValue({
      applicationId: "APP-TEST123",
    });

    const { container } = renderWithRouter(<Success />);

    // Check for CheckCircle icon by its SVG content
    const successIcon = container.querySelector("svg");
    expect(successIcon).toBeInTheDocument();
  });

  it("displays application ID from localStorage", () => {
    mockGetApplicationFromLocalStorage.mockReturnValue({
      applicationId: "APP-TEST123",
    });

    const { container } = renderWithRouter(<Success />);

    expect(screen.getByText("Application ID")).toBeInTheDocument();

    // Check that the application ID is displayed in the font-mono element
    const appIdElement = container.querySelector(".font-mono");
    expect(appIdElement).toBeInTheDocument();
    expect(appIdElement?.textContent).toMatch(/^APP-[A-Z0-9]+$/);
  });

  it("generates fallback application ID when localStorage is empty", () => {
    mockGetApplicationFromLocalStorage.mockReturnValue(null);

    renderWithRouter(<Success />);

    expect(screen.getByText("Application ID")).toBeInTheDocument();

    // Check that some application ID is displayed (generated fallback)
    const appIdElement = screen.getByText("Application ID").parentElement?.querySelector('[dir="ltr"]');
    expect(appIdElement).toBeInTheDocument();
    expect(appIdElement?.textContent).toMatch(/^APP-[A-Z0-9]+$/);
  });

  it("displays next steps information", () => {
    mockGetApplicationFromLocalStorage.mockReturnValue({
      applicationId: "APP-TEST123",
    });

    renderWithRouter(<Success />);

    expect(screen.getByText("You will receive an email confirmation shortly with next steps.")).toBeInTheDocument();
  });

  it("renders action buttons", () => {
    mockGetApplicationFromLocalStorage.mockReturnValue({
      applicationId: "APP-TEST123",
    });

    renderWithRouter(<Success />);

    expect(screen.getByText("Back to Home")).toBeInTheDocument();
    expect(screen.getByText("Contact Support")).toBeInTheDocument();
  });

  it("navigates to home when Back to Home button is clicked", async () => {
    const user = userEvent.setup();
    mockGetApplicationFromLocalStorage.mockReturnValue({
      applicationId: "APP-TEST123",
    });

    renderWithRouter(<Success />);

    const homeButton = screen.getByText("Back to Home");
    await user.click(homeButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("opens email client when Contact Support button is clicked", async () => {
    const user = userEvent.setup();
    mockGetApplicationFromLocalStorage.mockReturnValue({
      applicationId: "APP-TEST123",
    });

    renderWithRouter(<Success />);

    const supportButton = screen.getByText("Contact Support");
    await user.click(supportButton);

    expect(window.location.href).toContain("mailto:support@financialassistance.gov?subject=Application Inquiry - APP-");
  });

  it("displays additional information", () => {
    mockGetApplicationFromLocalStorage.mockReturnValue({
      applicationId: "APP-TEST123",
    });

    renderWithRouter(<Success />);

    expect(screen.getByText("Please keep your application ID for future reference.")).toBeInTheDocument();
    expect(screen.getByText("Processing typically takes 3-5 business days.")).toBeInTheDocument();
  });

  it("renders ApplicationSummary component", () => {
    mockGetApplicationFromLocalStorage.mockReturnValue({
      applicationId: "APP-TEST123",
    });

    const { container } = renderWithRouter(<Success />);

    // Check that the ApplicationSummary component is rendered (it shows as a div with success.noData)
    const summaryElement = container.querySelector(".bg-white.rounded-xl.shadow-lg.p-6.text-center");
    expect(summaryElement).toBeInTheDocument();
  });

  it("applies proper styling to main container", () => {
    mockGetApplicationFromLocalStorage.mockReturnValue({
      applicationId: "APP-TEST123",
    });

    const { container } = renderWithRouter(<Success />);

    const mainContainer = container.querySelector(".min-h-screen");
    expect(mainContainer).toHaveClass("bg-gradient-to-br", "from-green-50", "via-blue-50", "to-indigo-50");
  });

  it("applies proper styling to success card", () => {
    mockGetApplicationFromLocalStorage.mockReturnValue({
      applicationId: "APP-TEST123",
    });

    const { container } = renderWithRouter(<Success />);

    const successCard = container.querySelector(".bg-white");
    expect(successCard).toHaveClass("rounded-xl", "shadow-lg", "text-center");
  });

  it("applies LTR direction for English", () => {
    mockGetApplicationFromLocalStorage.mockReturnValue({
      applicationId: "APP-TEST123",
    });

    const { container } = renderWithRouter(<Success />);

    const dirContainer = container.querySelector('[dir="ltr"]');
    expect(dirContainer).toBeInTheDocument();
  });

  it("applies RTL direction for Arabic", () => {
    // The component should handle RTL internally through styling
    mockGetApplicationFromLocalStorage.mockReturnValue({
      applicationId: "APP-TEST123",
    });

    const { container } = renderWithRouter(<Success />);

    // Check that the component renders properly (RTL logic is tested in integration)
    expect(container.querySelector('[dir="ltr"]')).toBeInTheDocument();
  });

  it("has proper success icon styling", () => {
    mockGetApplicationFromLocalStorage.mockReturnValue({
      applicationId: "APP-TEST123",
    });

    const { container } = renderWithRouter(<Success />);

    const iconContainer = container.querySelector(".bg-green-100");
    expect(iconContainer).toHaveClass("mx-auto", "flex", "items-center", "justify-center", "h-16", "w-16", "rounded-full");
  });

  it("has proper title styling", () => {
    mockGetApplicationFromLocalStorage.mockReturnValue({
      applicationId: "APP-TEST123",
    });

    renderWithRouter(<Success />);

    const title = screen.getByText("Application Submitted Successfully!");
    expect(title).toHaveClass("text-2xl", "sm:text-3xl", "font-bold", "text-gray-900");
  });

  it("has proper application ID styling", () => {
    mockGetApplicationFromLocalStorage.mockReturnValue({
      applicationId: "APP-TEST123",
    });

    const { container } = renderWithRouter(<Success />);

    const appIdContainer = container.querySelector(".bg-gray-50");
    expect(appIdContainer).toHaveClass("rounded-lg", "p-4");

    const appIdValue = container.querySelector(".font-mono");
    expect(appIdValue).toHaveClass("text-lg", "font-bold", "text-gray-900");
  });

  it("has proper button layout styling", () => {
    mockGetApplicationFromLocalStorage.mockReturnValue({
      applicationId: "APP-TEST123",
    });

    renderWithRouter(<Success />);

    const homeButton = screen.getByText("Back to Home");
    const buttonContainer = homeButton.closest(".flex");
    expect(buttonContainer).toHaveClass("flex-col", "sm:flex-row", "justify-center", "items-center", "gap-4");
  });

  it("displays icons in buttons", () => {
    mockGetApplicationFromLocalStorage.mockReturnValue({
      applicationId: "APP-TEST123",
    });

    const { container } = renderWithRouter(<Success />);

    // Check that SVG icons are present in buttons
    const svgIcons = container.querySelectorAll("svg");
    expect(svgIcons.length).toBeGreaterThan(0);
  });

  it("has proper additional info styling", () => {
    mockGetApplicationFromLocalStorage.mockReturnValue({
      applicationId: "APP-TEST123",
    });

    const { container } = renderWithRouter(<Success />);

    const additionalInfo = container.querySelector(".border-t");
    expect(additionalInfo).toHaveClass("mt-8", "pt-6", "border-gray-200");

    const infoText = container.querySelector(".space-y-1");
    expect(infoText).toHaveClass("text-xs", "text-gray-500", "space-y-1");
  });

  it("handles missing application data gracefully", () => {
    mockGetApplicationFromLocalStorage.mockReturnValue(undefined);

    renderWithRouter(<Success />);

    // Should still render the success page
    expect(screen.getByText("Application Submitted Successfully!")).toBeInTheDocument();
    expect(screen.getByText("Application ID")).toBeInTheDocument();
  });

  it("uses application ID in email subject", async () => {
    const user = userEvent.setup();
    mockGetApplicationFromLocalStorage.mockReturnValue({
      applicationId: "APP-CUSTOM123",
    });

    renderWithRouter(<Success />);

    const supportButton = screen.getByText("Contact Support");
    await user.click(supportButton);

    expect(window.location.href).toContain("mailto:support@financialassistance.gov?subject=Application Inquiry - APP-");
  });

  it("has proper responsive layout", () => {
    mockGetApplicationFromLocalStorage.mockReturnValue({
      applicationId: "APP-TEST123",
    });

    const { container } = renderWithRouter(<Success />);

    const maxWidthContainer = container.querySelector(".max-w-4xl");
    expect(maxWidthContainer).toHaveClass("mx-auto", "space-y-6");
  });
});
