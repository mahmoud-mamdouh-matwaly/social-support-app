import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Input from "../Input";

describe("Input Component", () => {
  it("renders with basic props", () => {
    render(<Input label="Name" placeholder="Enter your name" />);

    const input = screen.getByLabelText(/name/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Enter your name");
  });

  it("renders with different types", () => {
    const { rerender } = render(<Input label="Email" type="email" />);
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("type", "email");

    rerender(<Input label="Password" type="password" />);
    expect(screen.getByLabelText(/password/i)).toHaveAttribute("type", "password");

    rerender(<Input label="Number" type="number" />);
    expect(screen.getByLabelText(/number/i)).toHaveAttribute("type", "number");
  });

  it("shows error state", () => {
    render(<Input label="Name" error="Name is required" />);

    const input = screen.getByLabelText(/name/i);
    const errorMessage = screen.getByText("Name is required");

    expect(input).toHaveClass("border-red-500");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("text-red-600");
  });

  it("shows help text", () => {
    render(<Input label="Password" helperText="Must be at least 8 characters" />);

    const helpText = screen.getByText("Must be at least 8 characters");
    expect(helpText).toBeInTheDocument();
    expect(helpText).toHaveClass("text-gray-500");
  });

  it("applies numbersOnly prop", () => {
    render(<Input label="Age" numbersOnly />);
    const input = screen.getByLabelText(/age/i);
    expect(input).toHaveAttribute("inputMode", "numeric");
    expect(input).toHaveAttribute("pattern", "[0-9]*");
  });

  it("handles value changes", () => {
    const handleChange = vi.fn();
    render(<Input label="Name" onChange={handleChange} />);

    const input = screen.getByLabelText(/name/i);
    fireEvent.change(input, { target: { value: "John Doe" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: "John Doe" }),
      })
    );
  });

  it("is disabled when disabled prop is true", () => {
    render(<Input label="Name" disabled />);
    const input = screen.getByLabelText(/name/i);

    expect(input).toBeDisabled();
    expect(input).toHaveClass("disabled:bg-gray-50", "disabled:cursor-not-allowed");
  });

  it("is required when required prop is true", () => {
    render(<Input label="Name" required />);
    const input = screen.getByLabelText(/name/i);
    const label = screen.getByText(/name/i);

    expect(input).toBeRequired();
    expect(label).toHaveTextContent("*"); // Required indicator
  });

  it("applies custom className", () => {
    render(<Input label="Name" className="custom-input" />);
    const input = screen.getByLabelText(/name/i);
    expect(input).toHaveClass("custom-input");
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<Input label="Name" ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it("shows error text but not helper text when both provided", () => {
    render(<Input label="Password" error="Password is too short" helperText="Must be at least 8 characters" />);

    expect(screen.getByText("Password is too short")).toBeInTheDocument();
    // Helper text should not be shown when there's an error (based on Input component logic)
    expect(screen.queryByText("Must be at least 8 characters")).not.toBeInTheDocument();
  });

  it("handles focus and blur events", () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();

    render(<Input label="Name" onFocus={handleFocus} onBlur={handleBlur} />);

    const input = screen.getByLabelText(/name/i);

    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });
});
