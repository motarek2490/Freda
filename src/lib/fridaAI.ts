/**
 * FRIDA AI CREATIVE DIRECTOR & CONTENT ASSISTANT (client)
 *
 * This file NEVER talks to Gemini directly and NEVER reads a Gemini API key
 * in the browser. The real AI calls run inside the `suggestAIDesignConfig`
 * and `generateAIWording` Cloud Functions (see functions/src/index.ts),
 * where the key is bound as a managed secret and stays server-side only.
 *
 * If you're tempted to add `VITE_GEMINI_API_KEY` or read `process.env` /
 * `window.GEMINI_API_KEY` here again — don't. Any `VITE_`-prefixed value is
 * compiled as plaintext into the shipped JS bundle and is readable by every
 * visitor.
 */

import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

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
 * Translates couple's natural prompt into structured design configuration.
 * Calls the suggestAIDesignConfig Cloud Function; falls back to a sensible
 * local default if the function is unreachable or AI is not configured.
 */
export async function suggestDesignConfigWithAI(
  userPrompt: string
): Promise<AIDesignRecommendation> {
  try {
    const call = httpsCallable<{ userPrompt: string }, AIDesignRecommendation>(
      functions,
      'suggestAIDesignConfig'
    );
    const result = await call({ userPrompt });
    const parsed = result.data;
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
  } catch (err) {
    console.warn('AI Creative Director unavailable, using fallback:', err);
    return getFallbackDesignRecommendation(userPrompt);
  }
}

/**
 * Generates custom invitation wording prose based on couple names and tone.
 * Calls the generateAIWording Cloud Function; falls back to a static
 * template if the function is unreachable or AI is not configured.
 */
export async function generateWordingWithAI(req: AIWordingRequest): Promise<string> {
  try {
    const call = httpsCallable<AIWordingRequest, { text: string }>(functions, 'generateAIWording');
    const result = await call(req);
    if (result.data?.text) {
      return result.data.text;
    }
  } catch (err) {
    console.warn('AI Wording generation unavailable, using fallback:', err);
  }

  const isArabic = req.language !== 'en';
  return isArabic
    ? `فرحتنا لا تكتمل إلا بوجودكم معنا. تتشرف عائلاتنا بدعوتكم لحضور حفل زفاف ${req.coupleNames} في ليلة تملؤها البهجة والمحبة.`
    : `We would be honored by your presence at ${req.coupleNames}'s wedding celebration.`;
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
