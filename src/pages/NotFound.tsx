import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { PathConstants } from "../constants/paths";

const NotFound = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  const handleGoHome = () => {
    navigate(PathConstants.HOME);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center" dir={isRTL ? "rtl" : "ltr"}>
        {/* 404 Icon */}
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-orange-100">
          <AlertTriangle className="h-12 w-12 text-orange-600" />
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-gray-900">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700">{t("notFound.title")}</h2>
          </div>

          <p className="text-gray-600 text-base leading-relaxed max-w-sm mx-auto">{t("notFound.message")}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
          {/* Primary Action - Go Home */}
          <Button
            onClick={handleGoHome}
            variant="primary"
            icon={<Home className="h-4 w-4" />}
            iconPosition={isRTL ? "right" : "left"}
            className="w-full sm:w-auto"
          >
            {t("notFound.goHome")}
          </Button>

          {/* Secondary Action - Go Back */}
          <Button
            onClick={handleGoBack}
            variant="outline"
            icon={<ArrowLeft className="h-4 w-4" />}
            iconPosition={isRTL ? "right" : "left"}
            className="w-full sm:w-auto"
          >
            {t("notFound.goBack")}
          </Button>
        </div>

        {/* Additional Help */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">{t("notFound.helpText")}</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
