import { SensorPayload }
from "./sensor-payload.js";

export interface EnrichedSensorPayload
  extends SensorPayload {

  topic: string;

  received_at: Date;

  processing_latency_ms: number;
}