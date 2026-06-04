import app from "./app.js";

import { config } from "./config/index.js";

import { connectMongo }
from "./services/mongo.service.js";

import { logger }
from "./utils/logger.js";

async function start() {
  await connectMongo();

  app.listen(config.port, () => {
    logger.info(
      `Server running on ${config.port}`
    );
  });
}

start();