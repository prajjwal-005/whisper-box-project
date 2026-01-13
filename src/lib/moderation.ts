import OpenAI from 'openai';

// --- Definitions ---
export type ModerationAction = 'ALLOW' | 'WARN' | 'BLUR' | 'HIDE' | 'BLOCK';
export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface AnalysisLabels {
  abusive: boolean;
  sexual: boolean;
  sexualHarassment: boolean;
  threatening: boolean;
  spam: boolean;
}

export interface ModerationResult {
  flagged: boolean;
  action: ModerationAction;
  severity: Severity;
  labels: AnalysisLabels;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const HARD_BLOCK_PATTERNS = [
  /\bf[\W_]*u+[\W_]*c+[\W_]*k+\b/i,
  /\bc[\W_]*u+[\W_]*n[\W_]*t+\b/i,
 
];


const BLUR_PATTERNS = [
  /\bs[\W_]*e+[\W_]*x+\b/i,
  /\bn[\W_]*u[\W_]*d[\W_]*e+s?\b/i,
  /\bp[\W_]*u[\W_]*s+[\W_]*y+\b/i,
  /\bd[\W_]*i+[\W_]*c[\W_]*k+\b/i,
];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u200B-\u200D\uFEFF]/g, '') 
    .replace(/\s+/g, ' ')                  
    .trim();
}

// --- STAGE 1: Pre-Moderation Guardrails ---
function preScreenContent(rawText: string): ModerationResult | null {
  const text = normalizeText(rawText);

  if (!text) {
    return {
      flagged: true,
      action: 'BLOCK',
      severity: 'LOW',
      labels: { abusive: false, sexual: false, sexualHarassment: false, threatening: false, spam: true }
    };
  }


  const shuffledHardPatterns = [...HARD_BLOCK_PATTERNS].sort(() => Math.random() - 0.5);
  const isHardBlocked = shuffledHardPatterns.some(pattern => pattern.test(text));
  
  if (isHardBlocked) {
    return {
      flagged: true,
      action: 'BLOCK',
      severity: 'HIGH',
      labels: { abusive: true, sexual: false, sexualHarassment: false, threatening: false, spam: false }
    };
  }

  
  const shuffledBlurPatterns = [...BLUR_PATTERNS].sort(() => Math.random() - 0.5);
  const shouldBlur = shuffledBlurPatterns.some(pattern => pattern.test(text));
  
  if (shouldBlur) {
    return {
      flagged: true,
      action: 'BLUR',
      severity: 'MEDIUM',
      labels: { abusive: false, sexual: true, sexualHarassment: false, threatening: false, spam: false }
    };
  }

  if (text.length > 500) {
    return {
      flagged: true,
      action: 'BLOCK',
      severity: 'LOW', 
      labels: { abusive: false, sexual: false, sexualHarassment: false, threatening: false, spam: true }
    };
  }

  if (/(.)\1{9,}/.test(text)) {
    return {
      flagged: true,
      action: 'WARN', 
      severity: 'LOW',
      labels: { abusive: false, sexual: false, sexualHarassment: false, threatening: false, spam: true }
    };
  }

  return null;
}

// --- STAGE 2: Intent Classification (AI) ---
async function analyzeIntent(text: string): Promise<AnalysisLabels> {
  try {
    const response = await openai.moderations.create({ 
      model: "omni-moderation-latest", 
      input: text 
    });
    
    const result = response.results[0];
    const cat = result.categories;

    const isSexual = cat.sexual || cat['sexual/minors'];
    const isThreatening = 
      cat.violence || 
      cat['violence/graphic'] || 
      cat['hate/threatening'] || 
      cat['harassment/threatening'] || 
      cat['self-harm']; 

    const isHarassmentBase = cat.harassment || cat.hate;
    const hasRequestKeywords = /\b(send|show|give|want|need)\b/i.test(text);
    const isSolicitation = isSexual && hasRequestKeywords;

    const isSexualHarassment = 
      (cat.harassment && isSexual) || 
      (isSexual && isThreatening) ||
      (isSexual && isHarassmentBase) ||
      isSolicitation;


    const linkCount = (text.match(/https?:\/\//gi) || []).length;
    const hasMultipleLinks = linkCount >= 2;
    const hasSuspiciousPatterns = /\b(click here|buy now|limited time|act now|free money|get rich|weight loss)\b/i.test(text);
    
    return {
      abusive: isHarassmentBase,
      sexual: isSexual,
      sexualHarassment: isSexualHarassment,
      threatening: isThreatening,
      spam: linkCount >= 1 || hasMultipleLinks || hasSuspiciousPatterns
    };

  } catch (error) {
    console.error("Moderation API Failed:", error);
    return {
      abusive: true, 
      sexual: false,
      sexualHarassment: false,
      threatening: false,
      spam: false
    };
  }
}

// --- STAGE 3: Policy Decision Engine ---
function calculateSeverity(labels: AnalysisLabels): Severity {
  if (labels.threatening) return 'CRITICAL';
  if (labels.sexualHarassment) return 'HIGH';
  if (labels.abusive && labels.sexual) return 'HIGH';
  if (labels.abusive) return 'MEDIUM';
  if (labels.sexual) return 'MEDIUM';
  if (labels.spam) return 'LOW'; 
  return 'LOW';
}

function mapDecision(
  severity: Severity, 
  labels: AnalysisLabels, 
  violationCount: number
): ModerationAction {
  if (violationCount >= 2 && severity === 'MEDIUM') {
    return 'BLOCK';
  }

  if (severity === 'CRITICAL' || severity === 'HIGH') {
    return 'BLOCK'; 
  }

  if (severity === 'MEDIUM') {
    if (labels.sexual) return 'BLUR';
    return 'HIDE';
  }

  if (labels.spam) return 'WARN'; 
  return 'ALLOW';
}

export async function moderateContent(text: string, violationCount: number = 0): Promise<ModerationResult> {
  const preScreenResult = preScreenContent(text);
  if (preScreenResult) {
    if (process.env.NODE_ENV !== 'production') {
       console.log('[Pre-Screen] Action taken:', preScreenResult.action);
    }
    return preScreenResult;
  }

  const labels = await analyzeIntent(text);
  const severity = calculateSeverity(labels);
  const action = mapDecision(severity, labels, violationCount);

  if (severity !== 'LOW') {
    console.log('[Policy Engine]', { action, severity });
  }

  return { flagged: severity !== 'LOW', action, severity, labels };
}