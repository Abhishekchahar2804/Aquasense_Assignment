import { Device } from "../types/device.js";

import { SensorPayload }
from "../types/sensor-payload.js";

import { generateChecksum }
from "./checksum.js";

import { generateSensorValue }
from "./sensor-values.js";

export function buildPayload(
  device: Device
): SensorPayload {

  const payloadWithoutChecksum = {
    device_id: device.id,

    timestamp:
      new Date().toISOString(),

    value: generateSensorValue(
      device.topic
    ),

    sequence_number:
      ++device.sequenceNumber,
  };

  const checksum =
    generateChecksum(
      payloadWithoutChecksum
    );

  return {
    ...payloadWithoutChecksum,
    checksum,
  };
}