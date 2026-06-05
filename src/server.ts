import app from "./app.js";

import { config } from "./config/index.js";
import { metricsService } from "./services/metrics-instance.js";

import { connectMongo }
  from "./services/mongo.service.js";

import { SubscriberService }
  from "./subscriber/subscriber.service.js";

import { logger }
  from "./utils/logger.js";

const subscriber = new SubscriberService();

async function start() {
  await connectMongo();
  metricsService.startSnapshotting();
  subscriber.start();

  app.listen(config.port, () => {
    logger.info(
      `Server running on ${config.port}`
    );
  });
}

start();