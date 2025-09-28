import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* About Section */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-base sm:text-lg font-semibold text-white">{t("header.title")}</h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{t("footer.description")}</p>
          </div>

          {/* Quick Links */}
          <nav className="space-y-2 sm:space-y-3" aria-labelledby="footer-quick-links">
            <h4 id="footer-quick-links" className="text-sm sm:text-base font-medium text-white">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-1 sm:space-y-2" role="list">
              <li>
                <a
                  href="#apply"
                  className="text-xs sm:text-sm text-gray-300 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-800 rounded transition-colors duration-200"
                  aria-describedby="footer-quick-links"
                >
                  {t("footer.howToApply")}
                </a>
              </li>
              <li>
                <a
                  href="#eligibility"
                  className="text-xs sm:text-sm text-gray-300 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-800 rounded transition-colors duration-200"
                  aria-describedby="footer-quick-links"
                >
                  {t("footer.eligibility")}
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-xs sm:text-sm text-gray-300 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-800 rounded transition-colors duration-200"
                  aria-describedby="footer-quick-links"
                >
                  {t("footer.faq")}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-xs sm:text-sm text-gray-300 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-800 rounded transition-colors duration-200"
                  aria-describedby="footer-quick-links"
                >
                  {t("footer.contact")}
                </a>
              </li>
            </ul>
          </nav>

          {/* Contact Info */}
          <div className="space-y-2 sm:space-y-3" role="region" aria-labelledby="footer-contact">
            <h4 id="footer-contact" className="text-sm sm:text-base font-medium text-white">
              {t("footer.contactUs")}
            </h4>
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-300">
              <p>
                <span className="sr-only">{t("footer.phone")} number: </span>
                <a
                  href="tel:+15551234567"
                  className="hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-800 rounded transition-colors duration-200"
                  aria-label={`${t("footer.phone")} +1 (555) 123-4567`}
                >
                  {t("footer.phone")}: +1 (555) 123-4567
                </a>
              </p>
              <p>
                <span className="sr-only">{t("footer.email")} address: </span>
                <a
                  href="mailto:support@socialsupport.gov"
                  className="hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-800 rounded transition-colors duration-200"
                  aria-label={`${t("footer.email")} support@socialsupport.gov`}
                >
                  {t("footer.email")}: support@socialsupport.gov
                </a>
              </p>
              <p className="text-xs text-gray-400 mt-3" role="note">
                <span className="sr-only">Business hours: </span>
                {t("footer.businessHours")}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`mt-4 sm:mt-6 lg:mt-8 pt-4 sm:pt-6 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center ${
            i18n.language === "ar" ? "space-y-3 sm:space-y-0" : "space-y-3 sm:space-y-0"
          }`}
        >
          <p className="text-xs text-gray-400">
            © {currentYear} {t("header.title")}. {t("footer.allRightsReserved")}
          </p>
          <nav
            className={`flex ${
              i18n.language === "ar" ? "space-x-reverse space-x-4 sm:space-x-6" : "space-x-4 sm:space-x-6"
            }`}
            aria-label="Legal and policy links"
          >
            <a
              href="#privacy"
              className="text-xs text-gray-400 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-800 rounded transition-colors duration-200"
            >
              {t("footer.privacy")}
            </a>
            <a
              href="#terms"
              className="text-xs text-gray-400 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-800 rounded transition-colors duration-200"
            >
              {t("footer.terms")}
            </a>
            <a
              href="#accessibility"
              className="text-xs text-gray-400 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-800 rounded transition-colors duration-200"
            >
              {t("footer.accessibility")}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
