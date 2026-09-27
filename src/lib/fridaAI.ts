/**
 * FRIDA AI CREATIVE DIRECTOR & CONTENT ASSISTANT
 * Server-side AI engine powered by Google Gemini (@google/genai SDK)
 * Helps couples design their wedding experience and write personalized invitation wording.
 */

import { GoogleGenAI } from '@google/genai';

export interface AIDesignRecommendation {
  themeStyle: 'luxury' | 'classic' | 'minimal' | 'boho' | 'romantic' | 'playful' | 'floral';
  openingExperience: string;
  recommendedTemplateId: string;
  colors: {
    bg: string;
    cardBg: string;
    text: string;
    accent: string;
  };
  typography: string;
  wordingTone: string;
  suggestedPoeticMessage: string;
}

export interface AIWordingRequest {
  coupleNames: string;
  eventType?: string;
  tone?: 'royal_formal' | 'poetic_romantic' | 'modern_minimal' | 'warm_family' | 'egyptian_traditional';
  language?: 'ar' | 'en';
  additionalDetails?: string;
}

/**
 * Initializes Gemini AI client safely
 */
function getGenAIClient(): GoogleGenAI | null {
  const apiKey =
    (typeof process !== 'undefined' && process.env.GEMINI_API_KEY) ||
    (import.meta as any).env?.VITE_GEMINI_API_KEY ||
    (typeof window !== 'undefined' && (window as any).GEMINI_API_KEY);

  if (!apiKey) return null;

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Translates couple's natural prompt into structured design configuration
 */
export async function suggestDesignConfigWithAI(
  userPrompt: string
): Promise<AIDesignRecommendation> {
  const ai = getGenAIClient();

  // Smart fallback if AI key is unavailable or during offline preview
  if (!ai) {
    return getFallbackDesignRecommendation(userPrompt);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `أنت المخرج الفني ومصمم التجارب الرقمية لمنصة FRIDA للدعوات الملكية.
المستخدم كتب الوصف التالي لزفافه أو مناسبته:
"${userPrompt}"

حلل طلب المستخدم واقترح الإعدادات الفنية والتصميمية المناسبة. ارجع النتيجة كـ JSON حقيقي يحتوي على الحقول التالية:
- themeStyle: واحد من ("luxury", "classic", "minimal", "boho", "romantic", "playful", "floral")
- openingExperience: واحد من ("royal_door", "envelope_seal", "palace_entrance", "garden_reveal", "moonlight_reveal")
- recommendedTemplateId: "frida-royal-001" أو "frida-couture-2026" أو "frida-engagement-baroque"
- colors: كائن به (bg, cardBg, text, accent) بصيغة Hex
- typography: اسم خط مثل "font-playfair" أو "font-serif" أو "font-cairo"
- wordingTone: اسم النبرة بالعربية
- suggestedPoeticMessage: نص ترحيبي أو بيتي شعر راقٍ يعبر عن الفرحة باللغة العربية`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return {
        themeStyle: parsed.themeStyle || 'luxury',
        openingExperience: parsed.openingExperience || 'royal_door',
        recommendedTemplateId: parsed.recommendedTemplateId || 'frida-couture-2026',
        colors: parsed.colors || { bg: '#0B132B', cardBg: '#1C2541', text: '#F8F9FA', accent: '#C5A880' },
        typography: parsed.typography || 'font-serif',
        wordingTone: parsed.wordingTone || 'ملكي فاخر',
        suggestedPoeticMessage:
          parsed.suggestedPoeticMessage ||
          'فرحتنا اليوم اكتملت بوجودكم معنا، نتشرف بدعوتكم لمشاركتنا أجمل لحظات عمرنا.',
      };
    }
  } catch (err) {
    console.warn('AI Creative Director error, using fallback:', err);
  }

  return getFallbackDesignRecommendation(userPrompt);
}

/**
 * Generates custom invitation wording prose based on couple names and tone
 */
export async function generateWordingWithAI(req: AIWordingRequest): Promise<string> {
  const ai = getGenAIClient();

  if (!ai) {
    return `فرحتنا لا تكتمل إلا بوجودكم معنا. تتشرف عائلاتنا بدعوتكم لحضور حفل زفاف ${req.coupleNames} في ليلة تملؤها البهجة والمحبة.`;
  }

  try {
    const isArabic = req.language !== 'en';
    const prompt = isArabic
      ? `اكتب صيغة دعوة زفاف فاخرة بأسلوب منصة فريدا الدعوات الرقمية.
اسم العروسين: ${req.coupleNames}
النبرة والأسلوب: ${req.tone || 'ملكياً راقياً وشاعرياً'}
المشهد: ${req.additionalDetails || 'حفل زفاف راقٍ بأجواء من الدفء والمحبة'}
المطلوب: فقرة ترحيبية واحدة دافئة وراقية من 2 إلى 3 أسطر تعبر عن فرحة الأهالي والعروسين.`
      : `Write a luxury wedding invitation message for ${req.coupleNames} in an elegant, poetic, and heartwarming tone.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    if (response.text) {
      return response.text.trim();
    }
  } catch (err) {
    console.warn('AI Wording generation warning:', err);
  }

  return `يسرنا أن تتفضلوا بمشاركتنا فرحتنا الكبرى بعقد قران وزفاف ${req.coupleNames} في أمسية استثنائية نتطلع إليها بشوق.`;
}

function getFallbackDesignRecommendation(prompt: string): AIDesignRecommendation {
  const lower = prompt.toLowerCase();
  if (lower.includes('كلاسيك') || lower.includes('classic') || lower.includes('أبيض')) {
    return {
      themeStyle: 'classic',
      openingExperience: 'envelope_seal',
      recommendedTemplateId: 'frida-couture-2026',
      colors: { bg: '#FAF8F5', cardBg: '#FFFFFF', text: '#1C1917', accent: '#C9A86A' },
      typography: 'font-serif',
      wordingTone: 'كلاسيكي هوت كوتور',
      suggestedPoeticMessage:
        'يسرنا دعوتكم لمشاركتنا ليلة العمر والاحتفال بزفافنا المبارك بأجواء كلاسيكية ساحرة.',
    };
  }

  return {
    themeStyle: 'luxury',
    openingExperience: 'royal_door',
    recommendedTemplateId: 'frida-royal-001',
    colors: { bg: '#0B132B', cardBg: '#1C2541', text: '#F8F9FA', accent: '#C5A880' },
    typography: 'font-playfair',
    wordingTone: 'ملكي فاخر',
    suggestedPoeticMessage:
      'تتشرف عائلاتنا بدعوتكم لمشاركتنا الفرحة الكبرى بليلة العمر في أمسية تملؤها الفخامة والمحبة.',
  };
}
