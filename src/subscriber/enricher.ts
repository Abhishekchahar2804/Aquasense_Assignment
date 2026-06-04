import { SensorPayload }
from "../types/sensor-payload.js";

import { EnrichedSensorPayload }
from "../types/enriched-sensor-payload.js";

export function enrichPayload(
  topic: string,
  payload: SensorPayload
): EnrichedSensorPayload {

  const receivedAt =
    new Date();

  const latency =
    receivedAt.getTime() -
    new Date(
      payload.timestamp
    ).getTime();

  return {
    ...payload,

    topic,

    received_at:
      receivedAt,

    processing_latency_ms:
      latency,
  };
}