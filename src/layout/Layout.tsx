import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const Layout = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir={i18n.language === "ar" ? "rtl" : "ltr"} lang={i18n.language}>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link" tabIndex={0}>
        {t("accessibility.skipToMain")}
      </a>

      <Header />

      <main
        className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-2 sm:py-4 lg:py-8"
        role="main"
        id="main-content"
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
