import { forwardRef } from "react";
import { useTranslation } from "react-i18next";

type TextareaProps = {
  label: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      placeholder,
      error,
      required = false,
      fullWidth = false,
      rows = 4,
      maxLength,
      showCharCount = false,
      className = "",
      value = "",
      ...props
    },
    ref
  ) => {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === "ar";
    const charCount = typeof value === "string" ? value.length : 0;

    return (
      <div className={`${fullWidth ? "w-full" : ""} ${className}`}>
        {/* Label */}
        <label
          htmlFor={props.id || props.name}
          className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? "text-right" : "text-left"}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {/* Textarea */}
        <textarea
          ref={ref}
          rows={rows}
          maxLength={maxLength}
          placeholder={placeholder}
          className={`
            block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
            focus:border-blue-500 transition-colors duration-200 resize-vertical
            ${isRTL ? "text-right" : "text-left"}
            ${error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""}
            ${props.disabled ? "bg-gray-50 cursor-not-allowed" : ""}
          `}
          dir={isRTL ? "rtl" : "ltr"}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${props.name}-error` : undefined}
          aria-required={required}
          value={value}
          {...props}
        />

        {/* Character Count */}
        {showCharCount && maxLength && (
          <div className={`text-xs text-gray-500 mt-1 ${isRTL ? "text-left" : "text-right"}`}>
            {charCount}/{maxLength}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <p
            id={`${props.name}-error`}
            className={`mt-1 text-sm text-red-600 ${isRTL ? "text-right" : "text-left"}`}
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
