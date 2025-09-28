import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import Footer from "./Footer";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir={i18n.language === "ar" ? "rtl" : "ltr"} lang={i18n.language}>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link" tabIndex={0}>
        {t("accessibility.skipToMain")}
      </a>

      <Header />

      <main
        className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8"
        role="main"
        id="main-content"
      >
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
