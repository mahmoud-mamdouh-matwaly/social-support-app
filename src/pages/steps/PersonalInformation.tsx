import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CountrySelect from "../../components/CountrySelect";
import Input from "../../components/Input";
import SaveContinueLaterButton from "../../components/SaveContinueLaterButton";
import Select from "../../components/Select";
import { PathConstants } from "../../constants/paths";
import { useStepValidation } from "../../contexts/StepValidationContext";
import { createPersonalInformationSchema, type PersonalInformationFormData } from "../../schemas/personalInformation";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updatePersonalInformation } from "../../store/slices/applicationSlice";

const PersonalInformation = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { registerValidation, unregisterValidation } = useStepValidation();
  const isRTL = i18n.language === "ar";

  // Get existing data from Redux store
  const personalInfo = useAppSelector((state) => state.application.personalInformation);
  const isSubmitting = useAppSelector((state) => state.application.isSubmitting);

  // Create schema with translated messages (recreated when language changes)
  const personalInformationSchema = useMemo(() => createPersonalInformationSchema(t), [t]);

  const formMethods = useForm<PersonalInformationFormData>({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: {
      name: personalInfo.name || "",
      nationalId: personalInfo.nationalId || "",
      dateOfBirth: personalInfo.dateOfBirth || "",
      gender: personalInfo.gender || "",
      address: personalInfo.address || "",
      city: personalInfo.city || "",
      state: personalInfo.state || "",
      country: personalInfo.country || "",
      phone: personalInfo.phone || "",
      email: personalInfo.email || "",
    },
    mode: "onSubmit", // Only validate on submit
  });

  const {
    register,
    formState: { errors, isDirty },
    reset,
    watch,
    trigger,
    setValue,
    getValues,
  } = formMethods;

  // Reset form when Redux data changes
  useEffect(() => {
    reset({
      name: personalInfo.name || "",
      nationalId: personalInfo.nationalId || "",
      dateOfBirth: personalInfo.dateOfBirth || "",
      gender: personalInfo.gender || "",
      address: personalInfo.address || "",
      city: personalInfo.city || "",
      state: personalInfo.state || "",
      country: personalInfo.country || "",
      phone: personalInfo.phone || "",
      email: personalInfo.email || "",
    });
  }, [personalInfo, reset]);

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
          updatePersonalInformation({
            name: data.name,
            nationalId: data.nationalId,
            dateOfBirth: data.dateOfBirth,
            gender: data.gender,
            address: data.address,
            city: data.city,
            state: data.state,
            country: data.country,
            phone: data.phone,
            email: data.email,
          })
        );

        // Show success toast
        toast.success(t("form.personalInformation.validation.saveSuccess"));
        return true;
      } else {
        toast.error(t("form.personalInformation.validation.formErrors"));
        return false;
      }
    };

    registerValidation("personal-information", validateCurrentStep);

    return () => {
      unregisterValidation("personal-information");
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveAndContinueLater = () => {
    const currentData = watch();

    // Save current form data to Redux store
    dispatch(
      updatePersonalInformation({
        name: currentData.name || "",
        nationalId: currentData.nationalId || "",
        dateOfBirth: currentData.dateOfBirth || "",
        gender: currentData.gender || "",
        address: currentData.address || "",
        city: currentData.city || "",
        state: currentData.state || "",
        country: currentData.country || "",
        phone: currentData.phone || "",
        email: currentData.email || "",
      })
    );

    // Navigate to home
    navigate(PathConstants.HOME);
  };

  const genderOptions = [
    { value: "male", label: t("form.personalInformation.fields.gender.options.male") },
    { value: "female", label: t("form.personalInformation.fields.gender.options.female") },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Toaster
        position={isRTL ? "top-left" : "top-right"}
        toastOptions={{
          duration: 4000,
          style: {
            background: isRTL ? "#fff" : "#fff",
            color: "#333",
            direction: isRTL ? "rtl" : "ltr",
            textAlign: isRTL ? "right" : "left",
          },
        }}
      />
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        {/* Header */}
        <div className={`text-center mb-8 ${isRTL ? "text-right" : "text-left"}`}>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{t("form.personalInformation.title")}</h2>
          <p className="text-gray-600 text-base md:text-lg">{t("form.personalInformation.subtitle")}</p>
        </div>

        <div className="space-y-6">
          {/* Personal Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              {...register("name")}
              label={t("form.personalInformation.fields.name.label")}
              placeholder={t("form.personalInformation.fields.name.placeholder")}
              error={errors.name?.message}
              fullWidth
              required
              autoComplete="name"
            />

            <Input
              {...register("nationalId")}
              label={t("form.personalInformation.fields.nationalId.label")}
              placeholder={t("form.personalInformation.fields.nationalId.placeholder")}
              error={errors.nationalId?.message}
              fullWidth
              required
              numbersOnly
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              {...register("dateOfBirth")}
              type="date"
              label={t("form.personalInformation.fields.dateOfBirth.label")}
              error={errors.dateOfBirth?.message}
              fullWidth
              required
              autoComplete="bday"
            />

            <Select
              {...register("gender")}
              label={t("form.personalInformation.fields.gender.label")}
              placeholder={t("form.personalInformation.fields.gender.placeholder")}
              options={genderOptions}
              error={errors.gender?.message}
              fullWidth
              required
            />
          </div>

          {/* Address Section */}
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold text-gray-900 border-b pb-2 ${isRTL ? "text-right" : "text-left"}`}>
              {t("form.personalInformation.fields.address.label")}
            </h3>

            <Input
              {...register("address")}
              label={t("form.personalInformation.fields.address.label")}
              placeholder={t("form.personalInformation.fields.address.placeholder")}
              error={errors.address?.message}
              fullWidth
              required
              autoComplete="street-address"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Input
                {...register("city")}
                label={t("form.personalInformation.fields.city.label")}
                placeholder={t("form.personalInformation.fields.city.placeholder")}
                error={errors.city?.message}
                fullWidth
                required
                autoComplete="address-level2"
              />

              <Input
                {...register("state")}
                label={t("form.personalInformation.fields.state.label")}
                placeholder={t("form.personalInformation.fields.state.placeholder")}
                error={errors.state?.message}
                fullWidth
                required
                autoComplete="address-level1"
              />

              <div className="md:col-span-2">
                <CountrySelect
                  name="country"
                  value={watch("country")}
                  onChange={(value) => {
                    setValue("country", value, { shouldValidate: true, shouldDirty: true });
                  }}
                  label={t("form.personalInformation.fields.country.label")}
                  placeholder={t("form.personalInformation.fields.country.placeholder")}
                  error={errors.country?.message}
                  fullWidth
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold text-gray-900 border-b pb-2 ${isRTL ? "text-right" : "text-left"}`}>
              {t("common.sections.contactInformation")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                {...register("phone")}
                type="tel"
                label={t("form.personalInformation.fields.phone.label")}
                placeholder={t("form.personalInformation.fields.phone.placeholder")}
                error={errors.phone?.message}
                fullWidth
                required
                phoneFormat
                autoComplete="tel"
              />

              <Input
                {...register("email")}
                type="email"
                label={t("form.personalInformation.fields.email.label")}
                placeholder={t("form.personalInformation.fields.email.placeholder")}
                error={errors.email?.message}
                fullWidth
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex justify-center pt-6 border-t`}>
            <SaveContinueLaterButton onClick={handleSaveAndContinueLater} disabled={isSubmitting} />
          </div>

          {/* Form Status */}
          {isDirty && (
            <div className={`text-sm text-amber-600 ${isRTL ? "text-right" : "text-left"}`}>
              {t("common.actions.unsavedChanges")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
