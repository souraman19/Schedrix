const tagMap: Record<string, string[]> = {
    Focused: [
      "deep work",
      "productivity",
      "focus",
      "flow",
      "clarity",
      "consistency",
      "minimalism"
    ],
    Distracted: [
      "focus",
      "mindfulness",
      "attention",
      "dopamine detox",
      "reset",
      "clarity",
      "balance"
    ],
    Tired: [
      "rest",
      "recharge",
      "sleep",
      "calm",
      "soothing",
      "mental fatigue",
      "relax"
    ],
    Stressed: [
      "stress relief",
      "peace",
      "breathe",
      "meditation",
      "unwind",
      "perspective",
      "slow down"
    ],
    Motivated: [
      "inspiration",
      "success",
      "goal",
      "energy",
      "hustle",
      "grind",
      "strong"
    ],
    Default: [
      "quote",
      "life",
      "positive",
      "uplift",
      "balance",
      "thoughtful",
      "inspiration"
    ]
};


export function getSuggestedTagsForMindset(mindset: string): string[] {
  return tagMap[mindset] || tagMap["Default"];
}


const candidateSet = new Set(Object.values(tagMap).flat());
export const candidateTags = Array.from(candidateSet);




