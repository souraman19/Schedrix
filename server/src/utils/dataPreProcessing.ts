interface Point {
    day: number;
    month: number;
    pointsGain: number;
    pointsDeduct: number;
    taskCompleted: number;
    taskMissed: number; //today tasks which had deadline but missed
    mindStatus: string;
}

export interface ProcessedPoint extends Point {
    totalPoints: number;
    cumulativePoints: number;
    rollingAvgPoints: number;
}


export interface LabeledDataPoint {
    features: number[][],
    labels: string[],
}


export const preProcessData = (points: Point[]) : ProcessedPoint[] => {
    let cumulativePoints = 0;
    const processedData = points.map((point, index) => {
        const totalPoints = point.pointsGain - point.pointsDeduct;

        cumulativePoints += totalPoints;

        const rollingAvgPoints = index >= 2
            ? points.slice(index - 2, index + 1).reduce((sum, p) => sum + (p.pointsGain - p.pointsDeduct), 0)/3 
            : 0;
        

        return {
            ...point,
            totalPoints,
            cumulativePoints,
            rollingAvgPoints,
        }
    })

    return processedData;
}