import { CheckCircle, Home, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ApplicationSummary from "../components/ApplicationSummary";
import Button from "../components/Button";
import { PathConstants } from "../constants/paths";
import { getApplicationFromLocalStorage } from "../utils/localStorage";

const Success = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  // Get application data from localStorage
  const submittedData = getApplicationFromLocalStorage();
  const applicationId = submittedData?.applicationId || `APP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const handleBackToHome = () => {
    navigate(PathConstants.HOME);
  };

  const handleContactSupport = () => {
    window.location.href = "mailto:support@financialassistance.gov?subject=Application Inquiry - " + applicationId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Main Success Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center" dir={isRTL ? "rtl" : "ltr"}>
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          {/* Success Message */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t("success.title")}</h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">{t("success.message")}</p>

            {/* Application ID */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                {t("success.applicationId")}
              </div>
              <div className="text-lg font-mono font-bold text-gray-900" dir="ltr">
                {applicationId}
              </div>
            </div>

            <p className="text-sm text-gray-500">{t("success.nextSteps")}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            {/* Primary Action - Back to Home */}
            <Button
              onClick={handleBackToHome}
              variant="primary"
              icon={<Home className="h-4 w-4" />}
              iconPosition={isRTL ? "right" : "left"}
              className="w-full sm:w-auto"
            >
              {t("success.backToHome")}
            </Button>

            {/* Secondary Action - Contact Support */}
            <Button
              onClick={handleContactSupport}
              variant="outline"
              icon={<Mail className="h-4 w-4" />}
              iconPosition={isRTL ? "right" : "left"}
              className="w-full sm:w-auto"
            >
              {t("success.contactSupport")}
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <p>{t("success.referenceNote")}</p>
              <p>{t("success.processingTime")}</p>
            </div>
          </div>
        </div>

        {/* Submitted Data Summary */}
        <ApplicationSummary />
      </div>
    </div>
  );
};

export default Success;
