import { Building, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../components/Button";

const Header = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLanguage);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo and Title */}
          <div className={`flex items-center ${i18n.language === "ar" ? "space-x-reverse space-x-3" : "space-x-3"}`}>
            <div className="flex-shrink-0" role="img" aria-label="Social Support Portal logo">
              <Building className="h-6 w-6 sm:h-8 sm:w-8 text-blue-200" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold truncate" id="site-title">
                {t("header.title")}
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-blue-200 truncate hidden sm:block" role="doc-subtitle">
                {t("header.subtitle")}
              </p>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center">
            {/* Language Toggle */}
            <Button
              onClick={toggleLanguage}
              variant="primary"
              size="sm"
              icon={<Globe />}
              aria-label={`${t("header.language")} - ${
                i18n.language === "en" ? t("accessibility.switchToArabic") : t("accessibility.switchToEnglish")
              }`}
              title={i18n.language === "en" ? t("accessibility.switchToArabic") : t("accessibility.switchToEnglish")}
            >
              {t("header.language")}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
