import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* About Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">{t("header.title")}</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{t("footer.description")}</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-base font-medium text-white">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors duration-200">
                  {t("footer.howToApply")}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors duration-200">
                  {t("footer.eligibility")}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors duration-200">
                  {t("footer.faq")}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors duration-200">
                  {t("footer.contact")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-base font-medium text-white">{t("footer.contactUs")}</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>{t("footer.phone")}: +1 (555) 123-4567</p>
              <p>{t("footer.email")}: support@socialsupport.gov</p>
              <p className="text-xs text-gray-400 mt-3">{t("footer.businessHours")}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`mt-6 sm:mt-8 pt-6 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center ${
            i18n.language === "ar" ? "space-y-4 sm:space-y-0" : "space-y-4 sm:space-y-0"
          }`}
        >
          <p className="text-xs text-gray-400">
            © {currentYear} {t("header.title")}. {t("footer.allRightsReserved")}
          </p>
          <div className={`flex ${i18n.language === "ar" ? "space-x-reverse space-x-6" : "space-x-6"}`}>
            <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors duration-200">
              {t("footer.privacy")}
            </a>
            <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors duration-200">
              {t("footer.terms")}
            </a>
            <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors duration-200">
              {t("footer.accessibility")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
