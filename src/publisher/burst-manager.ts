import { TOPICS }
from "./constants.js";

const topics = [
  TOPICS.TEMPERATURE,
  TOPICS.PRESSURE,
  TOPICS.FLOW
];

export class BurstManager {

  private burstTopic:
    string | null = null;

  constructor() {

    setInterval(() => {

      const randomIndex =
        Math.floor(
          Math.random() *
          topics.length
        );

      this.burstTopic =
        topics[randomIndex];

      setTimeout(() => {

        this.burstTopic =
          null;

      }, 5000);

    }, 30000);
  }

  getMultiplier(
    topic: string
  ): number {

    if (
      this.burstTopic === topic
    ) {
      return 5;
    }

    return 1;
  }
}