import { publishMessage } from "./publish.js";
import { retryQueue } from "./retry-queue-instance.js";

import { logger } from "../utils/logger.js";

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

export class RetryProcessor {
  private isRunning = false;

  start(): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;

    logger.info({
      message: "Retry processor started",
    });

    void this.processLoop();
  }

  stop(): void {
    this.isRunning = false;

    logger.info({
      message: "Retry processor stopped",
    });
  }

  private async processLoop(): Promise<void> {
    while (this.isRunning) {
      const message =
        retryQueue.getNext();

      if (!message) {
        await this.sleep(500);
        continue;
      }

      const now = Date.now();

      if (message.nextRetryAt > now) {
        retryQueue.add(message);

        await this.sleep(100);

        continue;
      }

      try {
        await publishMessage(
          message.topic,
          message.payload
        );

        logger.info({
          topic: message.topic,
          attempts: message.attempts,
          message: "Retry successful",
        });
      } catch (error) {
        message.attempts++;

        if (
          message.attempts >
          MAX_RETRIES
        ) {
          logger.error({
            topic: message.topic,
            attempts: message.attempts,
            error,
            message:
              "Message permanently lost",
          });

          continue;
        }

        const delay =
          BASE_DELAY_MS *
          Math.pow(
            2,
            message.attempts
          );

        message.nextRetryAt =
          Date.now() + delay;

        retryQueue.add(message);

        logger.warn({
          topic: message.topic,
          attempts: message.attempts,
          nextRetryInMs: delay,
          queueSize: retryQueue.size(),
          message:
            "Retry scheduled",
        });
      }
    }
  }

  private sleep(
    ms: number
  ): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}