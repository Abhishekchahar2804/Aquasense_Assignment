import { TOPICS } from "./constants.js";

export function generateSensorValue(
  topic: string
): number {
  switch (topic) {
    case TOPICS.TEMPERATURE:
      return Number(
        (15 + Math.random() * 25)
          .toFixed(2)
      );

    case TOPICS.PRESSURE:
      return Number(
        (900 + Math.random() * 200)
          .toFixed(2)
      );

    case TOPICS.FLOW:
      return Number(
        (10 + Math.random() * 190)
          .toFixed(2)
      );

    default:
      return 0;
  }
}