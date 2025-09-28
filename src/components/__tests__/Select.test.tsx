import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Select from "../Select";

const mockOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

describe("Select Component", () => {
  it("renders with basic props", () => {
    render(<Select label="Choose option" options={mockOptions} />);

    const label = screen.getByText("Choose option");
    const input = screen.getByRole("combobox");

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it("shows placeholder text", () => {
    render(<Select label="Choose option" options={mockOptions} placeholder="Select an option" />);

    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  it("shows error state", () => {
    render(<Select label="Choose option" options={mockOptions} error="Selection is required" />);

    const errorMessage = screen.getByText("Selection is required");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("text-red-600");
  });

  it("shows help text", () => {
    render(<Select label="Choose option" options={mockOptions} helperText="Please select one option" />);

    const helpText = screen.getByText("Please select one option");
    expect(helpText).toBeInTheDocument();
    expect(helpText).toHaveClass("text-gray-500");
  });

  it("handles value changes", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Select label="Choose option" options={mockOptions} onChange={handleChange} />);

    const input = screen.getByRole("combobox");
    await user.click(input);

    // Wait for options to appear and click one
    await waitFor(() => {
      const option = screen.getByText("Option 2");
      expect(option).toBeInTheDocument();
    });

    await user.click(screen.getByText("Option 2"));
    expect(handleChange).toHaveBeenCalledWith("option2");
  });

  it("is disabled when isDisabled prop is true", () => {
    render(<Select label="Choose option" options={mockOptions} isDisabled />);

    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("aria-readonly", "true");
  });

  it("shows required indicator when required prop is true", () => {
    render(<Select label="Choose option" options={mockOptions} required />);

    const label = screen.getByText(/choose option/i);
    expect(label).toHaveTextContent("*"); // Required indicator
  });

  it("applies custom className to container", () => {
    const { container } = render(<Select label="Choose option" options={mockOptions} className="custom-select" />);

    const selectContainer = container.querySelector(".react-select-container");
    expect(selectContainer).toHaveClass("custom-select");
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<Select label="Choose option" options={mockOptions} ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });

  it("displays selected value", () => {
    render(<Select label="Choose option" options={mockOptions} value="option2" />);

    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("handles controlled value changes", () => {
    const { rerender } = render(<Select label="Choose option" options={mockOptions} value="option1" />);

    expect(screen.getByText("Option 1")).toBeInTheDocument();

    rerender(<Select label="Choose option" options={mockOptions} value="option3" />);
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  it("opens dropdown when clicked", async () => {
    const user = userEvent.setup();

    render(<Select label="Choose option" options={mockOptions} />);

    const input = screen.getByRole("combobox");
    await user.click(input);

    // Check that options appear
    await waitFor(() => {
      mockOptions.forEach((option) => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });
  });

  it("supports searchable functionality", async () => {
    const user = userEvent.setup();

    render(<Select label="Choose option" options={mockOptions} isSearchable />);

    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.type(input, "Option 2");

    // Should filter options based on search
    await waitFor(() => {
      expect(screen.getByText("Option 2")).toBeInTheDocument();
    });
  });

  it("supports clearable functionality", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    const { container } = render(
      <Select label="Choose option" options={mockOptions} value="option1" onChange={handleChange} isClearable />
    );

    // Find and click the clear button (X) by its CSS class
    const clearButton = container.querySelector(".react-select__clear-indicator");
    expect(clearButton).toBeInTheDocument();

    await user.click(clearButton!);
    expect(handleChange).toHaveBeenCalledWith("");
  });

  it("shows error message with proper accessibility", () => {
    render(<Select label="Choose option" options={mockOptions} error="Selection is required" />);

    const errorMessage = screen.getByRole("alert");
    expect(errorMessage).toHaveTextContent("Selection is required");
    expect(errorMessage).toHaveAttribute("aria-live", "polite");
  });

  it("supports full width styling", () => {
    const { container } = render(<Select label="Choose option" options={mockOptions} fullWidth />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("w-full");
  });

  it("handles empty options array", () => {
    render(<Select label="Choose option" options={[]} />);

    const input = screen.getByRole("combobox");
    expect(input).toBeInTheDocument();
  });

  it("generates unique IDs when not provided", () => {
    const { container: container1 } = render(<Select label="Choose option 1" options={mockOptions} />);
    const { container: container2 } = render(<Select label="Choose option 2" options={mockOptions} />);

    const input1 = container1.querySelector('input[role="combobox"]');
    const input2 = container2.querySelector('input[role="combobox"]');

    expect(input1?.id).toBeTruthy();
    expect(input2?.id).toBeTruthy();
    expect(input1?.id).not.toBe(input2?.id);
  });

  it("uses provided ID when given", () => {
    render(<Select label="Choose option" options={mockOptions} id="custom-select-id" />);

    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("id", "custom-select-id");
  });

  it("handles name attribute correctly", () => {
    const { container } = render(<Select label="Choose option" options={mockOptions} name="test-select" />);

    // React-select creates a hidden input with the name attribute
    const hiddenInput = container.querySelector('input[name="test-select"]');
    expect(hiddenInput).toBeInTheDocument();
  });
});
