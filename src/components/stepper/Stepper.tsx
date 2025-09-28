import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Step } from "./stepperConfig";

type StepperProps = {
  currentStep: number;
  steps: Step[];
  className?: string;
};

const Stepper = ({ currentStep, steps, className = "" }: StepperProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div className={`w-full ${className}`} role="navigation" aria-label={t("stepper.navigation")}>
      {/* Progress Bar */}
      <div className="relative mb-6 sm:mb-8">
        {/* Background Progress Line */}
        <div
          className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full"
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-label={t("stepper.progressLabel", { current: currentStep, total: steps.length })}
        >
          <div
            className="h-full bg-blue-600 transition-all duration-500 ease-in-out rounded-full"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className={`flex  justify-between relative z-10`}>
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const stepStatus = isCompleted ? "completed" : isCurrent ? "current" : "upcoming";
            const isLast = index === steps.length - 1;

            return (
              <React.Fragment key={step.id}>
                <div
                  className={`flex flex-col items-center ${isRTL ? "text-right" : "text-left"} min-w-0 flex-1 px-1 sm:px-2`}
                  role="listitem"
                >
                  {/* Step Circle */}
                  <div
                    className={`
                    relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300 flex-shrink-0
                    ${
                      isCompleted
                        ? "bg-blue-600 border-blue-600 text-white shadow-md"
                        : isCurrent
                        ? "bg-white border-blue-600 text-blue-600 ring-4 ring-blue-100 shadow-sm"
                        : "bg-white border-gray-300 text-gray-400"
                    }
                  `}
                    aria-label={t(`stepper.stepStatus.${stepStatus}`, { step: stepNumber, title: t(step.titleKey) })}
                    role="img"
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                    ) : (
                      <span className="text-xs sm:text-sm font-semibold" aria-hidden="true" dir="ltr">
                        {stepNumber}
                      </span>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="mt-2 sm:mt-3 text-center max-w-24 sm:max-w-32 md:max-w-40">
                    <h3
                      className={`
                      text-xs sm:text-sm font-medium transition-colors duration-300 leading-tight
                      ${isCompleted || isCurrent ? "text-gray-900" : "text-gray-500"}
                    `}
                      id={`step-${stepNumber}-title`}
                    >
                      {t(step.titleKey)}
                    </h3>
                    <p
                      className={`
                      text-xs mt-1 transition-colors duration-300 leading-tight hidden sm:block
                      ${isCompleted || isCurrent ? "text-gray-600" : "text-gray-400"}
                    `}
                      aria-describedby={`step-${stepNumber}-title`}
                    >
                      {t(step.descriptionKey)}
                    </p>
                  </div>
                </div>

                {/* Navigation Arrow */}
                {!isLast && (
                  <div className="hidden md:flex items-center justify-center px-2">
                    <div
                      className={`text-gray-400 transition-colors duration-300 ${
                        isCompleted || isCurrent ? "text-blue-500" : ""
                      }`}
                    >
                      {isRTL ? (
                        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      )}
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Mobile Progress Indicator */}
      <div
        className="sm:hidden bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6"
        role="region"
        aria-labelledby="mobile-progress-title"
      >
        <div className="flex items-center justify-between mb-3">
          <span id="mobile-progress-title" className="text-sm font-medium text-gray-700">
            <span dir="ltr">{t("stepper.stepCounter", { current: currentStep, total: steps.length })}</span>
          </span>
          <span
            className="text-sm text-gray-500"
            aria-label={t("stepper.percentComplete", {
              percent: Math.round(((currentStep - 1) / (steps.length - 1)) * 100),
            })}
          >
            <span dir="ltr">{Math.round(((currentStep - 1) / (steps.length - 1)) * 100)}%</span> {t("stepper.complete")}
          </span>
        </div>

        <div
          className="w-full bg-gray-200 rounded-full h-2 mb-3"
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-label={t("stepper.mobileProgressLabel")}
        >
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-in-out"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-medium text-gray-900">{t(steps[currentStep - 1]?.titleKey)}</h4>
          <p className="text-xs text-gray-600 leading-relaxed">{t(steps[currentStep - 1]?.descriptionKey)}</p>
        </div>
      </div>
    </div>
  );
};

export default Stepper;
