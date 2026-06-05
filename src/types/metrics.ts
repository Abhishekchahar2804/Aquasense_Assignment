export interface TopicMetrics {
  received: number;

  validated: number;

  corrupt_dropped: number;

  inserted: number;

  insert_failures: number;

  queue_depth: number;

  last_batch_at: string | null;
}

export interface MetricsSnapshot {
  uptime_seconds: number;

  per_topic: Record<
    string,
    TopicMetrics
  >;

  total: {
    received: number;
    inserted: number;
    loss_rate_percent: number;
  };
}