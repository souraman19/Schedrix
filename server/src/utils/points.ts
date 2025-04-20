export const pointBase = {
    "critical": 75,
    "high": 50,
    "medium": 25,
    "low": 10,
} as const

export const penaltyPerDay = {
    "critical": 30,
    "high": 20,
    "medium": 10,
    "low": 5,
} as const

export type PriorityLevel = keyof typeof penaltyPerDay;
