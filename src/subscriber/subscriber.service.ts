import {
  mqttSubscriber
}
  from "./mqtt-subscriber.js";

import {
  validatePayload
}
  from "./validator.js";

import {
  verifyChecksum
}
  from "./checksum-verifier.js";

import {
  enrichPayload
}
  from "./enricher.js";

import { logger }
  from "../utils/logger.js";

import {
  queueManager
}
  from "./queue-manager-instance.js";
import { BatchWriterManager } from "./batch-writer-manager.js";
import { metricsService } from "../services/metrics-instance.js";

export class SubscriberService {

  private readonly batchWriterManager = new BatchWriterManager();

  start() {
    this.batchWriterManager
      .start();

    mqttSubscriber.on(
      "connect",
      () => {

        mqttSubscriber.subscribe(
          "sensors/#"
        );

        logger.info({
          message:
            "Subscribed to sensors/#"
        });

      }
    );

    mqttSubscriber.on(
      "message",
      (topic, message) => {

        try {


          const payload =
            JSON.parse(
              message.toString()
            );

          metricsService
            .incrementReceived(
              topic
            );

          if (
            !validatePayload(
              payload
            )
          ) {

            logger.warn({
              topic,
              message:
                "Invalid payload"
            });

            return;
          }

          metricsService
            .incrementValidated(
              topic
            );

          if (
            !verifyChecksum(
              payload
            )
          ) {

            logger.warn({
              topic,
              device:
                payload.device_id,
              message:
                "Checksum failed"
            });

            metricsService
              .incrementCorruptDropped(
                topic
              );

            return;
          }

          const enriched =
            enrichPayload(
              topic,
              payload
            );

          const queued =
            queueManager.enqueue(
              topic,
              enriched
            );

          if (!queued) {

            logger.error({
              topic,
              message:
                "Queue full. Message dropped."
            });

          }

          metricsService.updateQueueDepth(
            topic,
            queueManager.getQueueDepth(topic)
          );

        } catch (error) {

          logger.error({
            topic,
            error,
          });

        }

      }
    );
  }
}