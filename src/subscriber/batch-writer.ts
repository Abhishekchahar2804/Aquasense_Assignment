import { v4 as uuid } from "uuid";

import { TopicQueue } from "./topic-queue.js";

import { SensorDataModel }
    from "../models/sensor-data.model.js";

import { logger }
    from "../utils/logger.js";


import { metricsService } from "../services/metrics-instance.js";
import { runtimeConfig } from "../config/runtime-config-instance.js";

function sleep(
    ms: number
): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export class BatchWriter {
    private flushTimer: NodeJS.Timeout | null =
        null;

    private isRunning = false;

    constructor(
        private readonly topic: string,
        private readonly queue: TopicQueue
    ) { }

    start(): void {
        if (this.isRunning) {
            return;
        }

        this.isRunning = true;

        logger.info({
            topic: this.topic,
            message: "Batch writer started",
        });

        this.startFlushTimer();

        void this.monitorQueue();
    }

    stop(): void {
        this.isRunning = false;

        if (this.flushTimer) {
            clearInterval(this.flushTimer);
        }

        logger.info({
            topic: this.topic,
            message: "Batch writer stopped",
        });
    }

    reloadConfig(): void {
        if (this.flushTimer) {
            clearInterval(
                this.flushTimer
            );
        }

        this.startFlushTimer();

        logger.info({
            topic: this.topic,
            message:
                "Batch writer config reloaded",
        });
    }

    private startFlushTimer(): void {
        this.flushTimer = setInterval(
            async () => {
                if (!this.isRunning) {
                    return;
                }

                if (this.queue.size() === 0) {
                    return;
                }

                await this.flush();
            },
            runtimeConfig.getFlushIntervalMs()
        );
    }

    private async monitorQueue(): Promise<void> {
        while (this.isRunning) {
            try {
                if (
                    this.queue.size() >=
                    runtimeConfig.getBatchSize()
                ) {
                    await this.flush();
                }

                await sleep(100);
            } catch (error) {
                logger.error({
                    topic: this.topic,
                    error,
                    message:
                        "Batch monitor error",
                });

                await sleep(1000);
            }
        }
    }

    private async flush(): Promise<void> {
        const batch =
            this.queue.dequeueBatch(
                runtimeConfig.getBatchSize()
            );

        if (batch.length === 0) {
            return;
        }

        const batchId = uuid();

        const documents = batch.map(
            (record) => ({
                ...record,
                batch_id: batchId,
            })
        );

        try {
            await SensorDataModel.insertMany(
                documents,
                {
                    ordered: false,
                }
            );

            metricsService.incrementInserted(
                this.topic,
                documents.length
            );

            metricsService.updateLastBatchAt(
                this.topic
            );

            metricsService.updateQueueDepth(
                this.topic,
                this.queue.size()
            );

            logger.info({
                topic: this.topic,
                batchId,
                count: documents.length,
                message:
                    "Batch inserted successfully",
            });
        } catch (error) {
            metricsService.incrementInsertFailures(
                this.topic,
                documents.length
            );
            logger.error({
                topic: this.topic,
                batchId,
                count: documents.length,
                error,
                message:
                    "Batch insert failed",
            });

            await this.retryInsert(
                documents
            );
        }
    }

    private async retryInsert(
        documents: unknown[]
    ): Promise<void> {
        const MAX_RETRIES = 3;

        let attempt = 1;

        while (
            attempt <= MAX_RETRIES
        ) {
            const delay =
                1000 *
                Math.pow(
                    2,
                    attempt
                );

            await sleep(delay);

            try {
                await SensorDataModel.insertMany(
                    documents,
                    {
                        ordered: false,
                    }
                );

                metricsService.incrementInserted(
                    this.topic,
                    documents.length
                );

                metricsService.updateLastBatchAt(
                    this.topic
                );

                metricsService.updateQueueDepth(
                    this.topic,
                    this.queue.size()
                );


                logger.info({
                    topic: this.topic,
                    attempt,
                    count:
                        documents.length,
                    message:
                        "Batch retry successful",
                });



                return;
            } catch (error) {
                logger.warn({
                    topic: this.topic,
                    attempt,
                    error,
                    message:
                        "Batch retry failed",
                });

                attempt++;
            }
        }

        metricsService.incrementInsertFailures(
            this.topic,
            documents.length
        );

        logger.error({
            topic: this.topic,
            count: documents.length,
            message:
                "Batch permanently lost",
        });
    }


}