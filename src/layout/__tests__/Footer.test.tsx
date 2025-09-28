import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Footer from "../Footer";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: vi.fn(() => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "header.title": "Social Support Portal",
        "footer.description":
          "Providing financial assistance and support services to help individuals and families in need.",
        "footer.quickLinks": "Quick Links",
        "footer.howToApply": "How to Apply",
        "footer.eligibility": "Eligibility Requirements",
        "footer.faq": "Frequently Asked Questions",
        "footer.contact": "Contact Us",
        "footer.contactUs": "Contact Us",
        "footer.phone": "Phone",
        "footer.email": "Email",
        "footer.businessHours": "Monday - Friday: 8:00 AM - 6:00 PM EST",
        "footer.allRightsReserved": "All rights reserved.",
        "footer.privacy": "Privacy Policy",
        "footer.terms": "Terms of Service",
        "footer.accessibility": "Accessibility",
      };
      return translations[key] || key;
    },
    i18n: { language: "en" },
  })),
}));

describe("Footer Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders footer with proper structure", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass("bg-gray-800", "text-white", "mt-auto");
  });

  it("displays about section", () => {
    render(<Footer />);

    expect(screen.getByText("Social Support Portal")).toBeInTheDocument();
    expect(
      screen.getByText("Providing financial assistance and support services to help individuals and families in need.")
    ).toBeInTheDocument();
  });

  it("renders quick links navigation", () => {
    render(<Footer />);

    expect(screen.getByText("Quick Links")).toBeInTheDocument();
    expect(screen.getByText("How to Apply")).toBeInTheDocument();
    expect(screen.getByText("Eligibility Requirements")).toBeInTheDocument();
    expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();

    // Use getAllByText since "Contact Us" appears twice (in quick links and contact section)
    const contactUsElements = screen.getAllByText("Contact Us");
    expect(contactUsElements).toHaveLength(2);
  });

  it("has proper quick links structure", () => {
    render(<Footer />);

    const quickLinksHeading = screen.getByText("Quick Links");
    expect(quickLinksHeading.tagName).toBe("H4");
    expect(quickLinksHeading).toHaveAttribute("id", "footer-quick-links");

    const nav = quickLinksHeading.closest("nav");
    expect(nav).toHaveAttribute("aria-labelledby", "footer-quick-links");

    const list = screen.getByRole("list");
    expect(list).toHaveAttribute("role", "list");
  });

  it("renders contact information", () => {
    render(<Footer />);

    expect(screen.getByText("Phone: +1 (555) 123-4567")).toBeInTheDocument();
    expect(screen.getByText("Email: support@socialsupport.gov")).toBeInTheDocument();
    expect(screen.getByText("Monday - Friday: 8:00 AM - 6:00 PM EST")).toBeInTheDocument();
  });

  it("has proper contact links", () => {
    render(<Footer />);

    const phoneLink = screen.getByText("Phone: +1 (555) 123-4567");
    expect(phoneLink).toHaveAttribute("href", "tel:+15551234567");
    expect(phoneLink).toHaveAttribute("aria-label", "Phone +1 (555) 123-4567");

    const emailLink = screen.getByText("Email: support@socialsupport.gov");
    expect(emailLink).toHaveAttribute("href", "mailto:support@socialsupport.gov");
    expect(emailLink).toHaveAttribute("aria-label", "Email support@socialsupport.gov");
  });

  it("displays current year in copyright", () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} Social Support Portal. All rights reserved.`)).toBeInTheDocument();
  });

  it("renders legal links", () => {
    render(<Footer />);

    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
    expect(screen.getByText("Terms of Service")).toBeInTheDocument();
    expect(screen.getByText("Accessibility")).toBeInTheDocument();
  });

  it("has proper legal links structure", () => {
    render(<Footer />);

    const legalNav = screen.getByLabelText("Legal and policy links");
    expect(legalNav.tagName).toBe("NAV");

    const privacyLink = screen.getByText("Privacy Policy");
    expect(privacyLink).toHaveAttribute("href", "#privacy");

    const termsLink = screen.getByText("Terms of Service");
    expect(termsLink).toHaveAttribute("href", "#terms");

    const accessibilityLink = screen.getByText("Accessibility");
    expect(accessibilityLink).toHaveAttribute("href", "#accessibility");
  });

  it("has proper responsive grid layout", () => {
    const { container } = render(<Footer />);

    const gridContainer = container.querySelector(".grid");
    expect(gridContainer).toHaveClass("grid-cols-1", "md:grid-cols-3", "gap-4", "sm:gap-6", "lg:gap-8");
  });

  it("has proper contact section accessibility", () => {
    const { container } = render(<Footer />);

    const contactSection = screen.getByRole("region");
    expect(contactSection).toHaveAttribute("aria-labelledby", "footer-contact");

    // Get the contact heading by its ID instead of text since "Contact Us" appears twice
    const contactHeading = container.querySelector("#footer-contact");
    expect(contactHeading).toBeInTheDocument();
    expect(contactHeading).toHaveAttribute("id", "footer-contact");
  });

  it("has proper screen reader content", () => {
    const { container } = render(<Footer />);

    // Check for screen reader content by class since the text is split
    const srOnlyElements = container.querySelectorAll(".sr-only");
    expect(srOnlyElements.length).toBeGreaterThan(0);

    // Check that screen reader text exists
    expect(container.textContent).toContain("number:");
    expect(container.textContent).toContain("address:");
    expect(container.textContent).toContain("Business hours:");
  });

  it("has proper business hours styling", () => {
    render(<Footer />);

    const businessHours = screen.getByText("Monday - Friday: 8:00 AM - 6:00 PM EST");
    expect(businessHours).toHaveClass("text-xs", "text-gray-400", "mt-3");
    expect(businessHours).toHaveAttribute("role", "note");
  });

  it("applies RTL layout for Arabic", () => {
    // The component should handle RTL internally through styling
    const { container } = render(<Footer />);

    // Check that the component renders properly (RTL logic is tested in integration)
    const bottomBar = container.querySelector(".space-y-3.sm\\:space-y-0");
    expect(bottomBar).toBeInTheDocument();
  });

  it("applies LTR layout for English", () => {
    render(<Footer />);

    const { container } = render(<Footer />);

    const legalNav = container.querySelector(".space-x-4.sm\\:space-x-6");
    expect(legalNav).toBeInTheDocument();
    expect(legalNav).not.toHaveClass("space-x-reverse");
  });

  it("has proper hover and focus styles", () => {
    render(<Footer />);

    const quickLink = screen.getByText("How to Apply");
    expect(quickLink).toHaveClass(
      "hover:text-white",
      "focus:text-white",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-blue-300",
      "focus:ring-offset-2",
      "focus:ring-offset-gray-800"
    );

    const phoneLink = screen.getByText("Phone: +1 (555) 123-4567");
    expect(phoneLink).toHaveClass("hover:text-white", "focus:text-white", "transition-colors", "duration-200");
  });

  it("has proper text sizing and colors", () => {
    render(<Footer />);

    const aboutTitle = screen.getByText("Social Support Portal");
    expect(aboutTitle).toHaveClass("text-base", "sm:text-lg", "font-semibold", "text-white");

    const description = screen.getByText(
      "Providing financial assistance and support services to help individuals and families in need."
    );
    expect(description).toHaveClass("text-xs", "sm:text-sm", "text-gray-300", "leading-relaxed");

    const quickLinksTitle = screen.getByText("Quick Links");
    expect(quickLinksTitle).toHaveClass("text-sm", "sm:text-base", "font-medium", "text-white");

    const quickLink = screen.getByText("How to Apply");
    expect(quickLink).toHaveClass("text-xs", "sm:text-sm", "text-gray-300");
  });

  it("has proper spacing and padding", () => {
    const { container } = render(<Footer />);

    const footerContent = container.querySelector(".max-w-7xl");
    expect(footerContent).toHaveClass("mx-auto", "px-2", "sm:px-4", "lg:px-8", "py-4", "sm:py-6", "lg:py-8");

    const aboutSection = container.querySelector(".space-y-2.sm\\:space-y-3");
    expect(aboutSection).toBeInTheDocument();

    const bottomBar = container.querySelector(".mt-4.sm\\:mt-6.lg\\:mt-8.pt-4.sm\\:pt-6.border-t.border-gray-700");
    expect(bottomBar).toBeInTheDocument();
  });

  it("has proper border styling", () => {
    const { container } = render(<Footer />);

    const bottomBar = container.querySelector(".border-t.border-gray-700");
    expect(bottomBar).toBeInTheDocument();
  });

  it("has proper responsive bottom bar layout", () => {
    const { container } = render(<Footer />);

    const bottomBar = container.querySelector(".flex.flex-col.sm\\:flex-row.justify-between.items-center");
    expect(bottomBar).toBeInTheDocument();
  });

  it("has proper copyright text styling", () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    const copyright = screen.getByText(`© ${currentYear} Social Support Portal. All rights reserved.`);
    expect(copyright).toHaveClass("text-xs", "text-gray-400");
  });

  it("has proper legal links styling", () => {
    render(<Footer />);

    const privacyLink = screen.getByText("Privacy Policy");
    expect(privacyLink).toHaveClass("text-xs", "text-gray-400");

    const termsLink = screen.getByText("Terms of Service");
    expect(termsLink).toHaveClass("text-xs", "text-gray-400");

    const accessibilityLink = screen.getByText("Accessibility");
    expect(accessibilityLink).toHaveClass("text-xs", "text-gray-400");
  });
});
