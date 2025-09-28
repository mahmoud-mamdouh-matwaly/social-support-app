import OpenAI from "openai";

export type OpenAIRequest = {
  fieldType: "currentFinancialSituation" | "employmentCircumstances" | "reasonForApplying";
  context?: string;
  language: string;
};

export type OpenAIResponse = {
  suggestion: string;
  success: boolean;
  error?: string;
};

// Mock API key - in production this should be handled securely on the backend
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "mock-api-key";
const model = import.meta.env.VITE_OPENAI_MODEL || "gpt-3.5-turbo";
const maxTokens = parseInt(import.meta.env.VITE_OPENAI_MAX_TOKENS || "200");
// Initialize OpenAI client
const openai =
  OPENAI_API_KEY !== "mock-api-key"
    ? new OpenAI({
        apiKey: OPENAI_API_KEY,
        dangerouslyAllowBrowser: true, // Note: In production, this should be handled on the backend
      })
    : null;

const getPromptForField = (fieldType: string, language: string): string => {
  const prompts = {
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
  };

  const langPrompts = prompts[language as keyof typeof prompts] || prompts.en;
  return langPrompts[fieldType as keyof typeof langPrompts] || langPrompts.currentFinancialSituation;
};

export const generateAISuggestion = async (request: OpenAIRequest): Promise<OpenAIResponse> => {
  try {
    // If no API key is provided, return a mock response
    if (!openai) {
      return getMockResponse(request);
    }

    const prompt = getPromptForField(request.fieldType, request.language);

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that helps people write professional descriptions for financial assistance applications. Keep responses concise, respectful, and appropriate for official documents.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    const suggestion = completion.choices[0]?.message?.content?.trim();

    if (!suggestion) {
      throw new Error("No suggestion received from OpenAI");
    }

    return {
      suggestion,
      success: true,
    };
  } catch (error) {
    console.error("OpenAI API error:", error);

    // Return a fallback response in case of error
    return {
      suggestion: "",
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate suggestion",
    };
  }
};

// Mock responses for development/testing
const getMockResponse = (request: OpenAIRequest): Promise<OpenAIResponse> => {
  const mockResponses = {
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

  const langResponses = mockResponses[request.language as keyof typeof mockResponses] || mockResponses.en;
  const suggestion =
    langResponses[request.fieldType as keyof typeof langResponses] || langResponses.currentFinancialSituation;

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
