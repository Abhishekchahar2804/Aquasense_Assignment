import { EnrichedSensorPayload }
    from "../types/enriched-sensor-payload.js";

export class TopicQueue {
    private messages:
        EnrichedSensorPayload[] = [];

    private readonly maxSize = 10000;

    enqueue(
        message: EnrichedSensorPayload
    ): boolean {

        if (
            this.messages.length >=
            this.maxSize
        ) {
            return false;
        }

        this.messages.push(message);

        return true;
    }

    dequeueBatch(
        batchSize: number
    ): EnrichedSensorPayload[] {

        return this.messages.splice(
            0,
            batchSize
        );
    }

    size(): number {
        return this.messages.length;
    }
}