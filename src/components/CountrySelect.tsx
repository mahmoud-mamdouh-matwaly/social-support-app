import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Select, { SingleValue, StylesConfig } from "react-select";
import countryList from "react-select-country-list";
import { cn } from "../utils/cn";

type CountryOption = {
  value: string;
  label: string;
};

type CountrySelectProps = {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  id?: string;
  className?: string;
};

const CountrySelect = ({
  label,
  error,
  helperText,
  fullWidth = false,
  required = false,
  placeholder,
  value,
  onChange,
  name,
  id,
  className,
  ...props
}: CountrySelectProps) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const selectId = id || `country-select-${Math.random().toString(36).substr(2, 9)}`;

  // Get countries from react-select-country-list
  const countries = useMemo((): CountryOption[] => countryList().getData(), []);

  // Find the selected country object
  const selectedCountry = countries.find((country: CountryOption) => country.value === value);

  const customStyles: StylesConfig<CountryOption, false> = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "40px",
      border: error ? "1px solid #ef4444" : "1px solid #d1d5db",
      borderRadius: "6px",
      boxShadow: state.isFocused
        ? error
          ? "0 0 0 2px rgba(239, 68, 68, 0.2)"
          : "0 0 0 2px rgba(59, 130, 246, 0.2)"
        : "none",
      "&:hover": {
        borderColor: error ? "#ef4444" : "#9ca3af",
      },
      direction: isRTL ? "rtl" : "ltr",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
      textAlign: isRTL ? "right" : "left",
    }),
    singleValue: (provided) => ({
      ...provided,
      textAlign: isRTL ? "right" : "left",
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
        inputId={selectId}
        name={name}
        options={countries}
        value={selectedCountry || null}
        onChange={(selectedOption: SingleValue<CountryOption>) => {
          onChange?.(selectedOption?.value || "");
        }}
        placeholder={placeholder}
        isSearchable
        isClearable
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
};

export default CountrySelect;
