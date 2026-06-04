export interface SensorPayload {
  device_id: string;

  timestamp: string;

  value: number;

  sequence_number: number;

  checksum: string;
}