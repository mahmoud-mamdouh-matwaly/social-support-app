import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Textarea from "../Textarea";

describe("Textarea Component", () => {
  it("renders with basic props", () => {
    render(<Textarea label="Description" placeholder="Enter description" id="description" />);

    const textarea = screen.getByLabelText(/description/i);
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute("placeholder", "Enter description");
  });

  it("shows error state", () => {
    render(<Textarea label="Description" error="Description is required" name="description" id="description" />);

    const textarea = screen.getByLabelText(/description/i);
    const errorMessage = screen.getByText("Description is required");

    expect(textarea).toHaveClass("border-red-300");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("text-red-600");
  });

  it("shows character count when maxLength is provided", () => {
    render(<Textarea label="Bio" maxLength={100} showCharCount value="Hello world" id="bio" />);

    const charCount = screen.getByText("11/100");
    expect(charCount).toBeInTheDocument();
    expect(charCount).toHaveClass("text-gray-500");
  });

  it("handles value changes", () => {
    const handleChange = vi.fn();
    render(<Textarea label="Description" onChange={handleChange} id="description" />);

    const textarea = screen.getByLabelText(/description/i);
    fireEvent.change(textarea, { target: { value: "New description" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalled();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Textarea label="Description" disabled id="description" />);
    const textarea = screen.getByLabelText(/description/i);

    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass("bg-gray-50", "cursor-not-allowed");
  });

  it("is required when required prop is true", () => {
    render(<Textarea label="Description" required id="description" />);
    const textarea = screen.getByLabelText(/description/i);
    const label = screen.getByText(/description/i);

    expect(textarea).toBeRequired();
    expect(label).toHaveTextContent("*"); // Required indicator
  });

  it("applies custom rows", () => {
    render(<Textarea label="Description" rows={10} id="description" />);
    const textarea = screen.getByLabelText(/description/i);
    expect(textarea).toHaveAttribute("rows", "10");
  });

  it("shows character count when maxLength is provided", () => {
    render(<Textarea label="Description" maxLength={100} showCharCount value="Hello world" id="description" />);

    const charCount = screen.getByText("11/100");
    expect(charCount).toBeInTheDocument();
    expect(charCount).toHaveClass("text-gray-500");
  });

  it("shows character count when approaching limit", () => {
    render(<Textarea label="Description" maxLength={10} showCharCount value="Hello wor" id="description" />); // 9 chars

    const charCount = screen.getByText("9/10");
    expect(charCount).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Textarea label="Description" className="custom-textarea" id="description" />);
    const textarea = screen.getByLabelText(/description/i);
    expect(textarea.parentElement).toHaveClass("custom-textarea");
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<Textarea label="Description" ref={ref} id="description" />);
    expect(ref).toHaveBeenCalled();
  });

  it("handles focus and blur events", () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();

    render(<Textarea label="Description" onFocus={handleFocus} onBlur={handleBlur} id="description" />);

    const textarea = screen.getByLabelText(/description/i);

    fireEvent.focus(textarea);
    expect(handleFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(textarea);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });
});
