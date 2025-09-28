import { useMemo } from "react";
import countryList from "react-select-country-list";
import Select, { SelectOption } from "./Select";

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
  // Get countries from react-select-country-list and convert to our SelectOption format
  const countries = useMemo((): SelectOption[] => countryList().getData(), []);

  return (
    <Select
      label={label}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      id={id}
      className={className}
      options={countries}
      isSearchable={true}
      isClearable={true}
      {...props}
    />
  );
};

export default CountrySelect;
