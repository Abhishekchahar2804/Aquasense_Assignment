import mongoose from "mongoose";

const sensorDataSchema =
    new mongoose.Schema(
        {
            device_id: {
                type: String,
                required: true,
            },

            topic: {
                type: String,
                required: true,
            },

            value: {
                type: Number,
                required: true,
            },

            timestamp: {
                type: Date,
                required: true,
            },

            received_at: {
                type: Date,
                required: true,
            },

            processing_latency_ms: {
                type: Number,
                required: true,
            },

            sequence_number: {
                type: Number,
                required: true,
            },

            batch_id: {
                type: String,
                required: true,
            },
        },
        {
            versionKey: false,
        }
    );

sensorDataSchema.index({
    device_id: 1,
    sequence_number: 1,
});

sensorDataSchema.index(
    {
        received_at: 1,
    },
    {
        expireAfterSeconds: 86400,
    }
);

export const SensorDataModel =
    mongoose.model(
        "sensor_data",
        sensorDataSchema
    );