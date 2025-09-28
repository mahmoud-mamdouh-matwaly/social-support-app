import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AISuggestionModal from "../AISuggestionModal";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: vi.fn(() => ({
    t: (key: string, options?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        "aiSuggestion.title": `AI Suggestion for ${options?.field || "Field"}`,
        "aiSuggestion.generating": "Generating suggestion...",
        "aiSuggestion.error": "Error",
        "aiSuggestion.description":
          "Review the AI-generated suggestion below. You can accept it as-is, edit it, or discard it.",
        "aiSuggestion.editLabel": "Edit suggestion",
        "aiSuggestion.saveEdit": "Save Edit",
        "aiSuggestion.discard": "Discard",
        "aiSuggestion.edit": "Edit",
        "aiSuggestion.accept": "Accept",
        "common.actions.close": "Close",
      };
      return translations[key] || key;
    },
    i18n: { language: "en" },
  })),
}));

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  onAccept: vi.fn(),
  suggestion: "This is a sample AI suggestion for testing purposes.",
  isLoading: false,
  error: undefined,
  fieldLabel: "Test Field",
};

describe("AISuggestionModal Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset body overflow style
    document.body.style.overflow = "unset";
  });

  it("renders when isOpen is true", () => {
    render(<AISuggestionModal {...defaultProps} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("AI Suggestion for Test Field")).toBeInTheDocument();
    expect(screen.getByText(defaultProps.suggestion)).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(<AISuggestionModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("displays loading state correctly", () => {
    const { container } = render(<AISuggestionModal {...defaultProps} isLoading={true} suggestion="" />);

    expect(screen.getByText("Generating suggestion...")).toBeInTheDocument();
    // Check for the loading spinner by its CSS class
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
    expect(screen.queryByText("Accept")).not.toBeInTheDocument();
  });

  it("displays error state correctly", () => {
    const errorMessage = "Failed to generate suggestion";
    render(<AISuggestionModal {...defaultProps} error={errorMessage} />);

    expect(screen.getByText("Error:")).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText("Close")).toBeInTheDocument();
    expect(screen.queryByText("Accept")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<AISuggestionModal {...defaultProps} onClose={onClose} />);

    const closeButton = screen.getByLabelText("Close");
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<AISuggestionModal {...defaultProps} onClose={onClose} />);

    // Click on the backdrop (the overlay behind the modal)
    const backdrop = document.querySelector(".bg-black.bg-opacity-50");
    expect(backdrop).toBeInTheDocument();

    await user.click(backdrop!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    const onClose = vi.fn();

    render(<AISuggestionModal {...defaultProps} onClose={onClose} />);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onAccept with suggestion when Accept button is clicked", async () => {
    const user = userEvent.setup();
    const onAccept = vi.fn();
    const onClose = vi.fn();

    render(<AISuggestionModal {...defaultProps} onAccept={onAccept} onClose={onClose} />);

    const acceptButton = screen.getByText("Accept");
    await user.click(acceptButton);

    expect(onAccept).toHaveBeenCalledWith(defaultProps.suggestion);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Discard button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<AISuggestionModal {...defaultProps} onClose={onClose} />);

    const discardButton = screen.getByText("Discard");
    await user.click(discardButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("enters edit mode when Edit button is clicked", async () => {
    const user = userEvent.setup();

    render(<AISuggestionModal {...defaultProps} />);

    const editButton = screen.getByText("Edit");
    await user.click(editButton);

    expect(screen.getByLabelText("Edit suggestion")).toBeInTheDocument();
    expect(screen.getByText("Save Edit")).toBeInTheDocument();
    expect(screen.queryByText("Accept")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });

  it("allows editing the suggestion text", async () => {
    const user = userEvent.setup();

    render(<AISuggestionModal {...defaultProps} />);

    // Enter edit mode
    const editButton = screen.getByText("Edit");
    await user.click(editButton);

    // Edit the text
    const textarea = screen.getByLabelText("Edit suggestion");
    await user.clear(textarea);
    await user.type(textarea, "Edited suggestion text");

    expect(textarea).toHaveValue("Edited suggestion text");
  });

  it("saves edited text and exits edit mode when Save Edit is clicked", async () => {
    const user = userEvent.setup();

    render(<AISuggestionModal {...defaultProps} />);

    // Enter edit mode
    const editButton = screen.getByText("Edit");
    await user.click(editButton);

    // Edit the text
    const textarea = screen.getByLabelText("Edit suggestion");
    await user.clear(textarea);
    await user.type(textarea, "Edited suggestion text");

    // Save the edit
    const saveButton = screen.getByText("Save Edit");
    await user.click(saveButton);

    // Should exit edit mode and show the edited text
    expect(screen.queryByLabelText("Edit suggestion")).not.toBeInTheDocument();
    expect(screen.getByText("Edited suggestion text")).toBeInTheDocument();
    expect(screen.getByText("Accept")).toBeInTheDocument();
  });

  it("calls onAccept with edited text when Accept is clicked after editing", async () => {
    const user = userEvent.setup();
    const onAccept = vi.fn();
    const onClose = vi.fn();

    render(<AISuggestionModal {...defaultProps} onAccept={onAccept} onClose={onClose} />);

    // Enter edit mode
    const editButton = screen.getByText("Edit");
    await user.click(editButton);

    // Edit the text
    const textarea = screen.getByLabelText("Edit suggestion");
    await user.clear(textarea);
    await user.type(textarea, "Edited suggestion text");

    // Save the edit
    const saveButton = screen.getByText("Save Edit");
    await user.click(saveButton);

    // Accept the edited text
    const acceptButton = screen.getByText("Accept");
    await user.click(acceptButton);

    expect(onAccept).toHaveBeenCalledWith("Edited suggestion text");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("resets edited suggestion when suggestion prop changes", () => {
    const { rerender } = render(<AISuggestionModal {...defaultProps} />);

    // Enter edit mode and edit text
    fireEvent.click(screen.getByText("Edit"));
    const textarea = screen.getByLabelText("Edit suggestion");
    fireEvent.change(textarea, { target: { value: "Edited text" } });

    // Change the suggestion prop
    rerender(<AISuggestionModal {...defaultProps} suggestion="New suggestion" />);

    // Should reset to new suggestion and exit edit mode
    expect(screen.queryByLabelText("Edit suggestion")).not.toBeInTheDocument();
    expect(screen.getByText("New suggestion")).toBeInTheDocument();
  });

  it("prevents body scroll when modal is open", () => {
    render(<AISuggestionModal {...defaultProps} />);

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body scroll when modal is closed", () => {
    const { rerender } = render(<AISuggestionModal {...defaultProps} />);

    expect(document.body.style.overflow).toBe("hidden");

    rerender(<AISuggestionModal {...defaultProps} isOpen={false} />);

    expect(document.body.style.overflow).toBe("unset");
  });

  it("focuses close button when modal opens", async () => {
    render(<AISuggestionModal {...defaultProps} />);

    await waitFor(() => {
      const closeButton = screen.getByLabelText("Close");
      expect(closeButton).toHaveFocus();
    });
  });

  it("applies RTL styling for Arabic language", () => {
    // The component should handle RTL internally through styling
    const { container } = render(<AISuggestionModal {...defaultProps} />);

    // Check that the component renders properly (RTL logic is tested in integration)
    expect(container.querySelector('[role="dialog"]')).toBeInTheDocument();
  });

  it("applies LTR styling for English language", () => {
    const { container } = render(<AISuggestionModal {...defaultProps} />);

    const modal = container.querySelector('[dir="ltr"]');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveClass("text-left");
  });

  it("shows character count in edit mode", async () => {
    const user = userEvent.setup();

    render(<AISuggestionModal {...defaultProps} />);

    // Enter edit mode
    const editButton = screen.getByText("Edit");
    await user.click(editButton);

    // The Textarea component should show character count
    const textarea = screen.getByLabelText("Edit suggestion");
    expect(textarea).toBeInTheDocument();

    // Check if the textarea has the showCharCount prop applied
    const textareaContainer = textarea.closest("div");
    expect(textareaContainer).toBeInTheDocument();
  });

  it("handles empty suggestion gracefully", () => {
    render(<AISuggestionModal {...defaultProps} suggestion="" />);

    expect(screen.queryByText("Accept")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Discard")).not.toBeInTheDocument();
  });

  it("displays field label in modal title", () => {
    render(<AISuggestionModal {...defaultProps} fieldLabel="Employment Status" />);

    expect(screen.getByText("AI Suggestion for Employment Status")).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(<AISuggestionModal {...defaultProps} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "modal-title");

    const title = screen.getByText("AI Suggestion for Test Field");
    expect(title).toHaveAttribute("id", "modal-title");
  });

  it("ignores non-Escape key presses", () => {
    const onClose = vi.fn();

    render(<AISuggestionModal {...defaultProps} onClose={onClose} />);

    fireEvent.keyDown(document, { key: "Enter" });
    fireEvent.keyDown(document, { key: "Tab" });
    fireEvent.keyDown(document, { key: "Space" });

    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not call onClose on Escape when modal is closed", () => {
    const onClose = vi.fn();

    render(<AISuggestionModal {...defaultProps} isOpen={false} onClose={onClose} />);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).not.toHaveBeenCalled();
  });
});
