import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AISuggestionModal from "../../components/AISuggestionModal";
import Button from "../../components/Button";
import HelpMeWriteButton from "../../components/HelpMeWriteButton";
import Textarea from "../../components/Textarea";
import { PathConstants } from "../../constants/paths";
import { useStepValidation } from "../../contexts/StepValidationContext";
import { createSituationDescriptionsSchema, type SituationDescriptionsFormData } from "../../schemas/situationDescriptions";
import { generateAISuggestion, type FormDataContext, type OpenAIRequest } from "../../services/openai";
import type { RootState } from "../../store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { resetApplication, setSubmitting, updateSituationDescriptions } from "../../store/slices/applicationSlice";
import { getAdditionalErrorMessage, getUnexpectedErrorMessage } from "../../utils/errorHandling";
import { saveApplicationToLocalStorage } from "../../utils/localStorage";

const SituationDescriptions = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { registerValidation, unregisterValidation } = useStepValidation();
  const isRTL = i18n.language === "ar";

  // Get existing data from Redux store
  const { personalInformation, familyFinancialInfo, situationDescriptions } = useAppSelector(
    (state: RootState) => state.application
  );
  const isSubmitting = useAppSelector((state: RootState) => state.application.isSubmitting);

  // Create schema with translated messages (recreated when language changes)
  const situationDescriptionsSchema = useMemo(() => createSituationDescriptionsSchema(t), [t]);

  const formMethods = useForm<SituationDescriptionsFormData>({
    resolver: zodResolver(situationDescriptionsSchema),
    defaultValues: {
      currentFinancialSituation: situationDescriptions.currentFinancialSituation || "",
      employmentCircumstances: situationDescriptions.employmentCircumstances || "",
      reasonForApplying: situationDescriptions.reasonForApplying || "",
    },
    mode: "onChange", // Validate on change to clear errors when valid
  });

  const {
    register,
    formState: { errors, isDirty },
    reset,
    watch,
    trigger,
    getValues,
    setValue,
  } = formMethods;

  // Track previous language to detect changes and re-validate
  const prevLanguageRef = useRef(i18n.language);

  useEffect(() => {
    const currentLanguage = i18n.language;

    // If language changed and there are existing errors, re-validate to get translated messages
    if (prevLanguageRef.current !== currentLanguage) {
      prevLanguageRef.current = currentLanguage;

      // Clear errors first
      formMethods.clearErrors();

      // Re-validate if form has been touched and has errors
      const hasErrors = Object.keys(formMethods.formState.errors).length > 0;
      if (hasErrors || formMethods.formState.isSubmitted) {
        setTimeout(() => {
          trigger();
        }, 50); // Small delay to ensure schema is updated
      }
    }
  }, [i18n.language, formMethods, trigger]);

  // AI suggestion modal state
  const [aiModalState, setAiModalState] = useState<{
    isOpen: boolean;
    isLoading: boolean;
    suggestion: string;
    error?: string;
    fieldType?: "currentFinancialSituation" | "employmentCircumstances" | "reasonForApplying";
    fieldLabel: string;
  }>({
    isOpen: false,
    isLoading: false,
    suggestion: "",
    fieldLabel: "",
  });

  // Reset form when Redux data changes
  useEffect(() => {
    reset({
      currentFinancialSituation: situationDescriptions.currentFinancialSituation || "",
      employmentCircumstances: situationDescriptions.employmentCircumstances || "",
      reasonForApplying: situationDescriptions.reasonForApplying || "",
    });
  }, [situationDescriptions, reset]);

  const handleSubmitApplication = useCallback(async () => {
    dispatch(setSubmitting(true));

    try {
      // Mock API call - simulate submission
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Get current form data
      const currentFormData = getValues();

      // Create updated situation descriptions with current form data
      const updatedSituationDescriptions = {
        currentFinancialSituation: currentFormData.currentFinancialSituation,
        employmentCircumstances: currentFormData.employmentCircumstances,
        reasonForApplying: currentFormData.reasonForApplying,
      };

      // Save application data to localStorage before resetting Redux
      saveApplicationToLocalStorage({
        personalInformation,
        familyFinancialInfo,
        situationDescriptions: updatedSituationDescriptions,
      });

      toast.success(t("form.situationDescriptions.validation.submitSuccess"));

      // Reset application and navigate to success page
      dispatch(resetApplication());
      navigate(PathConstants.SUCCESS);
    } catch {
      toast.error(t("form.situationDescriptions.validation.submitError"));
    } finally {
      dispatch(setSubmitting(false));
    }
  }, [dispatch, navigate, t, personalInformation, familyFinancialInfo, getValues]);

  // Register validation function with the context
  useEffect(() => {
    const validateCurrentStep = async (): Promise<boolean> => {
      const isValid = await trigger();
      if (isValid) {
        const data = getValues();

        // Save to Redux store
        dispatch(
          updateSituationDescriptions({
            currentFinancialSituation: data.currentFinancialSituation,
            employmentCircumstances: data.employmentCircumstances,
            reasonForApplying: data.reasonForApplying,
          })
        );

        // For the final step, actually submit the application
        await handleSubmitApplication();
        return true;
      } else {
        toast.error(t("form.situationDescriptions.validation.formErrors"));
        return false;
      }
    };

    registerValidation("situation-descriptions", validateCurrentStep);

    return () => {
      unregisterValidation("situation-descriptions");
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveAndContinueLater = useCallback(() => {
    const currentData = watch();

    // Save current form data to Redux store
    dispatch(
      updateSituationDescriptions({
        currentFinancialSituation: currentData.currentFinancialSituation || "",
        employmentCircumstances: currentData.employmentCircumstances || "",
        reasonForApplying: currentData.reasonForApplying || "",
      })
    );

    // Navigate to home
    navigate(PathConstants.HOME);
  }, [watch, dispatch, navigate]);

  const handleHelpMeWrite = async (
    fieldType: "currentFinancialSituation" | "employmentCircumstances" | "reasonForApplying"
  ) => {
    const fieldLabels = {
      currentFinancialSituation: t("form.situationDescriptions.fields.currentFinancialSituation.label"),
      employmentCircumstances: t("form.situationDescriptions.fields.employmentCircumstances.label"),
      reasonForApplying: t("form.situationDescriptions.fields.reasonForApplying.label"),
    };

    setAiModalState({
      isOpen: true,
      isLoading: true,
      suggestion: "",
      fieldType,
      fieldLabel: fieldLabels[fieldType],
    });

    try {
      // Get current form values and existing data
      const currentFormData = watch();
      const currentFieldValue = currentFormData[fieldType];

      // Build form data context for AI
      const formDataContext: FormDataContext = {
        familyFinancialInfo: {
          maritalStatus: familyFinancialInfo.maritalStatus,
          dependents: familyFinancialInfo.dependents,
          employmentStatus: familyFinancialInfo.employmentStatus,
          monthlyIncome: familyFinancialInfo.monthlyIncome,
          housingStatus: familyFinancialInfo.housingStatus,
        },
        personalInformation: {
          location: `${personalInformation.city}, ${personalInformation.country}`.replace(/^, |, $/g, ""),
        },
        existingText: currentFieldValue || "",
      };

      const request: OpenAIRequest = {
        fieldType,
        language: i18n.language,
        formData: formDataContext,
      };

      const response = await generateAISuggestion(request);

      if (response.success) {
        setAiModalState((prev) => ({
          ...prev,
          isLoading: false,
          suggestion: response.suggestion,
        }));
      } else {
        // Handle different error types with appropriate user feedback
        let errorMessage = response.error || t("aiSuggestion.defaultError", "Failed to generate suggestion");

        // Add contextual messages based on error type and language
        if (response.errorType) {
          errorMessage += getAdditionalErrorMessage(response.errorType, i18n.language, response.retryAfter);
        }

        setAiModalState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      }
    } catch (error) {
      setAiModalState((prev) => ({
        ...prev,
        isLoading: false,
        error: getUnexpectedErrorMessage(i18n.language),
      }));
    }
  };

  const handleAcceptSuggestion = (text: string) => {
    if (aiModalState.fieldType) {
      setValue(aiModalState.fieldType, text, { shouldValidate: true, shouldDirty: true });
    }
  };

  const handleCloseModal = () => {
    setAiModalState({
      isOpen: false,
      isLoading: false,
      suggestion: "",
      fieldLabel: "",
    });
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + S to save and continue later
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        handleSaveAndContinueLater();
      }
      // Ctrl/Cmd + Enter to submit
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        handleSubmitApplication();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleSaveAndContinueLater, handleSubmitApplication]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Toaster
        position={isRTL ? "top-left" : "top-right"}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#333",
            direction: isRTL ? "rtl" : "ltr",
            textAlign: isRTL ? "right" : "left",
          },
        }}
      />

      {/* Skip Link for Accessibility */}
      <a
        href="#situation-descriptions-form"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
      >
        Skip to Situation Descriptions form
      </a>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8 lg:p-10">
        {/* Header */}
        <header className={`text-center mb-6 sm:mb-8 ${isRTL ? "text-right" : "text-left"}`}>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3" id="form-title">
            {t("form.situationDescriptions.title")}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            {t("form.situationDescriptions.subtitle")}
          </p>
        </header>

        <form
          id="situation-descriptions-form"
          className="space-y-6 sm:space-y-8"
          role="form"
          aria-labelledby="form-title"
          noValidate
        >
          {/* Current Financial Situation */}
          <div className="space-y-2">
            <div className={`flex items-start justify-between gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="flex-1">
                <label
                  htmlFor="currentFinancialSituation"
                  className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? "text-right" : "text-left"}`}
                >
                  {t("form.situationDescriptions.fields.currentFinancialSituation.label")}
                  <span className="text-red-500 ml-1">*</span>
                </label>
              </div>
              <HelpMeWriteButton
                onClick={() => handleHelpMeWrite("currentFinancialSituation")}
                disabled={aiModalState.isLoading}
                loading={aiModalState.isLoading && aiModalState.fieldType === "currentFinancialSituation"}
                className="flex-shrink-0"
              />
            </div>
            <Textarea
              {...register("currentFinancialSituation")}
              label=""
              placeholder={t("form.situationDescriptions.fields.currentFinancialSituation.placeholder")}
              error={errors.currentFinancialSituation?.message}
              fullWidth
              rows={5}
              maxLength={1000}
              showCharCount
              value={watch("currentFinancialSituation")}
              aria-describedby="financial-situation-help"
            />
          </div>

          {/* Employment Circumstances */}
          <div className="space-y-2">
            <div className={`flex items-start justify-between gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="flex-1">
                <label
                  htmlFor="employmentCircumstances"
                  className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? "text-right" : "text-left"}`}
                >
                  {t("form.situationDescriptions.fields.employmentCircumstances.label")}
                  <span className="text-red-500 ml-1">*</span>
                </label>
              </div>
              <HelpMeWriteButton
                onClick={() => handleHelpMeWrite("employmentCircumstances")}
                disabled={aiModalState.isLoading}
                loading={aiModalState.isLoading && aiModalState.fieldType === "employmentCircumstances"}
                className="flex-shrink-0"
              />
            </div>
            <Textarea
              {...register("employmentCircumstances")}
              label=""
              placeholder={t("form.situationDescriptions.fields.employmentCircumstances.placeholder")}
              error={errors.employmentCircumstances?.message}
              fullWidth
              rows={5}
              maxLength={1000}
              showCharCount
              value={watch("employmentCircumstances")}
              aria-describedby="employment-circumstances-help"
            />
          </div>

          {/* Reason for Applying */}
          <div className="space-y-2">
            <div className={`flex items-start justify-between gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="flex-1">
                <label
                  htmlFor="reasonForApplying"
                  className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? "text-right" : "text-left"}`}
                >
                  {t("form.situationDescriptions.fields.reasonForApplying.label")}
                  <span className="text-red-500 ml-1">*</span>
                </label>
              </div>
              <HelpMeWriteButton
                onClick={() => handleHelpMeWrite("reasonForApplying")}
                disabled={aiModalState.isLoading}
                loading={aiModalState.isLoading && aiModalState.fieldType === "reasonForApplying"}
                className="flex-shrink-0"
              />
            </div>
            <Textarea
              {...register("reasonForApplying")}
              label=""
              placeholder={t("form.situationDescriptions.fields.reasonForApplying.placeholder")}
              error={errors.reasonForApplying?.message}
              fullWidth
              rows={5}
              maxLength={1000}
              showCharCount
              value={watch("reasonForApplying")}
              aria-describedby="reason-for-applying-help"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 sm:pt-8 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveAndContinueLater}
              icon={<Save />}
              iconPosition={isRTL ? "right" : "left"}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
              aria-label={t("common.actions.saveAndContinueLater")}
            >
              {t("common.actions.saveAndContinueLater")}
            </Button>
          </div>

          {/* Form Status */}
          {isDirty && (
            <div
              className={`text-sm text-amber-600 ${isRTL ? "text-right" : "text-left"} text-center sm:text-left`}
              role="status"
              aria-live="polite"
            >
              {t("common.actions.unsavedChanges")}
            </div>
          )}
        </form>
      </div>

      {/* AI Suggestion Modal */}
      <AISuggestionModal
        isOpen={aiModalState.isOpen}
        onClose={handleCloseModal}
        onAccept={handleAcceptSuggestion}
        suggestion={aiModalState.suggestion}
        isLoading={aiModalState.isLoading}
        error={aiModalState.error}
        fieldLabel={aiModalState.fieldLabel}
      />
    </div>
  );
};

export default SituationDescriptions;
