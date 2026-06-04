import { Device } from "../types/device.js";

import { buildPayload } from "./payload-builder.js";
import { publishMessage } from "./publish.js";

import { BurstManager } from "./burst-manager.js";
import { retryQueue } from "./retry-queue-instance.js";

import { logger } from "../utils/logger.js";

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export class TopicScheduler {
    private isRunning = false;

    constructor(
        private readonly topic: string,
        private readonly baseRate: number,
        private readonly devices: Device[],
        private readonly burstManager: BurstManager
    ) { }

    async start(): Promise<void> {
        if (this.isRunning) {
            return;
        }

        this.isRunning = true;

        logger.info({
            topic: this.topic,
            baseRate: this.baseRate,
            message: "Topic scheduler started",
        });

        while (this.isRunning) {
            const multiplier =
                this.burstManager.getMultiplier(
                    this.topic
                );

            const effectiveRate =
                this.baseRate * multiplier;

            const intervalMs = Math.max(
                1,
                1000 / effectiveRate
            );

            const randomIndex = Math.floor(
                Math.random() * this.devices.length
            );

            const device =
                this.devices[randomIndex];

            const payload =
                buildPayload(device);

            const payloadString =
                JSON.stringify(payload);

            try {
                await publishMessage(
                    this.topic,
                    payloadString
                );
            } catch (error) {
                logger.warn({
                    topic: this.topic,
                    deviceId: payload.device_id,
                    sequenceNumber:
                        payload.sequence_number,
                    retryQueueSize:
                        retryQueue.size(),
                    error,
                    message:
                        "Publish failed, queued for retry",
                });

                retryQueue.add({
                    topic: this.topic,
                    payload: payloadString,
                    attempts: 0,
                    nextRetryAt: Date.now()
                });
            }

            await sleep(intervalMs);
        }
    }

    stop(): void {
        this.isRunning = false;

        logger.info({
            topic: this.topic,
            message: "Topic scheduler stopped",
        });
    }
}