// Common types used across the application

export type Size = "sm" | "md" | "lg";
export type Variant = "primary" | "secondary" | "outline" | "ghost";

// Button specific types
export type BaseButtonProps = {
  size?: Size;
  variant?: Variant;
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
};

// Common component props
export type ComponentProps = {
  className?: string;
  children?: React.ReactNode;
};
