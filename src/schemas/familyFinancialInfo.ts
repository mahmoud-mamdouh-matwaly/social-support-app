import { z } from "zod";

// Create a function that returns the schema with translated messages
export const createFamilyFinancialInfoSchema = (t: (key: string) => string) =>
  z.object({
    maritalStatus: z
      .string()
      .min(1, t("form.familyFinancialInfo.validation.maritalStatus.required"))
      .refine((value) => ["single", "married", "divorced", "widowed"].includes(value), {
        message: t("form.familyFinancialInfo.validation.maritalStatus.required"),
      }),

    dependents: z
      .string()
      .min(1, t("form.familyFinancialInfo.validation.dependents.required"))
      .refine((value) => {
        const num = parseInt(value);
        return !isNaN(num) && num >= 0 && num <= 20;
      }, t("form.familyFinancialInfo.validation.dependents.invalid")),

    employmentStatus: z
      .string()
      .min(1, t("form.familyFinancialInfo.validation.employmentStatus.required"))
      .refine((value) => ["employed", "unemployed", "self-employed", "student", "retired", "disabled"].includes(value), {
        message: t("form.familyFinancialInfo.validation.employmentStatus.required"),
      }),

    monthlyIncome: z
      .string()
      .min(1, t("form.familyFinancialInfo.validation.monthlyIncome.required"))
      .refine((value) => {
        const num = parseFloat(value);
        return !isNaN(num) && num >= 0 && num <= 1000000;
      }, t("form.familyFinancialInfo.validation.monthlyIncome.invalid")),

    housingStatus: z
      .string()
      .min(1, t("form.familyFinancialInfo.validation.housingStatus.required"))
      .refine((value) => ["owned", "rented", "family-owned", "government-provided", "homeless"].includes(value), {
        message: t("form.familyFinancialInfo.validation.housingStatus.required"),
      }),
  });

export type FamilyFinancialInfoFormData = z.infer<ReturnType<typeof createFamilyFinancialInfoSchema>>;
