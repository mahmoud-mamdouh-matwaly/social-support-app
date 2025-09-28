import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import Select, { Props as ReactSelectProps, SelectInstance, SingleValue, StylesConfig } from "react-select";
import { cn } from "../utils/cn";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = Omit<ReactSelectProps<SelectOption, false>, "options" | "value" | "onChange"> & {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  id?: string;
  className?: string;
  isSearchable?: boolean;
  isClearable?: boolean;
};

const SelectComponent = forwardRef<SelectInstance<SelectOption, false>, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      options,
      placeholder = "Select an option",
      required = false,
      value,
      onChange,
      name,
      id,
      className,
      isDisabled = false,
      isSearchable = false,
      isClearable = false,
      ...props
    },
    ref
  ) => {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === "ar";

    const selectId = id || `react-select-${Math.random().toString(36).substr(2, 9)}`;

    // Find the selected option object
    const selectedOption = options.find((option: SelectOption) => option.value === value);

    const customStyles: StylesConfig<SelectOption, false> = {
      control: (provided, state) => ({
        ...provided,
        minHeight: "40px",
        border: error ? "1px solid #ef4444" : "1px solid #d1d5db",
        borderRadius: "6px",
        boxShadow: state.isFocused
          ? error
            ? "0 0 0 2px rgba(239, 68, 68, 0.2)"
            : "0 0 0 2px rgba(59, 130, 246, 0.2)"
          : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "&:hover": {
          borderColor: error ? "#ef4444" : "#9ca3af",
        },
        direction: isRTL ? "rtl" : "ltr",
        backgroundColor: isDisabled ? "#f9fafb" : "white",
        cursor: isDisabled ? "not-allowed" : "default",
      }),
      placeholder: (provided) => ({
        ...provided,
        color: "#9ca3af",
        textAlign: isRTL ? "right" : "left",
      }),
      singleValue: (provided) => ({
        ...provided,
        textAlign: isRTL ? "right" : "left",
        color: isDisabled ? "#6b7280" : "#374151",
      }),
      menu: (provided) => ({
        ...provided,
        zIndex: 9999,
      }),
      option: (provided, state) => ({
        ...provided,
        textAlign: isRTL ? "right" : "left",
        backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#eff6ff" : "white",
        color: state.isSelected ? "white" : "#374151",
        "&:active": {
          backgroundColor: "#dbeafe",
        },
        cursor: "pointer",
      }),
      dropdownIndicator: (provided) => ({
        ...provided,
        color: "#6b7280",
        "&:hover": {
          color: "#374151",
        },
      }),
      indicatorSeparator: () => ({
        display: "none",
      }),
    };

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

        <Select
          ref={ref}
          inputId={selectId}
          name={name}
          options={options}
          value={selectedOption || null}
          onChange={(selectedOption: SingleValue<SelectOption>) => {
            onChange?.(selectedOption?.value || "");
          }}
          placeholder={placeholder}
          isSearchable={isSearchable}
          isClearable={isClearable}
          isDisabled={isDisabled}
          styles={customStyles}
          className={cn("react-select-container", className)}
          classNamePrefix="react-select"
          aria-label={label}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-help` : undefined}
          {...props}
        />

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

SelectComponent.displayName = "Select";

export default SelectComponent;
