import { DeviceRegistry } from "./device-registry.js";
import { TopicScheduler } from "./topic-scheduler.js";
import { BurstManager } from "./burst-manager.js";
import { RetryProcessor } from "./retry-processor.js";

import { config } from "../config/index.js";
import { TOPICS } from "./constants.js";

import { logger } from "../utils/logger.js";

export class PublisherService {
  private readonly registry =
    new DeviceRegistry();

  private readonly burstManager =
    new BurstManager();

  private readonly retryProcessor =
    new RetryProcessor();

  start(): void {
    logger.info({
      message:
        "Starting publisher service",
    });

    this.retryProcessor.start();

    const topics = [
      TOPICS.TEMPERATURE,
      TOPICS.PRESSURE,
      TOPICS.FLOW,
    ];

    topics.forEach(
      (topic, index) => {
        const devices =
          this.registry.getDevicesByTopic(
            topic
          );

        const scheduler =
          new TopicScheduler(
            topic,
            config.publisherRates[index],
            devices,
            this.burstManager
          );

        void scheduler.start();

        logger.info({
          topic,
          devices: devices.length,
          publishRate:
            config.publisherRates[index],
          message:
            "Topic scheduler started",
        });
      }
    );
  }

  stop(): void {
    this.retryProcessor.stop();

    logger.info({
      message:
        "Publisher service stopped",
    });
  }
}