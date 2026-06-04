export interface RetryMessage {
  topic: string;
  payload: string;
  attempts: number;
  nextRetryAt: number;
}