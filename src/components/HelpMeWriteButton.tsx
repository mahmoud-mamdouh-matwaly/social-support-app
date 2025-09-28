import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "./Button";

type HelpMeWriteButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const HelpMeWriteButton = ({
  onClick,
  disabled = false,
  loading = false,
  className = "",
  size = "sm",
}: HelpMeWriteButtonProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <Button
      type="button"
      variant="secondary"
      size={size}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      loadingText={t("aiSuggestion.generating")}
      icon={<Sparkles className="h-4 w-4" />}
      iconPosition={isRTL ? "right" : "left"}
      className={`whitespace-nowrap ${className}`}
      aria-label={t("aiSuggestion.helpMeWrite")}
    >
      {t("aiSuggestion.helpMeWrite")}
    </Button>
  );
};

export default HelpMeWriteButton;
