/**
 * Utility functions for translating form field values to Arabic
 */

export const translateMaritalStatus = (status: string): string => {
  switch (status) {
    case "single":
      return "أعزب";
    case "married":
      return "متزوج";
    case "divorced":
      return "مطلق";
    case "widowed":
      return "أرمل";
    default:
      return status;
  }
};

export const translateEmploymentStatus = (status: string): string => {
  switch (status) {
    case "employed":
      return "موظف";
    case "unemployed":
      return "عاطل عن العمل";
    case "self-employed":
      return "يعمل لحسابه الخاص";
    case "student":
      return "طالب";
    case "retired":
      return "متقاعد";
    default:
      return status;
  }
};

export const translateHousingStatus = (status: string): string => {
  switch (status) {
    case "own":
      return "ملك";
    case "rent":
      return "إيجار";
    case "family":
      return "مع العائلة";
    case "other":
      return "أخرى";
    default:
      return status;
  }
};

/**
 * Context field labels in Arabic
 */
export const arabicContextLabels = {
  currentText: "النص الحالي",
  maritalStatus: "الحالة الاجتماعية",
  dependents: "عدد المعالين",
  employmentStatus: "حالة العمل",
  monthlyIncome: "الدخل الشهري",
  housingStatus: "وضع السكن",
  location: "الموقع",
  additionalInfo: "معلومات إضافية",
  currency: "درهم",
} as const;

/**
 * Context field labels in English
 */
export const englishContextLabels = {
  currentText: "Current text",
  maritalStatus: "Marital status",
  dependents: "Number of dependents",
  employmentStatus: "Employment status",
  monthlyIncome: "Monthly income",
  housingStatus: "Housing situation",
  location: "Location",
  additionalInfo: "Additional context",
  currency: "AED",
} as const;
