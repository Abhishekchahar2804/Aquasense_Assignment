import { mqttClient }
from "./mqtt-client.js";

import { logger }
from "../utils/logger.js";

export async function publishMessage(
  topic: string,
  payload: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    mqttClient.publish(
      topic,
      payload,
      {
        qos: 1
      },
      (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      }
    );
  });
}