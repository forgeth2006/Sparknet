/**
 * Mock Moderation Service [SRS 5.5 AI Content Safety Policy]
 * Simulates an AI/NLP-based toxicity and risk scoring service.
 */

const TOXIC_PATTERNS = [
  { word: 'violence', weight: 0.8 },
  { word: 'kill', weight: 0.9 },
  { word: 'spam', weight: 0.5 },
  { word: 'hate', weight: 0.7 },
  { word: 'idiot', weight: 0.4 },
  { word: 'stupid', weight: 0.3 },
  { word: 'abuse', weight: 0.8 }
];

export const analyzeContent = async (text) => {
  // Mock external API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  if (!text) {
    return { riskScore: 0, isFlagged: false, remark: "Clean content" };
  }

  const lowerText = text.toLowerCase();
  
  let totalRisk = 0;
  let matches = [];

  for (const pattern of TOXIC_PATTERNS) {
    if (lowerText.includes(pattern.word)) {
      totalRisk += pattern.weight;
      matches.push(pattern.word);
    }
  }

  // Cap risk score at 1.0
  const riskScore = Math.min(totalRisk, 1.0);
  
  // Flag if risk reaches medium threshold (0.5) [SRS 5.5.3 Risk Scoring]
  const isFlagged = riskScore >= 0.5;

  let remark = isFlagged 
    ? `Flagged for potential harmful content (matched: ${matches.join(', ')})`
    : "Content cleared";

  return {
    riskScore,
    isFlagged,
    remark
  };
};

export const applyTrustPenalty = (currentTrustScore, riskScore) => {
  if (riskScore < 0.3) return currentTrustScore;
  
  // Higher risk drops trust score significantly [SRS 5.1 Account Trust Score]
  const penalty = Math.floor(riskScore * 20); // e.g. 0.8 * 20 = 16 points
  return Math.max(0, currentTrustScore - penalty);
};
