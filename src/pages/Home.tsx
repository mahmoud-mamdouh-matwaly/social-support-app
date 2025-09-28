import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { PathConstants } from "../constants/paths";

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleApplyClick = () => {
    navigate(PathConstants.APPLY_STEP_1);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 xl:p-10 max-w-4xl mx-auto">
      <div className="text-center">
        <h2
          className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 xl:mb-8"
          id="main-heading"
        >
          {t("main.welcome")}
        </h2>
        <p
          className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 leading-relaxed mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto"
          role="doc-abstract"
        >
          {t("main.description")}
        </p>

        {/* Centered Action Button */}
        <div className="flex justify-center">
          <Button
            variant="primary"
            size="lg"
            icon={<FileText />}
            onClick={handleApplyClick}
            aria-describedby="main-heading"
            className="text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-3 sm:py-4"
          >
            {t("buttons.applyForAssistance")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
