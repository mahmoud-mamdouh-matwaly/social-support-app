import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CountrySelect from "../CountrySelect";

// Mock react-select-country-list
vi.mock("react-select-country-list", () => ({
  default: () => ({
    getData: () => [
      { value: "US", label: "United States" },
      { value: "CA", label: "Canada" },
      { value: "GB", label: "United Kingdom" },
      { value: "AE", label: "United Arab Emirates" },
    ],
  }),
}));

describe("CountrySelect Component", () => {
  it("renders with basic props", () => {
    render(<CountrySelect label="Select Country" />);

    const label = screen.getByText("Select Country");
    const input = screen.getByRole("combobox");

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it("shows placeholder text", () => {
    render(<CountrySelect label="Select Country" placeholder="Choose a country" />);

    expect(screen.getByText("Choose a country")).toBeInTheDocument();
  });

  it("displays country options when clicked", async () => {
    const user = userEvent.setup();

    render(<CountrySelect label="Select Country" />);

    const input = screen.getByRole("combobox");
    await user.click(input);

    // Check that country options appear
    await waitFor(() => {
      expect(screen.getByText("United States")).toBeInTheDocument();
      expect(screen.getByText("Canada")).toBeInTheDocument();
      expect(screen.getByText("United Kingdom")).toBeInTheDocument();
      expect(screen.getByText("United Arab Emirates")).toBeInTheDocument();
    });
  });

  it("handles country selection", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<CountrySelect label="Select Country" onChange={handleChange} />);

    const input = screen.getByRole("combobox");
    await user.click(input);

    // Wait for options to appear and click one
    await waitFor(() => {
      const option = screen.getByText("United States");
      expect(option).toBeInTheDocument();
    });

    await user.click(screen.getByText("United States"));
    expect(handleChange).toHaveBeenCalledWith("US");
  });

  it("displays selected country value", () => {
    render(<CountrySelect label="Select Country" value="CA" />);

    expect(screen.getByText("Canada")).toBeInTheDocument();
  });

  it("supports search functionality", async () => {
    const user = userEvent.setup();

    render(<CountrySelect label="Select Country" />);

    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.type(input, "United");

    // Should filter countries based on search
    await waitFor(() => {
      expect(screen.getByText("United States")).toBeInTheDocument();
      expect(screen.getByText("United Kingdom")).toBeInTheDocument();
    });
  });

  it("supports clear functionality", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    const { container } = render(<CountrySelect label="Select Country" value="US" onChange={handleChange} />);

    // Find and click the clear button (X) by its CSS class
    const clearButton = container.querySelector(".react-select__clear-indicator");
    expect(clearButton).toBeInTheDocument();

    await user.click(clearButton!);
    expect(handleChange).toHaveBeenCalledWith("");
  });

  it("shows error state", () => {
    render(<CountrySelect label="Select Country" error="Country is required" />);

    const errorMessage = screen.getByText("Country is required");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("text-red-600");
  });

  it("shows help text", () => {
    render(<CountrySelect label="Select Country" helperText="Please select your country" />);

    const helpText = screen.getByText("Please select your country");
    expect(helpText).toBeInTheDocument();
    expect(helpText).toHaveClass("text-gray-500");
  });

  it("shows required indicator when required prop is true", () => {
    render(<CountrySelect label="Select Country" required />);

    const label = screen.getByText(/select country/i);
    expect(label).toHaveTextContent("*"); // Required indicator
  });

  it("supports full width styling", () => {
    const { container } = render(<CountrySelect label="Select Country" fullWidth />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("w-full");
  });

  it("applies custom className", () => {
    const { container } = render(<CountrySelect label="Select Country" className="custom-country-select" />);

    const selectContainer = container.querySelector(".react-select-container");
    expect(selectContainer).toHaveClass("custom-country-select");
  });

  it("handles name attribute correctly", () => {
    const { container } = render(<CountrySelect label="Select Country" name="country" />);

    // React-select creates a hidden input with the name attribute
    const hiddenInput = container.querySelector('input[name="country"]');
    expect(hiddenInput).toBeInTheDocument();
  });

  it("uses provided ID when given", () => {
    render(<CountrySelect label="Select Country" id="country-select" />);

    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("id", "country-select");
  });

  it("handles controlled value changes", () => {
    const { rerender } = render(<CountrySelect label="Select Country" value="US" />);

    expect(screen.getByText("United States")).toBeInTheDocument();

    rerender(<CountrySelect label="Select Country" value="CA" />);
    expect(screen.getByText("Canada")).toBeInTheDocument();
  });
});
