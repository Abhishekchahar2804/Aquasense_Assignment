import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string(),

  MQTT_BROKER_URL: z.string(),

  MONGO_URI: z.string(),

  BATCH_SIZE: z.string(),

  FLUSH_INTERVAL_MS: z.string(),

  PUBLISHER_RATE_PER_TOPIC: z.string(),

  LOG_LEVEL: z.string()
});

const env = envSchema.parse(process.env);

export const config = {
  port: Number(env.PORT),

  mqttBrokerUrl: env.MQTT_BROKER_URL,

  mongoUri: env.MONGO_URI,

  batchSize: Number(env.BATCH_SIZE),

  flushIntervalMs: Number(env.FLUSH_INTERVAL_MS),

  publisherRates: env.PUBLISHER_RATE_PER_TOPIC
    .split(",")
    .map(Number),

  logLevel: env.LOG_LEVEL
};