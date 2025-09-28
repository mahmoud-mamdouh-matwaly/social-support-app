import { forwardRef, InputHTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  required?: boolean;
  numbersOnly?: boolean;
  phoneFormat?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      required = false,
      numbersOnly = false,
      phoneFormat = false,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === "ar";

    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn("flex flex-col", fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium text-gray-700 mb-1",
              isRTL ? "text-right" : "text-left",
              error && "text-red-600"
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={cn(
            "px-3 py-2 border border-gray-300 rounded-md shadow-sm",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "transition-colors duration-200",
            "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
            isRTL ? "text-right" : "text-left",
            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
            fullWidth && "w-full",
            className
          )}
          dir={isRTL ? "rtl" : "ltr"}
          inputMode={numbersOnly ? "numeric" : phoneFormat ? "tel" : undefined}
          pattern={numbersOnly ? "[0-9]*" : undefined}
          onKeyDown={
            numbersOnly
              ? (e) => {
                  // Allow: backspace, delete, tab, escape, enter, home, end, left, right
                  if (
                    [8, 9, 27, 13, 46, 35, 36, 37, 39].indexOf(e.keyCode) !== -1 ||
                    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
                    (e.keyCode === 65 && e.ctrlKey === true) ||
                    (e.keyCode === 67 && e.ctrlKey === true) ||
                    (e.keyCode === 86 && e.ctrlKey === true) ||
                    (e.keyCode === 88 && e.ctrlKey === true) ||
                    (e.keyCode === 90 && e.ctrlKey === true)
                  ) {
                    return;
                  }
                  // Ensure that it is a number and stop the keypress
                  if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                  }
                }
              : undefined
          }
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined}
          aria-required={required}
          {...props}
        />

        {error && (
          <p
            className={cn("text-sm text-red-600 mt-1", isRTL ? "text-right" : "text-left")}
            id={`${inputId}-error`}
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className={cn("text-sm text-gray-500 mt-1", isRTL ? "text-right" : "text-left")} id={`${inputId}-help`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
