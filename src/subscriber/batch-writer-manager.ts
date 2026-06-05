import { TOPICS }
    from "../publisher/constants.js";

import { queueManager }
    from "./queue-manager-instance.js";

import { BatchWriter }
    from "./batch-writer.js";


export class BatchWriterManager {

    private writers: BatchWriter[] =
        [];

    start() {

        const topics = [
            TOPICS.TEMPERATURE,
            TOPICS.PRESSURE,
            TOPICS.FLOW,
        ];

        topics.forEach(
            (topic) => {

                const queue =
                    queueManager.getQueue(
                        topic
                    );

                const writer =
                    new BatchWriter(
                        topic,
                        queue
                    );

                this.writers.push(
                    writer
                );

                void writer.start();
            }
        );
    }

    stop() {

        this.writers.forEach(
            writer =>
                writer.stop()
        );
    }

    reloadConfig(): void {

        this.writers.forEach(
            writer =>
                writer.reloadConfig()
        );

    }
}