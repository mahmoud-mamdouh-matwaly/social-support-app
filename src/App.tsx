import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./App.css";
import Button from "./components/Button";
import { Layout } from "./layout";

function App() {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
            {t("main.welcome")}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8 max-w-2xl mx-auto">
            {t("main.description")}
          </p>

          {/* Centered Action Button */}
          <div className="flex justify-center">
            <Button
              variant="primary"
              size="lg"
              icon={<FileText />}
              onClick={() => {
                // TODO: Navigate to application form
                console.log("Navigate to application form");
              }}
            >
              {t("buttons.applyForAssistance")}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;
