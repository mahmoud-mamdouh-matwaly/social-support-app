import { z } from "zod";

// Create a function that returns the schema with translated messages
export const createPersonalInformationSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, t("form.personalInformation.validation.name.min"))
      .max(100, t("form.personalInformation.validation.name.max"))
      .regex(/^[a-zA-Z\s\u0600-\u06FF]+$/, t("form.personalInformation.validation.name.regex")),

    nationalId: z
      .string()
      .min(10, t("form.personalInformation.validation.nationalId.min"))
      .max(20, t("form.personalInformation.validation.nationalId.max"))
      .regex(/^[0-9]+$/, t("form.personalInformation.validation.nationalId.regex")),

    dateOfBirth: z
      .string()
      .min(1, t("form.personalInformation.validation.dateOfBirth.required"))
      .refine((date) => {
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= 18 && age <= 100;
      }, t("form.personalInformation.validation.dateOfBirth.age")),

    gender: z
      .string()
      .min(1, t("form.personalInformation.validation.gender.required"))
      .refine((value) => ["male", "female"].includes(value), {
        message: t("form.personalInformation.validation.gender.required"),
      }),

    address: z
      .string()
      .min(10, t("form.personalInformation.validation.address.min"))
      .max(200, t("form.personalInformation.validation.address.max")),

    city: z
      .string()
      .min(2, t("form.personalInformation.validation.city.min"))
      .max(50, t("form.personalInformation.validation.city.max"))
      .regex(/^[a-zA-Z\s\u0600-\u06FF]+$/, t("form.personalInformation.validation.city.regex")),

    state: z
      .string()
      .min(2, t("form.personalInformation.validation.state.min"))
      .max(50, t("form.personalInformation.validation.state.max"))
      .regex(/^[a-zA-Z\s\u0600-\u06FF]+$/, t("form.personalInformation.validation.state.regex")),

    country: z
      .string()
      .min(2, t("form.personalInformation.validation.country.min"))
      .max(50, t("form.personalInformation.validation.country.max"))
      .regex(/^[a-zA-Z\s\u0600-\u06FF]+$/, t("form.personalInformation.validation.country.regex")),

    phone: z
      .string()
      .min(1, t("form.personalInformation.validation.phone.required"))
      .refine((phone) => {
        // Remove all non-digit characters for validation
        const digits = phone.replace(/\D/g, "");

        // UAE phone number patterns:
        // Mobile: +971 50/51/52/55/56 XXX XXXX (9 digits after country code)
        // Landline: +971 2/3/4/6/7/9 XXX XXXX (8-9 digits after country code)
        // Allow international format with +971 or 00971 or local format starting with 0

        if (phone.startsWith("+971") || phone.startsWith("00971")) {
          // International format
          const uaeDigits = phone.startsWith("+971") ? digits.slice(3) : digits.slice(5);
          return uaeDigits.length >= 8 && uaeDigits.length <= 9;
        } else if (digits.startsWith("971")) {
          // Without + prefix
          const uaeDigits = digits.slice(3);
          return uaeDigits.length >= 8 && uaeDigits.length <= 9;
        } else if (digits.startsWith("0")) {
          // Local UAE format (starts with 0)
          return digits.length >= 9 && digits.length <= 10;
        } else {
          // General international format
          return digits.length >= 10 && digits.length <= 15;
        }
      }, t("form.personalInformation.validation.phone.format")),

    email: z
      .string()
      .min(1, t("form.personalInformation.validation.email.required"))
      .email(t("form.personalInformation.validation.email.invalid"))
      .max(100, t("form.personalInformation.validation.email.max")),
  });

export type PersonalInformationFormData = z.infer<ReturnType<typeof createPersonalInformationSchema>>;
