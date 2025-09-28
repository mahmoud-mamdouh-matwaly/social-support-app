import { ChevronDown } from "lucide-react";
import { forwardRef, SelectHTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../utils/cn";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      options,
      placeholder = "Select an option",
      required = false,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === "ar";

    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn("flex flex-col", fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={selectId}
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

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "px-3 py-2 border border-gray-300 rounded-md shadow-sm",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "transition-colors duration-200",
              "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
              "appearance-none bg-white",
              isRTL ? "text-right pr-10 pl-3" : "text-left pl-3 pr-10",
              error && "border-red-500 focus:ring-red-500 focus:border-red-500",
              fullWidth && "w-full",
              className
            )}
            dir={isRTL ? "rtl" : "ltr"}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-help` : undefined}
            aria-required={required}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div
            className={cn(
              "absolute inset-y-0 flex items-center pointer-events-none",
              isRTL ? "left-0 pl-3" : "right-0 pr-3"
            )}
          >
            <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </div>
        </div>

        {error && (
          <p
            className={cn("text-sm text-red-600 mt-1", isRTL ? "text-right" : "text-left")}
            id={`${selectId}-error`}
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className={cn("text-sm text-gray-500 mt-1", isRTL ? "text-right" : "text-left")} id={`${selectId}-help`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
