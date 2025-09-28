import { fireEvent, render, screen } from "@testing-library/react";
import { Home } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import Button from "../Button";

describe("Button Component", () => {
  it("renders with default props", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-blue-700", "text-white"); // primary variant
  });

  it("renders with different variants", () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-blue-700");

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-gray-600");

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button")).toHaveClass("border-2", "border-blue-700", "bg-white");

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-transparent");
  });

  it("renders with different sizes", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-8", "px-3", "text-sm");

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-10", "px-4", "text-sm");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-12", "px-6", "text-base");
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders with icon on left", () => {
    render(
      <Button icon={<Home data-testid="home-icon" />} iconPosition="left">
        Home
      </Button>
    );

    const button = screen.getByRole("button");
    const icon = screen.getByTestId("home-icon");

    expect(button).toContainElement(icon);
    expect(button).toHaveTextContent("Home");
  });

  it("renders with icon on right", () => {
    render(
      <Button icon={<Home data-testid="home-icon" />} iconPosition="right">
        Home
      </Button>
    );

    const button = screen.getByRole("button");
    const icon = screen.getByTestId("home-icon");

    expect(button).toContainElement(icon);
    expect(button).toHaveTextContent("Home");
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:opacity-50", "disabled:cursor-not-allowed");
  });

  it("shows loading state", () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:opacity-50");
    // Check for loading spinner by looking for the SVG with animate-spin class
    const spinner = button.querySelector("svg.animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Ref test</Button>);
    expect(ref).toHaveBeenCalled();
  });

  it("supports full width", () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole("button")).toHaveClass("w-full");
  });
});
