import mongoose from "mongoose";

import { config } from "../config/index.js";

import { logger } from "../utils/logger.js";

export async function connectMongo() {
  try {
    await mongoose.connect(
      config.mongoUri
    );

    logger.info(
      "MongoDB connected"
    );
  } catch (error) {
    logger.error(error);

    process.exit(1);
  }
}