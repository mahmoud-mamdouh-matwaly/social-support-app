import { z } from "zod";

export type SituationDescriptionsFormData = {
  currentFinancialSituation: string;
  employmentCircumstances: string;
  reasonForApplying: string;
};

export const createSituationDescriptionsSchema = (t: (key: string) => string) =>
  z.object({
    currentFinancialSituation: z
      .string()
      .min(10, t("form.situationDescriptions.validation.currentFinancialSituation.minLength"))
      .max(1000, t("form.situationDescriptions.validation.currentFinancialSituation.maxLength")),
    employmentCircumstances: z
      .string()
      .min(10, t("form.situationDescriptions.validation.employmentCircumstances.minLength"))
      .max(1000, t("form.situationDescriptions.validation.employmentCircumstances.maxLength")),
    reasonForApplying: z
      .string()
      .min(10, t("form.situationDescriptions.validation.reasonForApplying.minLength"))
      .max(1000, t("form.situationDescriptions.validation.reasonForApplying.maxLength")),
  });
