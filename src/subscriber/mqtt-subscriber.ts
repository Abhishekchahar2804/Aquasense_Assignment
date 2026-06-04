import mqtt from "mqtt";

import { config }
from "../config/index.js";

export const mqttSubscriber =
  mqtt.connect(
    config.mqttBrokerUrl
  );