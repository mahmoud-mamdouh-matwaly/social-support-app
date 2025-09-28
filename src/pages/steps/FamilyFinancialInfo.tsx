import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { PathConstants } from "../../constants/paths";
import { useStepValidation } from "../../contexts/StepValidationContext";
import { createFamilyFinancialInfoSchema, type FamilyFinancialInfoFormData } from "../../schemas/familyFinancialInfo";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateFamilyFinancialInfo } from "../../store/slices/applicationSlice";

const FamilyFinancialInfo = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { registerValidation, unregisterValidation } = useStepValidation();
  const isRTL = i18n.language === "ar";

  // Get existing data from Redux store
  const familyFinancialInfo = useAppSelector((state) => state.application.familyFinancialInfo);
  const isSubmitting = useAppSelector((state) => state.application.isSubmitting);

  // Create schema with translated messages (recreated when language changes)
  const familyFinancialInfoSchema = useMemo(() => createFamilyFinancialInfoSchema(t), [t]);

  const formMethods = useForm<FamilyFinancialInfoFormData>({
    resolver: zodResolver(familyFinancialInfoSchema),
    defaultValues: {
      maritalStatus: familyFinancialInfo.maritalStatus || "",
      dependents: familyFinancialInfo.dependents || "",
      employmentStatus: familyFinancialInfo.employmentStatus || "",
      monthlyIncome: familyFinancialInfo.monthlyIncome || "",
      housingStatus: familyFinancialInfo.housingStatus || "",
    },
    mode: "onSubmit",
  });

  const {
    register,
    formState: { errors, isDirty },
    reset,
    watch,
    trigger,
    getValues,
    control,
  } = formMethods;

  // Reset form when Redux data changes
  useEffect(() => {
    reset({
      maritalStatus: familyFinancialInfo.maritalStatus || "",
      dependents: familyFinancialInfo.dependents || "",
      employmentStatus: familyFinancialInfo.employmentStatus || "",
      monthlyIncome: familyFinancialInfo.monthlyIncome || "",
      housingStatus: familyFinancialInfo.housingStatus || "",
    });
  }, [familyFinancialInfo, reset]);

  // Track previous language to detect changes
  const prevLanguageRef = useRef(i18n.language);

  // Update validation messages when language changes
  useEffect(() => {
    const currentLanguage = i18n.language;

    // Only trigger if language actually changed and form has been interacted with
    if (prevLanguageRef.current !== currentLanguage && isDirty) {
      prevLanguageRef.current = currentLanguage;

      // Clear errors first, then re-validate with new language
      formMethods.clearErrors();
      setTimeout(() => {
        trigger();
      }, 10); // Small delay to ensure errors are cleared
    } else {
      prevLanguageRef.current = currentLanguage;
    }
  }, [i18n.language, isDirty, formMethods, trigger]);

  // Register validation function with the context
  useEffect(() => {
    const validateCurrentStep = async (): Promise<boolean> => {
      const isValid = await trigger();
      if (isValid) {
        const data = getValues();
        // Save to Redux store without navigation
        dispatch(
          updateFamilyFinancialInfo({
            maritalStatus: data.maritalStatus,
            dependents: data.dependents,
            employmentStatus: data.employmentStatus,
            monthlyIncome: data.monthlyIncome,
            housingStatus: data.housingStatus,
          })
        );

        // Show success toast
        toast.success(t("form.familyFinancialInfo.validation.saveSuccess"));
        return true;
      } else {
        toast.error(t("form.familyFinancialInfo.validation.formErrors"));
        return false;
      }
    };

    registerValidation("family-financial-info", validateCurrentStep);

    return () => {
      unregisterValidation("family-financial-info");
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveAndContinueLater = useCallback(() => {
    const currentData = watch();

    // Save current form data to Redux store
    dispatch(
      updateFamilyFinancialInfo({
        maritalStatus: currentData.maritalStatus || "",
        dependents: currentData.dependents || "",
        employmentStatus: currentData.employmentStatus || "",
        monthlyIncome: currentData.monthlyIncome || "",
        housingStatus: currentData.housingStatus || "",
      })
    );

    // Navigate to home
    navigate(PathConstants.HOME);
  }, [watch, dispatch, navigate]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + S to save and continue later
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        handleSaveAndContinueLater();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleSaveAndContinueLater]);

  const maritalStatusOptions = [
    { value: "single", label: t("form.familyFinancialInfo.fields.maritalStatus.options.single") },
    { value: "married", label: t("form.familyFinancialInfo.fields.maritalStatus.options.married") },
    { value: "divorced", label: t("form.familyFinancialInfo.fields.maritalStatus.options.divorced") },
    { value: "widowed", label: t("form.familyFinancialInfo.fields.maritalStatus.options.widowed") },
  ];

  const employmentStatusOptions = [
    { value: "employed", label: t("form.familyFinancialInfo.fields.employmentStatus.options.employed") },
    { value: "unemployed", label: t("form.familyFinancialInfo.fields.employmentStatus.options.unemployed") },
    { value: "self-employed", label: t("form.familyFinancialInfo.fields.employmentStatus.options.self-employed") },
    { value: "student", label: t("form.familyFinancialInfo.fields.employmentStatus.options.student") },
    { value: "retired", label: t("form.familyFinancialInfo.fields.employmentStatus.options.retired") },
    { value: "disabled", label: t("form.familyFinancialInfo.fields.employmentStatus.options.disabled") },
  ];

  const housingStatusOptions = [
    { value: "owned", label: t("form.familyFinancialInfo.fields.housingStatus.options.owned") },
    { value: "rented", label: t("form.familyFinancialInfo.fields.housingStatus.options.rented") },
    { value: "family-owned", label: t("form.familyFinancialInfo.fields.housingStatus.options.family-owned") },
    { value: "government-provided", label: t("form.familyFinancialInfo.fields.housingStatus.options.government-provided") },
    { value: "homeless", label: t("form.familyFinancialInfo.fields.housingStatus.options.homeless") },
  ];

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
        href="#family-financial-form"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
      >
        Skip to Family & Financial Information form
      </a>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8 lg:p-10">
        {/* Header */}
        <header className={`text-center mb-6 sm:mb-8 ${isRTL ? "text-right" : "text-left"}`}>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3" id="form-title">
            {t("form.familyFinancialInfo.title")}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            {t("form.familyFinancialInfo.subtitle")}
          </p>
        </header>

        <form
          id="family-financial-form"
          className="space-y-6 sm:space-y-8"
          role="form"
          aria-labelledby="form-title"
          noValidate
        >
          {/* Family Information Section */}
          <fieldset className="space-y-4 sm:space-y-6">
            <legend
              className={`text-lg sm:text-xl font-semibold text-gray-900 border-b pb-2 mb-4 sm:mb-6 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("common.sections.familyInformation")}
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <Controller
                name="maritalStatus"
                control={control}
                render={({ field }) => (
                  <Select
                    label={t("form.familyFinancialInfo.fields.maritalStatus.label")}
                    placeholder={t("form.familyFinancialInfo.fields.maritalStatus.placeholder")}
                    error={errors.maritalStatus?.message}
                    options={maritalStatusOptions}
                    fullWidth
                    required
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <Input
                {...register("dependents")}
                label={t("form.familyFinancialInfo.fields.dependents.label")}
                placeholder={t("form.familyFinancialInfo.fields.dependents.placeholder")}
                error={errors.dependents?.message}
                fullWidth
                required
                numbersOnly
                autoComplete="off"
                aria-describedby="dependents-help"
              />
            </div>
          </fieldset>

          {/* Employment Information Section */}
          <fieldset className="space-y-4 sm:space-y-6">
            <legend
              className={`text-lg sm:text-xl font-semibold text-gray-900 border-b pb-2 mb-4 sm:mb-6 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("common.sections.employmentInformation")}
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <Controller
                name="employmentStatus"
                control={control}
                render={({ field }) => (
                  <Select
                    label={t("form.familyFinancialInfo.fields.employmentStatus.label")}
                    placeholder={t("form.familyFinancialInfo.fields.employmentStatus.placeholder")}
                    error={errors.employmentStatus?.message}
                    options={employmentStatusOptions}
                    fullWidth
                    required
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <Input
                {...register("monthlyIncome")}
                type="number"
                label={t("form.familyFinancialInfo.fields.monthlyIncome.label")}
                placeholder={t("form.familyFinancialInfo.fields.monthlyIncome.placeholder")}
                error={errors.monthlyIncome?.message}
                fullWidth
                required
                autoComplete="off"
                aria-describedby="monthly-income-help"
              />
            </div>
          </fieldset>

          {/* Housing Information Section */}
          <fieldset className="space-y-4 sm:space-y-6">
            <legend
              className={`text-lg sm:text-xl font-semibold text-gray-900 border-b pb-2 mb-4 sm:mb-6 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("common.sections.housingInformation")}
            </legend>

            <div className="max-w-md">
              <Controller
                name="housingStatus"
                control={control}
                render={({ field }) => (
                  <Select
                    label={t("form.familyFinancialInfo.fields.housingStatus.label")}
                    placeholder={t("form.familyFinancialInfo.fields.housingStatus.placeholder")}
                    error={errors.housingStatus?.message}
                    options={housingStatusOptions}
                    fullWidth
                    required
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </fieldset>

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
    </div>
  );
};

export default FamilyFinancialInfo;
