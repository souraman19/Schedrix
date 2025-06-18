export function getSuggestedTagsForMindset(mindset: string): string[] {
  const tagMap: Record<string, string[]> = {
    Focused: [
      "deep work",
      "productivity",
      "no distractions",
      "flow state",
      "minimalism",
      "consistency",
      "mental clarity",
    ],
    Distracted: [
      "focus tips",
      "avoid distractions",
      "mindfulness",
      "attention",
      "dopamine detox",
      "reset mind",
      "get back",
    ],
    Tired: [
      "rest",
      "sleep",
      "calm",
      "recharge",
      "mental fatigue",
      "soothing",
      "relax",
    ],
    Stressed: [
      "stress relief",
      "breathing",
      "unwind",
      "meditation",
      "perspective",
      "slow down",
      "peace",
    ],
    Motivated: [
      "inspiration",
      "success",
      "hustle",
      "grind",
      "energy",
      "goal setting",
      "stay strong",
    ],
    Default: [
      "general",
      "uplifting",
      "positive",
      "life",
      "balance",
      "thoughtful",
      "quotes",
    ],
  };

  return tagMap[mindset] || tagMap["Default"];
}
