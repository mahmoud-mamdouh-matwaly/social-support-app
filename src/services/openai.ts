import OpenAI from "openai";
import type { ErrorType } from "../utils/errorHandling";
import { categorizeError, retryWithBackoff } from "../utils/errorHandling";
import { buildContextualPrompt, getSystemMessage } from "../utils/promptBuilder";

export type FormDataContext = {
  personalInformation?: {
    name?: string;
    age?: string;
    maritalStatus?: string;
    dependents?: string;
    location?: string;
  };
  familyFinancialInfo?: {
    maritalStatus?: string;
    dependents?: string;
    employmentStatus?: string;
    monthlyIncome?: string;
    housingStatus?: string;
  };
  existingText?: string; // Any text already in the field being assisted
};

export type OpenAIRequest = {
  fieldType: "currentFinancialSituation" | "employmentCircumstances" | "reasonForApplying";
  context?: string;
  language: string;
  formData?: FormDataContext;
};

export type OpenAIResponse = {
  suggestion: string;
  success: boolean;
  error?: string;
  errorType?: ErrorType;
  retryAfter?: number; // seconds to wait before retry (for rate limits)
};

// Mock API key - in production this should be handled securely on the backend
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "mock-api-key";
const model = import.meta.env.VITE_OPENAI_MODEL || "gpt-3.5-turbo";
const maxTokens = parseInt(import.meta.env.VITE_OPENAI_MAX_TOKENS || "200");
const MAX_RETRIES = parseInt(import.meta.env.VITE_OPENAI_MAX_RETRIES || "3");
// Initialize OpenAI client
const openai =
  OPENAI_API_KEY !== "mock-api-key"
    ? new OpenAI({
        apiKey: OPENAI_API_KEY,
        dangerouslyAllowBrowser: true, // Note: In production, this should be handled on the backend
      })
    : null;

export const generateAISuggestion = async (request: OpenAIRequest): Promise<OpenAIResponse> => {
  try {
    // If no API key is provided, return a mock response
    if (!openai) {
      return getMockResponse(request);
    }

    const prompt = buildContextualPrompt(request.fieldType, request.language, request.formData);
    const systemMessage = getSystemMessage(request.language);

    const completion = await retryWithBackoff(
      async () => {
        return await openai!.chat.completions.create({
          model: model,
          messages: [
            {
              role: "system",
              content: systemMessage,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: maxTokens,
          temperature: 0.7,
        });
      },
      MAX_RETRIES,
      1000,
      request.language
    );

    const suggestion = completion.choices[0]?.message?.content?.trim();

    if (!suggestion) {
      throw new Error("No suggestion received from OpenAI");
    }

    return {
      suggestion,
      success: true,
    };
  } catch (error) {
    const errorInfo = categorizeError(error instanceof Error ? error : new Error(String(error)), request.language);

    // Return a structured error response
    return {
      suggestion: "",
      success: false,
      error: errorInfo.userMessage,
      errorType: errorInfo.type,
      retryAfter: errorInfo.retryAfter,
    };
  }
};

// Mock responses for development/testing
const getMockResponse = (request: OpenAIRequest): Promise<OpenAIResponse> => {
  const baseMockResponses = {
    en: {
      currentFinancialSituation:
        "I am currently facing significant financial difficulties due to unexpected medical expenses and reduced income. My monthly expenses exceed my current earnings, making it challenging to cover basic necessities like rent, utilities, and groceries. I am seeking financial assistance to help stabilize my situation while I work towards improving my circumstances.",
      employmentCircumstances:
        "I am currently unemployed after being laid off from my previous position three months ago. Despite actively searching for new employment opportunities and submitting numerous applications, I have not yet secured a new job. I am committed to finding stable employment and am willing to accept any suitable position to support myself and my family.",
      reasonForApplying:
        "I am applying for financial assistance because my current financial situation prevents me from meeting my basic living expenses. This support would provide crucial relief during this challenging period and help me maintain housing stability while I continue my job search and work towards financial independence.",
    },
    ar: {
      currentFinancialSituation:
        "أواجه حالياً صعوبات مالية كبيرة بسبب نفقات طبية غير متوقعة وانخفاض في الدخل. مصاريفي الشهرية تتجاوز أرباحي الحالية، مما يجعل من الصعب تغطية الضروريات الأساسية مثل الإيجار والمرافق والطعام. أسعى للحصول على مساعدة مالية لتساعدني في استقرار وضعي بينما أعمل على تحسين ظروفي.",
      employmentCircumstances:
        "أنا عاطل عن العمل حالياً بعد أن تم تسريحي من منصبي السابق منذ ثلاثة أشهر. رغم بحثي النشط عن فرص عمل جديدة وتقديم العديد من الطلبات، لم أحصل بعد على وظيفة جديدة. أنا ملتزم بإيجاد عمل مستقر وعلى استعداد لقبول أي منصب مناسب لإعالة نفسي وعائلتي.",
      reasonForApplying:
        "أتقدم بطلب للحصول على مساعدة مالية لأن وضعي المالي الحالي يمنعني من تلبية نفقات المعيشة الأساسية. هذا الدعم سيوفر راحة مهمة خلال هذه الفترة الصعبة ويساعدني في الحفاظ على استقرار السكن بينما أواصل البحث عن عمل والعمل نحو الاستقلال المالي.",
    },
  };

  const langResponses = baseMockResponses[request.language as keyof typeof baseMockResponses] || baseMockResponses.en;
  let suggestion = langResponses[request.fieldType as keyof typeof langResponses] || langResponses.currentFinancialSituation;

  // Enhance mock response with form data context if available
  if (request.formData?.familyFinancialInfo) {
    const { employmentStatus, dependents } = request.formData.familyFinancialInfo;

    if (employmentStatus === "unemployed" && request.fieldType === "employmentCircumstances") {
      suggestion =
        request.language === "ar"
          ? "أنا حالياً عاطل عن العمل وأواجه صعوبات في إيجاد عمل مناسب. أبحث بنشاط عن فرص عمل وأتقدم للوظائف المتاحة يومياً. أحتاج إلى الدعم المالي لتغطية احتياجاتي الأساسية خلال فترة البحث عن عمل."
          : "I am currently unemployed and facing challenges in finding suitable employment. I am actively job searching and applying for available positions daily. I need financial support to cover my basic needs during this job search period.";
    }

    if (dependents && parseInt(dependents) > 0) {
      const dependentsText =
        request.language === "ar"
          ? ` لدي ${dependents} من المعالين الذين أتحمل مسؤولية إعالتهم.`
          : ` I have ${dependents} dependents who rely on me for support.`;
      suggestion += dependentsText;
    }
  }

  // Simulate API delay
  return new Promise<OpenAIResponse>((resolve) => {
    setTimeout(() => {
      resolve({
        suggestion,
        success: true,
      });
    }, 1000 + Math.random() * 2000); // 1-3 second delay
  });
};
