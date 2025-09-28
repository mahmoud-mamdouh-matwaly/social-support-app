import { Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "./Button";

type SaveContinueLaterButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
};

const SaveContinueLaterButton = ({ onClick, disabled = false, className = "", ariaLabel }: SaveContinueLaterButtonProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const buttonText = t("common.actions.saveAndContinueLater");
  const defaultAriaLabel = ariaLabel || buttonText;

  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      icon={<Save />}
      iconPosition={isRTL ? "right" : "left"}
      disabled={disabled}
      className={`w-full sm:w-auto ${className}`}
      aria-label={defaultAriaLabel}
    >
      {buttonText}
    </Button>
  );
};

export default SaveContinueLaterButton;
