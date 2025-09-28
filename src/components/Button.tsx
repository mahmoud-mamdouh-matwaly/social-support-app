import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../utils/cn";
// Button variants using CVA for better maintainability
const buttonVariants = cva(
  // Base styles
  [
    "inline-flex items-center justify-center font-medium rounded-lg",
    "transition-all duration-200 ease-in-out",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    "select-none touch-manipulation",
    "active:scale-[0.98]",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-blue-700 text-white shadow-sm",
          "hover:bg-blue-600 hover:shadow-md",
          "focus:bg-blue-600 focus:ring-blue-300 focus:ring-offset-blue-800",
          "active:bg-blue-800",
        ],
        secondary: [
          "bg-gray-600 text-white shadow-sm",
          "hover:bg-gray-500 hover:shadow-md",
          "focus:bg-gray-500 focus:ring-gray-300 focus:ring-offset-gray-800",
          "active:bg-gray-700",
        ],
        outline: [
          "border-2 border-blue-700 text-blue-700 bg-white shadow-sm",
          "hover:bg-blue-50 hover:border-blue-600 hover:shadow-md",
          "focus:bg-blue-50 focus:ring-blue-300 focus:ring-offset-white",
          "active:bg-blue-100",
        ],
        ghost: [
          "text-blue-700 bg-transparent",
          "hover:bg-blue-50",
          "focus:bg-blue-50 focus:ring-blue-300 focus:ring-offset-white",
          "active:bg-blue-100",
        ],
      },
      size: {
        sm: "h-8 px-3 text-sm gap-1.5 min-w-[2rem]",
        md: "h-10 px-4 text-sm gap-2 min-w-[2.5rem]",
        lg: "h-12 px-6 text-base gap-2.5 min-w-[3rem]",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  loadingText?: string;
  asChild?: boolean;
}

// Loading spinner component
const LoadingSpinner = ({ size }: { size: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <svg className={cn("animate-spin flex-shrink-0", sizeClasses[size])} fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// Icon wrapper component
const IconWrapper = ({ children, size }: { children: ReactNode; size: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <span className={cn("flex-shrink-0", sizeClasses[size])} aria-hidden="true">
      {children}
    </span>
  );
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant,
      size,
      fullWidth,
      icon,
      iconPosition = "left",
      loading = false,
      loadingText,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === "ar";

    // Determine if button should be disabled
    const isDisabled = disabled || loading;

    // Generate button classes using CVA
    const buttonClasses = cn(
      buttonVariants({ variant, size, fullWidth }),
      // RTL spacing adjustments
      icon && isRTL && "flex-row-reverse",
      className
    );

    // Render icon based on position
    const renderIcon = (position: "left" | "right") => {
      if (!icon || iconPosition !== position || loading) return null;

      return <IconWrapper size={size || "md"}>{icon}</IconWrapper>;
    };

    // Render button content
    const renderContent = () => {
      if (loading) {
        return (
          <>
            <LoadingSpinner size={size || "md"} />
            <span className="truncate">{loadingText || children}</span>
          </>
        );
      }

      return (
        <>
          {renderIcon("left")}
          <span className="truncate">{children}</span>
          {renderIcon("right")}
        </>
      );
    };

    return (
      <button ref={ref} className={buttonClasses} disabled={isDisabled} aria-disabled={isDisabled} {...props}>
        {renderContent()}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
