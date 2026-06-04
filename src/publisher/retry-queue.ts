
import { RetryMessage } from "../types/retry-queue.js";

export class RetryQueue {
  private queue: RetryMessage[] = [];

  add(message: RetryMessage): void {
    this.queue.push(message);
  }

  getNext(): RetryMessage | undefined {
    return this.queue.shift();
  }

  size(): number {
    return this.queue.length;
  }
}

