import { FormDataContext } from "../services/openai";
import {
  arabicContextLabels,
  englishContextLabels,
  translateEmploymentStatus,
  translateHousingStatus,
  translateMaritalStatus,
} from "./translations";

/**
 * Base prompts for different field types and languages
 */
const basePrompts = {
  en: {
    currentFinancialSituation:
      "Help me describe my current financial situation for a financial assistance application. Write a clear, honest, and professional description in 2-3 sentences that explains my financial hardship.",
    employmentCircumstances:
      "Help me describe my employment circumstances for a financial assistance application. Write a clear, honest, and professional description in 2-3 sentences about my current job situation.",
    reasonForApplying:
      "Help me explain why I am applying for financial assistance. Write a clear, honest, and professional explanation in 2-3 sentences about why I need this support.",
  },
  ar: {
    currentFinancialSituation:
      "ساعدني في وصف وضعي المالي الحالي لطلب المساعدة المالية. اكتب وصفاً واضحاً وصادقاً ومهنياً في 2-3 جمل يوضح صعوباتي المالية.",
    employmentCircumstances:
      "ساعدني في وصف ظروف عملي لطلب المساعدة المالية. اكتب وصفاً واضحاً وصادقاً ومهنياً في 2-3 جمل حول وضع عملي الحالي.",
    reasonForApplying:
      "ساعدني في شرح سبب تقديمي لطلب المساعدة المالية. اكتب شرحاً واضحاً وصادقاً ومهنياً في 2-3 جمل حول سبب حاجتي لهذا الدعم.",
  },
} as const;

/**
 * System messages for different languages
 */
export const systemMessages = {
  en: "You are a helpful assistant that helps people write professional descriptions for financial assistance applications. Keep responses concise, respectful, and appropriate for official documents. Use the provided context to create personalized and relevant suggestions.",
  ar: "أنت مساعد مفيد يساعد الناس في كتابة أوصاف مهنية لطلبات المساعدة المالية. حافظ على الردود مختصرة ومحترمة ومناسبة للوثائق الرسمية. استخدم المعلومات الإضافية المقدمة لإنشاء اقتراحات شخصية وملائمة تعكس الوضع الفعلي للشخص.",
} as const;

/**
 * Builds contextual information from form data
 */
function buildContextualInfo(formData: FormDataContext, language: string): string[] {
  const contextParts: string[] = [];
  const isArabic = language === "ar";
  const labels = isArabic ? arabicContextLabels : englishContextLabels;

  if (formData.existingText) {
    contextParts.push(`${labels.currentText}: "${formData.existingText}"`);
  }

  if (formData.familyFinancialInfo) {
    const { maritalStatus, dependents, employmentStatus, monthlyIncome, housingStatus } = formData.familyFinancialInfo;

    if (maritalStatus) {
      const translatedStatus = isArabic ? translateMaritalStatus(maritalStatus) : maritalStatus;
      contextParts.push(`${labels.maritalStatus}: ${translatedStatus}`);
    }

    if (dependents) {
      contextParts.push(`${labels.dependents}: ${dependents}`);
    }

    if (employmentStatus) {
      const translatedStatus = isArabic ? translateEmploymentStatus(employmentStatus) : employmentStatus;
      contextParts.push(`${labels.employmentStatus}: ${translatedStatus}`);
    }

    if (monthlyIncome) {
      contextParts.push(`${labels.monthlyIncome}: ${monthlyIncome} ${labels.currency}`);
    }

    if (housingStatus) {
      const translatedStatus = isArabic ? translateHousingStatus(housingStatus) : housingStatus;
      contextParts.push(`${labels.housingStatus}: ${translatedStatus}`);
    }
  }

  if (formData.personalInformation?.location) {
    contextParts.push(`${labels.location}: ${formData.personalInformation.location}`);
  }

  return contextParts;
}

/**
 * Builds a contextual prompt for AI suggestions based on field type, language, and form data
 */
export function buildContextualPrompt(
  fieldType: "currentFinancialSituation" | "employmentCircumstances" | "reasonForApplying",
  language: string,
  formData?: FormDataContext
): string {
  const langPrompts = basePrompts[language as keyof typeof basePrompts] || basePrompts.en;
  let prompt = langPrompts[fieldType] || langPrompts.currentFinancialSituation;

  // Add contextual information if form data is provided
  if (formData) {
    const contextParts = buildContextualInfo(formData, language);

    if (contextParts.length > 0) {
      const isArabic = language === "ar";
      const labels = isArabic ? arabicContextLabels : englishContextLabels;
      const separator = isArabic ? "، " : ", ";

      prompt += `\n\n${labels.additionalInfo}: ${contextParts.join(separator)}`;
    }
  }

  return prompt;
}

/**
 * Gets the appropriate system message for the given language
 */
export function getSystemMessage(language: string): string {
  return systemMessages[language as keyof typeof systemMessages] || systemMessages.en;
}
