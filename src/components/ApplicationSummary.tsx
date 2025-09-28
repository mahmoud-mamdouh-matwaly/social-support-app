import { FileText, User, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getApplicationFromLocalStorage } from "../utils/localStorage";

const ApplicationSummary = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  // Get submitted data from localStorage
  const submittedData = getApplicationFromLocalStorage();

  if (!submittedData) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center" dir={isRTL ? "rtl" : "ltr"}>
        <p className="text-gray-500">{t("success.noData")}</p>
      </div>
    );
  }

  const { personalInformation, familyFinancialInfo, situationDescriptions } = submittedData;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h2 className={`text-xl font-semibold text-gray-900 ${isRTL ? "text-right" : "text-left"}`}>
          {t("success.submittedData.title")}
        </h2>
        <p className={`text-sm text-gray-600 mt-1 ${isRTL ? "text-right" : "text-left"}`}>
          {t("success.submittedData.subtitle")}
        </p>
      </div>

      <div className="p-6 space-y-8">
        {/* Personal Information */}
        <div className="space-y-4">
          <div className={`flex items-center gap-3`}>
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className={`text-lg font-semibold text-gray-900 ${isRTL ? "text-right" : "text-left"}`}>
              {t("success.submittedData.personalInfo")}
            </h3>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? "mr-11" : "ml-11"}`}>
            {personalInformation.name && (
              <div className={`${isRTL ? "text-right" : "text-left"}`}>
                <dt className="text-sm font-medium text-gray-500">{t("form.personalInformation.fields.name.label")}</dt>
                <dd className="mt-1 text-sm text-gray-900">{personalInformation.name}</dd>
              </div>
            )}
            {personalInformation.nationalId && (
              <div className={`${isRTL ? "text-right" : "text-left"}`}>
                <dt className="text-sm font-medium text-gray-500">
                  {t("form.personalInformation.fields.nationalId.label")}
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{personalInformation.nationalId}</dd>
              </div>
            )}
            {personalInformation.dateOfBirth && (
              <div className={`${isRTL ? "text-right" : "text-left"}`}>
                <dt className="text-sm font-medium text-gray-500">
                  {t("form.personalInformation.fields.dateOfBirth.label")}
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(personalInformation.dateOfBirth).toLocaleDateString()}
                </dd>
              </div>
            )}
            {personalInformation.gender && (
              <div className={`${isRTL ? "text-right" : "text-left"}`}>
                <dt className="text-sm font-medium text-gray-500">{t("form.personalInformation.fields.gender.label")}</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {t(`form.personalInformation.fields.gender.options.${personalInformation.gender}`)}
                </dd>
              </div>
            )}
            {personalInformation.phone && (
              <div className={`${isRTL ? "text-right" : "text-left"}`}>
                <dt className="text-sm font-medium text-gray-500">{t("form.personalInformation.fields.phone.label")}</dt>
                <dd className="mt-1 text-sm text-gray-900">{personalInformation.phone}</dd>
              </div>
            )}
            {personalInformation.email && (
              <div className={`${isRTL ? "text-right" : "text-left"}`}>
                <dt className="text-sm font-medium text-gray-500">{t("form.personalInformation.fields.email.label")}</dt>
                <dd className="mt-1 text-sm text-gray-900">{personalInformation.email}</dd>
              </div>
            )}
            {personalInformation.address && (
              <div className={`md:col-span-2 ${isRTL ? "text-right" : "text-left"}`}>
                <dt className="text-sm font-medium text-gray-500">{t("form.personalInformation.fields.address.label")}</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {personalInformation.address}
                  {personalInformation.city && `, ${personalInformation.city}`}
                  {personalInformation.state && `, ${personalInformation.state}`}
                  {personalInformation.country && `, ${personalInformation.country}`}
                </dd>
              </div>
            )}
          </div>
        </div>

        {/* Family & Financial Information */}
        <div className="space-y-4">
          <div className={`flex items-center gap-3`}>
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <h3 className={`text-lg font-semibold text-gray-900 ${isRTL ? "text-right" : "text-left"}`}>
              {t("success.submittedData.familyFinancialInfo")}
            </h3>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? "mr-11" : "ml-11"}`}>
            {familyFinancialInfo.maritalStatus && (
              <div className={`${isRTL ? "text-right" : "text-left"}`}>
                <dt className="text-sm font-medium text-gray-500">
                  {t("form.familyFinancialInfo.fields.maritalStatus.label")}
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {t(`form.familyFinancialInfo.fields.maritalStatus.options.${familyFinancialInfo.maritalStatus}`)}
                </dd>
              </div>
            )}
            {familyFinancialInfo.dependents && (
              <div className={`${isRTL ? "text-right" : "text-left"}`}>
                <dt className="text-sm font-medium text-gray-500">
                  {t("form.familyFinancialInfo.fields.dependents.label")}
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{familyFinancialInfo.dependents}</dd>
              </div>
            )}
            {familyFinancialInfo.employmentStatus && (
              <div className={`${isRTL ? "text-right" : "text-left"}`}>
                <dt className="text-sm font-medium text-gray-500">
                  {t("form.familyFinancialInfo.fields.employmentStatus.label")}
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {t(`form.familyFinancialInfo.fields.employmentStatus.options.${familyFinancialInfo.employmentStatus}`)}
                </dd>
              </div>
            )}
            {familyFinancialInfo.monthlyIncome && (
              <div className={`${isRTL ? "text-right" : "text-left"}`}>
                <dt className="text-sm font-medium text-gray-500">
                  {t("form.familyFinancialInfo.fields.monthlyIncome.label")}
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{familyFinancialInfo.monthlyIncome} AED</dd>
              </div>
            )}
            {familyFinancialInfo.housingStatus && (
              <div className={`${isRTL ? "text-right" : "text-left"}`}>
                <dt className="text-sm font-medium text-gray-500">
                  {t("form.familyFinancialInfo.fields.housingStatus.label")}
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {t(`form.familyFinancialInfo.fields.housingStatus.options.${familyFinancialInfo.housingStatus}`)}
                </dd>
              </div>
            )}
          </div>
        </div>

        {/* Situation Descriptions */}
        <div className="space-y-4">
          <div className={`flex items-center gap-3`}>
            <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className={`text-lg font-semibold text-gray-900 ${isRTL ? "text-right" : "text-left"}`}>
              {t("success.submittedData.situationDescriptions")}
            </h3>
          </div>

          <div className={`space-y-4 ${isRTL ? "mr-11" : "ml-11"}`}>
            {situationDescriptions.currentFinancialSituation && (
              <div className={`${isRTL ? "text-right" : "text-left"}`}>
                <dt className="text-sm font-medium text-gray-500">
                  {t("form.situationDescriptions.fields.currentFinancialSituation.label")}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  {situationDescriptions.currentFinancialSituation}
                </dd>
              </div>
            )}
            {situationDescriptions.employmentCircumstances && (
              <div className={`${isRTL ? "text-right" : "text-left"}`}>
                <dt className="text-sm font-medium text-gray-500">
                  {t("form.situationDescriptions.fields.employmentCircumstances.label")}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  {situationDescriptions.employmentCircumstances}
                </dd>
              </div>
            )}
            {situationDescriptions.reasonForApplying && (
              <div className={`${isRTL ? "text-right" : "text-left"}`}>
                <dt className="text-sm font-medium text-gray-500">
                  {t("form.situationDescriptions.fields.reasonForApplying.label")}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  {situationDescriptions.reasonForApplying}
                </dd>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSummary;
