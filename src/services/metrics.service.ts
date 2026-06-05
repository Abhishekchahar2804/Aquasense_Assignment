import { TOPICS } from "../publisher/constants.js";
import {
  MetricsSnapshot,
    TopicMetrics,
}
from "../types/metrics.js";



export class MetricsService {
  private readonly startedAt =
    Date.now();

  private readonly history:
    MetricsSnapshot[] = [];

  private readonly perTopic: Record<
    string,
    TopicMetrics
  > = {
    [TOPICS.TEMPERATURE]: {
      received: 0,
      validated: 0,
      corrupt_dropped: 0,
      inserted: 0,
      insert_failures: 0,
      queue_depth: 0,
      last_batch_at: null,
    },

    [TOPICS.PRESSURE]: {
      received: 0,
      validated: 0,
      corrupt_dropped: 0,
      inserted: 0,
      insert_failures: 0,
      queue_depth: 0,
      last_batch_at: null,
    },

    [TOPICS.FLOW]: {
      received: 0,
      validated: 0,
      corrupt_dropped: 0,
      inserted: 0,
      insert_failures: 0,
      queue_depth: 0,
      last_batch_at: null,
    },
  };

  incrementReceived(
    topic: string
  ): void {
    this.perTopic[topic].received++;
  }

  incrementValidated(
    topic: string
  ): void {
    this.perTopic[topic].validated++;
  }

  incrementCorruptDropped(
    topic: string
  ): void {
    this.perTopic[
      topic
    ].corrupt_dropped++;
  }

  incrementInserted(
    topic: string,
    count: number
  ): void {
    this.perTopic[
      topic
    ].inserted += count;
  }

  incrementInsertFailures(
    topic: string,
    count: number
  ): void {
    this.perTopic[
      topic
    ].insert_failures += count;
  }

  updateQueueDepth(
    topic: string,
    depth: number
  ): void {
    this.perTopic[
      topic
    ].queue_depth = depth;
  }

  updateLastBatchAt(
    topic: string
  ): void {
    this.perTopic[
      topic
    ].last_batch_at =
      new Date().toISOString();
  }

  getSnapshot(): MetricsSnapshot {
    const totalReceived =
      Object.values(
        this.perTopic
      ).reduce(
        (sum, topic) =>
          sum + topic.received,
        0
      );

    const totalInserted =
      Object.values(
        this.perTopic
      ).reduce(
        (sum, topic) =>
          sum + topic.inserted,
        0
      );

    const lossRate =
      totalReceived === 0
        ? 0
        : Number(
            (
              ((totalReceived -
                totalInserted) /
                totalReceived) *
              100
            ).toFixed(2)
          );

    return {
      uptime_seconds:
        Math.floor(
          (
            Date.now() -
            this.startedAt
          ) / 1000
        ),

      per_topic: {
        ...this.perTopic,
      },

      total: {
        received:
          totalReceived,

        inserted:
          totalInserted,

        loss_rate_percent:
          lossRate,
      },
    };
  }

  startSnapshotting(): void {
    setInterval(() => {
      const snapshot =
        this.getSnapshot();

      this.history.push(
        snapshot
      );

      if (
        this.history.length > 10
      ) {
        this.history.shift();
      }
    }, 10000);
  }

  getHistory(
    limit = 10
  ): MetricsSnapshot[] {
    return this.history.slice(
      -limit
    );
  }

  reset(): void {
    Object.keys(
      this.perTopic
    ).forEach((topic) => {
      this.perTopic[topic] = {
        received: 0,
        validated: 0,
        corrupt_dropped: 0,
        inserted: 0,
        insert_failures: 0,
        queue_depth: 0,
        last_batch_at: null,
      };
    });

    this.history.length = 0;
  }
}