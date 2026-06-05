export interface DeviceLossAnalysis {
  device_id: string;

  expected_messages: number;

  found_messages: number;

  missing_sequences: number[] | null;

  missing_count?: number;

  loss_percentage: number;
}