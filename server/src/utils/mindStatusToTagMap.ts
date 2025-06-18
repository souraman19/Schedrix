export function getSuggestedTagsForMindset(mindset: string): string[] {
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

  return tagMap[mindset] || tagMap["Default"];
}
