import mqtt from "mqtt";

import { config } from "../config/index.js";

import { logger } from "../utils/logger.js";

export const mqttClient = mqtt.connect(
  config.mqttBrokerUrl
);

mqttClient.on("connect", () => {
  logger.info("Publisher connected to MQTT broker");
});

mqttClient.on("error", (error) => {
  logger.error(error);
});

mqttClient.on("reconnect", () => {
  logger.warn("Reconnecting to MQTT broker...");
});