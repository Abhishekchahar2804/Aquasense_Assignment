import mqtt from "mqtt";
import { config } from "../config/index.js";

export const mqttSubscriber =
  mqtt.connect(
    config.mqttBrokerUrl
  );

mqttSubscriber.on(
  "connect",
  () => {
    console.log(
      "SUBSCRIBER MQTT CONNECTED"
    );
  }
);

mqttSubscriber.on(
  "error",
  (error) => {
    console.error(
      "SUBSCRIBER MQTT ERROR",
      error
    );
  }
);