import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PathConstants } from "../../constants/paths";
import { useStepValidation } from "../../contexts/StepValidationContext";
import { useAppDispatch } from "../../store/hooks";
import { setCurrentStep } from "../../store/slices/applicationSlice";
import Button from "../Button";
import Stepper from "./Stepper";
import { defaultSteps } from "./stepperConfig";

const StepperLayout = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { validateStep } = useStepValidation();
  const isRTL = i18n.language === "ar";

  // Map paths to step numbers
  const pathToStep: Record<string, number> = {
    [PathConstants.APPLY_STEP_1]: 1,
    [PathConstants.APPLY_STEP_2]: 2,
    [PathConstants.APPLY_STEP_3]: 3,
  };

  // Map step numbers to paths
  const stepToPath: Record<number, string> = {
    1: PathConstants.APPLY_STEP_1,
    2: PathConstants.APPLY_STEP_2,
    3: PathConstants.APPLY_STEP_3,
  };

  const currentStep = pathToStep[location.pathname] || 1;
  const totalSteps = defaultSteps.length;

  // Update Redux store when step changes
  React.useEffect(() => {
    dispatch(setCurrentStep(currentStep));
  }, [currentStep, dispatch]);

  const handlePrevious = () => {
    if (currentStep > 1) {
      navigate(stepToPath[currentStep - 1]);
    } else {
      navigate(PathConstants.HOME);
    }
  };

  const handleNext = async () => {
    // Map current step to validation step ID
    const stepIdMap: Record<number, string> = {
      1: "personal-information",
      2: "family-financial-info",
      3: "situation-descriptions",
    };

    const stepId = stepIdMap[currentStep];

    if (stepId) {
      const isValid = await validateStep(stepId);
      if (!isValid) {
        return; // Don't navigate if validation failed
      }
    }

    if (currentStep < totalSteps) {
      navigate(stepToPath[currentStep + 1]);
    }
  };

  const handleBackToHome = () => {
    navigate(PathConstants.HOME);
  };

  return (
    <div className="max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* Application Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">{t("stepper.title")}</h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">{t("stepper.subtitle")}</p>
      </div>

      {/* Stepper */}
      <Stepper currentStep={currentStep} steps={defaultSteps} className="mb-6 sm:mb-8" />

      {/* Step Content */}
      <div className="mb-6 sm:mb-8">
        <Outlet />
      </div>

      {/* Navigation Buttons */}
      <nav
        className={`flex flex-col sm:flex-row justify-between items-center gap-4 py-4 sm:py-6 border-t border-gray-200 ${
          isRTL ? "sm:flex-row-reverse" : ""
        }`}
        aria-label={t("stepper.navigation.stepNavigation")}
      >
        <div className={`${isRTL ? "order-1 sm:order-2" : "order-2 sm:order-1"}`}>
          {currentStep > 1 ? (
            <Button
              variant="outline"
              onClick={handlePrevious}
              icon={isRTL ? <ArrowRight /> : <ArrowLeft />}
              iconPosition={isRTL ? "right" : "left"}
              aria-label={t("stepper.navigation.previousStep")}
            >
              {t("stepper.navigation.previous")}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleBackToHome}
              icon={isRTL ? <ArrowRight /> : <ArrowLeft />}
              iconPosition={isRTL ? "right" : "left"}
              aria-label={t("stepper.navigation.backToHome")}
            >
              {t("stepper.navigation.backToHome")}
            </Button>
          )}
        </div>

        <div
          className={`flex flex-col sm:flex-row items-center gap-3 sm:gap-4 ${
            isRTL ? "order-2 sm:order-1" : "order-1 sm:order-2"
          }`}
        >
          <span className="text-sm text-gray-500 font-medium" aria-live="polite" aria-atomic="true">
            <span dir="ltr">{t("stepper.stepCounter", { current: currentStep, total: totalSteps })}</span>
          </span>

          {currentStep < totalSteps ? (
            <Button
              variant="primary"
              onClick={handleNext}
              icon={isRTL ? <ArrowLeft /> : <ArrowRight />}
              iconPosition={isRTL ? "left" : "right"}
              aria-label={t("stepper.navigation.nextStep")}
            >
              {t("stepper.navigation.next")}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={async () => {
                // Map current step to validation step ID
                const stepIdMap: Record<number, string> = {
                  1: "personal-information",
                  2: "family-financial-info",
                  3: "situation-descriptions",
                };

                // Validate and submit the final step
                const stepId = stepIdMap[currentStep];
                if (stepId) {
                  await validateStep(stepId);
                }
              }}
              aria-label={t("stepper.navigation.submitApplication")}
            >
              {t("stepper.navigation.submit")}
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default StepperLayout;
