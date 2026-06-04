import crypto from "node:crypto";

import { SensorPayload }
from "../types/sensor-payload.js";

export function verifyChecksum(
  payload: SensorPayload
): boolean {

  const {
    checksum,
    ...payloadWithoutChecksum
  } = payload;

  const generatedChecksum =
    crypto
      .createHash("sha256")
      .update(
        JSON.stringify(
          payloadWithoutChecksum
        )
      )
      .digest("hex");

  return generatedChecksum === checksum;
}