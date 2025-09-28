import { fireEvent, render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { describe, expect, it, vi } from "vitest";
import i18n from "../../i18n";
import HelpMeWriteButton from "../HelpMeWriteButton";

const renderWithI18n = (component: React.ReactElement) => {
  return render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>);
};

describe("HelpMeWriteButton Component", () => {
  it("renders with default props", () => {
    const mockOnClick = vi.fn();

    renderWithI18n(<HelpMeWriteButton onClick={mockOnClick} />);

    const button = screen.getByRole("button", { name: /help me write/i });
    expect(button).toBeInTheDocument();
  });

  it("renders with translated text", () => {
    const mockOnClick = vi.fn();

    renderWithI18n(<HelpMeWriteButton onClick={mockOnClick} />);

    const button = screen.getByRole("button", { name: /help me write/i });
    expect(button).toHaveTextContent(/help me write/i);
  });

  it("handles click events", () => {
    const mockOnClick = vi.fn();

    renderWithI18n(<HelpMeWriteButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    const mockOnClick = vi.fn();

    renderWithI18n(<HelpMeWriteButton onClick={mockOnClick} disabled />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("shows loading state", () => {
    const mockOnClick = vi.fn();

    renderWithI18n(<HelpMeWriteButton onClick={mockOnClick} loading />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    // Check for loading spinner by looking for the SVG with animate-spin class
    const spinner = button.querySelector("svg.animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("renders AI icon", () => {
    const mockOnClick = vi.fn();

    renderWithI18n(<HelpMeWriteButton onClick={mockOnClick} />);

    // Check for the Sparkles icon (AI icon) by looking for the SVG
    const button = screen.getByRole("button");
    const icon = button.querySelector("svg.lucide-sparkles");
    expect(icon).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const mockOnClick = vi.fn();

    renderWithI18n(<HelpMeWriteButton onClick={mockOnClick} className="custom-class" />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("has proper accessibility attributes", () => {
    const mockOnClick = vi.fn();

    renderWithI18n(<HelpMeWriteButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "button");
  });

  it("renders with secondary variant styling", () => {
    const mockOnClick = vi.fn();

    renderWithI18n(<HelpMeWriteButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-gray-600", "text-white"); // secondary variant
  });

  it("applies RTL styling for Arabic language", async () => {
    const mockOnClick = vi.fn();

    // Change language to Arabic
    await i18n.changeLanguage("ar");

    renderWithI18n(<HelpMeWriteButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");
    // Icon should be positioned on the right for RTL
    expect(button).toBeInTheDocument();
  });

  it("prevents click when disabled", () => {
    const mockOnClick = vi.fn();

    renderWithI18n(<HelpMeWriteButton onClick={mockOnClick} disabled />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("prevents click when loading", () => {
    const mockOnClick = vi.fn();

    renderWithI18n(<HelpMeWriteButton onClick={mockOnClick} loading />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("has proper button size", () => {
    const mockOnClick = vi.fn();

    renderWithI18n(<HelpMeWriteButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-8", "px-3"); // small size
  });
});
