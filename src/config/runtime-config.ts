import { config } from "./index.js";

export class RuntimeConfig {
  private batchSize =
    config.batchSize;

  private flushIntervalMs =
    config.flushIntervalMs;

  getBatchSize(): number {
    return this.batchSize;
  }

  getFlushIntervalMs(): number {
    return this.flushIntervalMs;
  }

  update(
    batchSize?: number,
    flushIntervalMs?: number
  ): void {

    if (
      batchSize !== undefined
    ) {
      this.batchSize =
        batchSize;
    }

    if (
      flushIntervalMs !==
      undefined
    ) {
      this.flushIntervalMs =
        flushIntervalMs;
    }
  }

  getConfig() {
    return {
      batchSize:
        this.batchSize,

      flushIntervalMs:
        this.flushIntervalMs,
    };
  }
}