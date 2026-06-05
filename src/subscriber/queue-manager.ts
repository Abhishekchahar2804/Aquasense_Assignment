import { TopicQueue }
    from "./topic-queue.js";

import { TOPICS }
    from "../publisher/constants.js";
import { EnrichedSensorPayload } from "../types/enriched-sensor-payload.js";

export class QueueManager {

    private readonly queues = {
        [TOPICS.TEMPERATURE]:
            new TopicQueue(),

        [TOPICS.PRESSURE]:
            new TopicQueue(),

        [TOPICS.FLOW]:
            new TopicQueue(),
    };

    getQueue(
        topic: string
    ): TopicQueue {

        const queue =
            this.queues[
            topic as keyof typeof this.queues
            ];

        if (!queue) {
            throw new Error(
                `Unknown topic: ${topic}`
            );
        }

        return queue;
    }

    enqueue(
        topic: string,
        payload: EnrichedSensorPayload
    ): boolean {

        return this
            .getQueue(topic)
            .enqueue(payload);
    }

    getQueueDepth(
        topic: string
    ): number {

        return this
            .getQueue(topic)
            .size();
    }

    getAllQueueDepths() {

        return {
            temperature:
                this.queues[
                    TOPICS.TEMPERATURE
                ].size(),

            pressure:
                this.queues[
                    TOPICS.PRESSURE
                ].size(),

            flow:
                this.queues[
                    TOPICS.FLOW
                ].size(),
        };
    }
}