import { Building, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { PathConstants } from "../constants/paths";

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLanguage);
  };

  const handleLogoClick = () => {
    navigate(PathConstants.HOME);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Logo and Title */}
          <div className="flex items-center min-w-0 flex-1">
            <button
              onClick={handleLogoClick}
              className={`flex items-center ${
                i18n.language === "ar" ? "space-x-reverse space-x-3" : "space-x-3"
              } hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700 rounded-lg p-2 -ml-2`}
              aria-label="Go to home page"
            >
              <div className="flex-shrink-0" role="img" aria-label="Social Support Portal logo">
                <Building className="h-6 w-6 sm:h-8 sm:w-8 text-blue-200" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold truncate text-left" id="site-title">
                  {t("header.title")}
                </h1>
                <p
                  className="text-xs sm:text-sm lg:text-base text-blue-200 truncate hidden sm:block text-left"
                  role="doc-subtitle"
                >
                  {t("header.subtitle")}
                </p>
              </div>
            </button>
          </div>

          {/* User Actions */}
          <div className="flex items-center flex-shrink-0">
            {/* Language Toggle */}
            <Button
              onClick={toggleLanguage}
              variant="outline"
              size="sm"
              icon={<Globe className="h-4 w-4" />}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 focus:bg-white/20 focus:ring-white/50 h-9 px-3"
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
