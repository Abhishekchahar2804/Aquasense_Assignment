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

export class SubscriberService {

  start() {

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

            return;
          }

          const enriched =
            enrichPayload(
              topic,
              payload
            );

          console.log(
            enriched
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