import { SensorPayload }
from "../types/sensor-payload.js";

export function validatePayload(
  payload: unknown
): payload is SensorPayload {

  if (
    typeof payload !== "object" ||
    payload === null
  ) {
    return false;
  }

  const data =
    payload as SensorPayload;

  return (
    typeof data.device_id ===
      "string" &&

    typeof data.timestamp ===
      "string" &&

    typeof data.value ===
      "number" &&

    typeof data.sequence_number ===
      "number" &&

    typeof data.checksum ===
      "string"
  );
}