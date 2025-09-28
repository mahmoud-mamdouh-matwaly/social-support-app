import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Home from "../Home";

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
        "main.welcome": "Welcome to the Financial Assistance Portal",
        "main.description": "Apply for financial assistance and track your application status.",
        "buttons.applyForAssistance": "Apply for Financial Assistance",
      };
      return translations[key] || key;
    },
    i18n: { language: "en" },
  })),
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Home Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the main heading correctly", () => {
    renderWithRouter(<Home />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Welcome to the Financial Assistance Portal");
    expect(heading).toHaveAttribute("id", "main-heading");
  });

  it("renders the description text correctly", () => {
    renderWithRouter(<Home />);

    const description = screen.getByRole("doc-abstract");
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent("Apply for financial assistance and track your application status.");
  });

  it("renders the apply button with correct text and icon", () => {
    renderWithRouter(<Home />);

    const applyButton = screen.getByRole("button", { name: /apply for financial assistance/i });
    expect(applyButton).toBeInTheDocument();
    expect(applyButton).toHaveTextContent("Apply for Financial Assistance");

    // Check for the FileText icon (SVG)
    const icon = applyButton.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("navigates to the correct path when apply button is clicked", async () => {
    const user = userEvent.setup();
    renderWithRouter(<Home />);

    const applyButton = screen.getByRole("button", { name: /apply for financial assistance/i });
    await user.click(applyButton);

    expect(mockNavigate).toHaveBeenCalledWith("/apply/personal-information");
  });

  it("has proper accessibility attributes", () => {
    renderWithRouter(<Home />);

    const heading = screen.getByRole("heading", { level: 2 });
    const applyButton = screen.getByRole("button", { name: /apply for financial assistance/i });
    const description = screen.getByRole("doc-abstract");

    // Check heading has proper ID
    expect(heading).toHaveAttribute("id", "main-heading");

    // Check button is described by the heading
    expect(applyButton).toHaveAttribute("aria-describedby", "main-heading");

    // Check description has proper role
    expect(description).toHaveAttribute("role", "doc-abstract");
  });

  it("has proper responsive styling classes", () => {
    const { container } = renderWithRouter(<Home />);

    // Check main container has responsive classes
    const mainContainer = container.querySelector(".bg-white.rounded-lg.shadow-sm");
    expect(mainContainer).toHaveClass("p-3", "sm:p-4", "lg:p-8", "xl:p-10", "max-w-4xl", "mx-auto");

    // Check heading has responsive text sizing
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveClass("text-xl", "sm:text-2xl", "lg:text-3xl", "xl:text-4xl");

    // Check description has responsive text sizing
    const description = screen.getByRole("doc-abstract");
    expect(description).toHaveClass("text-sm", "sm:text-base", "lg:text-lg", "xl:text-xl");

    // Check button has responsive sizing
    const applyButton = screen.getByRole("button", { name: /apply for financial assistance/i });
    expect(applyButton).toHaveClass("text-base", "sm:text-lg", "lg:text-xl");
  });

  it("has proper button styling and variant", () => {
    renderWithRouter(<Home />);

    const applyButton = screen.getByRole("button", { name: /apply for financial assistance/i });

    // Check button has primary variant classes (these would be applied by the Button component)
    expect(applyButton).toHaveClass("inline-flex", "items-center", "justify-center");

    // Check button has large size classes
    expect(applyButton).toHaveClass("px-4", "sm:px-6", "lg:px-10", "py-2", "sm:py-3", "lg:py-4");
  });

  it("centers the content properly", () => {
    const { container } = renderWithRouter(<Home />);

    // Check main content is centered
    const textCenter = container.querySelector(".text-center");
    expect(textCenter).toBeInTheDocument();

    // Check button container is centered
    const buttonContainer = container.querySelector(".flex.justify-center");
    expect(buttonContainer).toBeInTheDocument();

    // Check description has max-width and is centered
    const description = screen.getByRole("doc-abstract");
    expect(description).toHaveClass("max-w-2xl", "mx-auto");
  });

  it("handles multiple rapid clicks correctly", async () => {
    const user = userEvent.setup();
    renderWithRouter(<Home />);

    const applyButton = screen.getByRole("button", { name: /apply for financial assistance/i });

    // Click multiple times rapidly
    await user.click(applyButton);
    await user.click(applyButton);
    await user.click(applyButton);

    // Should have been called for each click
    expect(mockNavigate).toHaveBeenCalledTimes(3);
    expect(mockNavigate).toHaveBeenCalledWith("/apply/personal-information");
  });

  it("renders with proper semantic HTML structure", () => {
    renderWithRouter(<Home />);

    // Check for proper heading hierarchy
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();

    // Check for button element
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    // Check for descriptive text with semantic role
    const description = screen.getByRole("doc-abstract");
    expect(description).toBeInTheDocument();
  });

  it("handles direct function call correctly", () => {
    renderWithRouter(<Home />);

    const applyButton = screen.getByRole("button", { name: /apply for financial assistance/i });

    // Simulate direct click event
    fireEvent.click(applyButton);

    expect(mockNavigate).toHaveBeenCalledWith("/apply/personal-information");
  });

  it("displays correct text content from translations", () => {
    renderWithRouter(<Home />);

    // Check all translated text is displayed correctly
    expect(screen.getByText("Welcome to the Financial Assistance Portal")).toBeInTheDocument();
    expect(screen.getByText("Apply for financial assistance and track your application status.")).toBeInTheDocument();
    expect(screen.getByText("Apply for Financial Assistance")).toBeInTheDocument();
  });

  it("has proper spacing and layout classes", () => {
    renderWithRouter(<Home />);

    // Check heading margins
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveClass("mb-2", "sm:mb-3", "lg:mb-6", "xl:mb-8");

    // Check description margins
    const description = screen.getByRole("doc-abstract");
    expect(description).toHaveClass("mb-4", "sm:mb-6", "lg:mb-10");

    // Check description line height
    expect(description).toHaveClass("leading-relaxed");
  });

  it("renders without crashing", () => {
    expect(() => renderWithRouter(<Home />)).not.toThrow();
  });

  it("applies RTL-compatible layout structure", () => {
    const { container } = renderWithRouter(<Home />);

    // Check that layout uses flex and centering which work well with RTL
    const buttonContainer = container.querySelector(".flex.justify-center");
    expect(buttonContainer).toBeInTheDocument();

    // Check text centering which works in both LTR and RTL
    const textCenter = container.querySelector(".text-center");
    expect(textCenter).toBeInTheDocument();
  });

  it("has proper color and styling classes", () => {
    const { container } = renderWithRouter(<Home />);

    // Check main container styling
    const mainContainer = container.querySelector(".bg-white.rounded-lg.shadow-sm");
    expect(mainContainer).toBeInTheDocument();

    // Check heading color
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveClass("font-bold", "text-gray-900");

    // Check description color
    const description = screen.getByRole("doc-abstract");
    expect(description).toHaveClass("text-gray-600");
  });
});
