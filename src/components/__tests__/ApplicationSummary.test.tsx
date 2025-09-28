import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { beforeEach, describe, expect, it, vi } from "vitest";
import i18n from "../../i18n";
import * as localStorageUtils from "../../utils/localStorage";
import { SubmittedApplicationData } from "../../utils/localStorage";
import ApplicationSummary from "../ApplicationSummary";

// Mock localStorage utilities
vi.mock("../../utils/localStorage", () => ({
  getApplicationFromLocalStorage: vi.fn(),
}));

const mockApplicationData = {
  applicationId: "APP-123456789",
  submissionDate: "2024-01-15T10:30:00.000Z",
  personalInformation: {
    name: "John Doe",
    nationalId: "123456789",
    dateOfBirth: "1990-01-15",
    gender: "male",
    phone: "+971501234567",
    email: "john.doe@example.com",
    address: "123 Main Street",
    city: "Dubai",
    state: "Dubai",
    country: "UAE",
  },
  familyFinancialInfo: {
    maritalStatus: "married",
    dependents: "2",
    employmentStatus: "employed",
    monthlyIncome: "5000",
    housingStatus: "rent",
  },
  situationDescriptions: {
    currentFinancialSituation: "Facing temporary financial difficulties due to medical expenses.",
    employmentCircumstances: "Currently employed but reduced hours due to company restructuring.",
    reasonForApplying: "Need assistance to cover medical bills and basic living expenses.",
  },
};

const renderWithI18n = (component: React.ReactElement) => {
  return render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>);
};

describe("ApplicationSummary Component", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Ensure we start with English language for consistent tests
    await i18n.changeLanguage("en");
  });

  it("renders application summary when data is available", () => {
    vi.mocked(localStorageUtils.getApplicationFromLocalStorage).mockReturnValue(mockApplicationData);

    renderWithI18n(<ApplicationSummary />);

    expect(screen.getByText(/application summary/i)).toBeInTheDocument();
    expect(screen.getByText(/review the information/i)).toBeInTheDocument();
  });

  it("renders personal information section", () => {
    vi.mocked(localStorageUtils.getApplicationFromLocalStorage).mockReturnValue(mockApplicationData);

    renderWithI18n(<ApplicationSummary />);

    expect(screen.getByText(/personal information/i)).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("123456789")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    expect(screen.getByText("+971501234567")).toBeInTheDocument();
  });

  it("renders family & financial information section", () => {
    vi.mocked(localStorageUtils.getApplicationFromLocalStorage).mockReturnValue(mockApplicationData);

    renderWithI18n(<ApplicationSummary />);

    expect(screen.getByText(/family & financial information/i)).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument(); // dependents
    expect(screen.getByText("5000 AED")).toBeInTheDocument(); // monthly income
  });

  it("renders situation descriptions section", () => {
    vi.mocked(localStorageUtils.getApplicationFromLocalStorage).mockReturnValue(mockApplicationData);

    renderWithI18n(<ApplicationSummary />);

    expect(screen.getByText(/situation descriptions/i)).toBeInTheDocument();
    expect(screen.getByText(/facing temporary financial difficulties/i)).toBeInTheDocument();
    expect(screen.getByText(/currently employed but reduced hours/i)).toBeInTheDocument();
    expect(screen.getByText(/need assistance to cover medical bills/i)).toBeInTheDocument();
  });

  it("formats date of birth correctly", () => {
    vi.mocked(localStorageUtils.getApplicationFromLocalStorage).mockReturnValue(mockApplicationData);

    renderWithI18n(<ApplicationSummary />);

    // Check if date is formatted (will depend on locale)
    expect(screen.getByText(/1\/15\/1990|15\/1\/1990/)).toBeInTheDocument();
  });

  it("renders address with all components", () => {
    vi.mocked(localStorageUtils.getApplicationFromLocalStorage).mockReturnValue(mockApplicationData);

    renderWithI18n(<ApplicationSummary />);

    expect(screen.getByText(/123 Main Street, Dubai, Dubai, UAE/)).toBeInTheDocument();
  });

  it("shows no data message when no application data", () => {
    vi.mocked(localStorageUtils.getApplicationFromLocalStorage).mockReturnValue(null);

    renderWithI18n(<ApplicationSummary />);

    expect(screen.getByText(/no application data found/i)).toBeInTheDocument();
  });

  it("handles missing optional fields gracefully", () => {
    const incompleteData = {
      ...mockApplicationData,
      personalInformation: {
        name: "John Doe",
        nationalId: "123456789",
        // Missing other fields
      },
      familyFinancialInfo: {
        maritalStatus: "single",
        // Missing other fields
      },
      situationDescriptions: {
        currentFinancialSituation: "Some situation",
        // Missing other fields
      },
    };

    vi.mocked(localStorageUtils.getApplicationFromLocalStorage).mockReturnValue(incompleteData as SubmittedApplicationData);

    renderWithI18n(<ApplicationSummary />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("123456789")).toBeInTheDocument();
    expect(screen.getByText("Some situation")).toBeInTheDocument();
  });

  it("applies RTL styling for Arabic language", async () => {
    vi.mocked(localStorageUtils.getApplicationFromLocalStorage).mockReturnValue(mockApplicationData);

    // Change language to Arabic
    await i18n.changeLanguage("ar");

    const { container } = renderWithI18n(<ApplicationSummary />);

    // Check for RTL direction on the main container
    const rtlContainer = container.querySelector('[dir="rtl"]');
    expect(rtlContainer).toBeInTheDocument();

    // Reset language back to English for other tests
    await i18n.changeLanguage("en");
  });

  it("renders section icons correctly", () => {
    vi.mocked(localStorageUtils.getApplicationFromLocalStorage).mockReturnValue(mockApplicationData);

    const { container } = renderWithI18n(<ApplicationSummary />);

    // Check for section icons by looking for the SVG elements
    const userIcon = container.querySelector("svg.lucide-user");
    const usersIcon = container.querySelector("svg.lucide-users");
    const fileIcon = container.querySelector("svg.lucide-file-text");

    expect(userIcon).toBeInTheDocument();
    expect(usersIcon).toBeInTheDocument();
    expect(fileIcon).toBeInTheDocument();
  });

  it("handles empty situation descriptions", async () => {
    // Reset language to English for this test
    await i18n.changeLanguage("en");

    const dataWithEmptyDescriptions = {
      ...mockApplicationData,
      situationDescriptions: {
        currentFinancialSituation: "",
        employmentCircumstances: "",
        reasonForApplying: "",
      },
    };

    vi.mocked(localStorageUtils.getApplicationFromLocalStorage).mockReturnValue(dataWithEmptyDescriptions);

    renderWithI18n(<ApplicationSummary />);

    // Should still render the section header but no description content
    expect(screen.getByText(/situation descriptions/i)).toBeInTheDocument();
  });
});
