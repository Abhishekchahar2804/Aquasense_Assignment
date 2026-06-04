import crypto from "node:crypto";

export function generateChecksum(
  payload: object
): string {
  return crypto
    .createHash("sha256")
    .update(
      JSON.stringify(payload)
    )
    .digest("hex");
}