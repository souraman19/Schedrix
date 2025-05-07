import { ProcessedPoint, LabeledDataPoint } from "./dataPreProcessing";

export const convertToFeaturesAndLabels = (processedData: ProcessedPoint[]): LabeledDataPoint => {

    const features: number[][] = [];
    const labels: string[] = [];

    for (const point of processedData){
        features.push([
            point.day,
            point.month,
            point.totalPoints,
            point.cumulativePoints,
            point.rollingAvgPoints,
            point.taskCompleted,
            point.taskMissed,
            point.pointsGain,
            point.pointsDeduct,
        ])
        labels.push(point.mindStatus);
    }


    return {features, labels};
}