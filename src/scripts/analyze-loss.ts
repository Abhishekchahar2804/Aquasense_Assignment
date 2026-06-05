import mongoose from "mongoose";

import { connectMongo }
  from "../services/mongo.service.js";

import { SensorDataModel }
  from "../models/sensor-data.model.js";

import {
  DeviceLossAnalysis
} from "../types/loss-analysis.js";

async function getDevices(): Promise<string[]> {
  return SensorDataModel.distinct(
    "device_id"
  );
}

async function analyzeDevice(
  deviceId: string
): Promise<DeviceLossAnalysis> {

  const records =
    await SensorDataModel
      .find({
        device_id: deviceId,
      })
      .sort({
        sequence_number: 1,
      })
      .lean();

  if (records.length === 0) {
    return {
      device_id: deviceId,

      expected_messages: 0,

      found_messages: 0,

      missing_sequences: [],

      loss_percentage: 0,
    };
  }

  const minSequence =
    records[0].sequence_number;

  const maxSequence =
    records[
      records.length - 1
    ].sequence_number;

  const expectedMessages =
    maxSequence -
    minSequence +
    1;

  const existingSequences =
    new Set<number>(
      records.map(
        (record) =>
          record.sequence_number
      )
    );

  const missingSequences:
    number[] = [];

  for (
    let sequence =
      minSequence;
    sequence <= maxSequence;
    sequence++
  ) {
    if (
      !existingSequences.has(
        sequence
      )
    ) {
      missingSequences.push(
        sequence
      );
    }
  }

  const lossPercentage =
    expectedMessages === 0
      ? 0
      : Number(
          (
            (
              missingSequences.length /
              expectedMessages
            ) *
            100
          ).toFixed(2)
        );

  if (
    missingSequences.length > 50
  ) {
    return {
      device_id: deviceId,

      expected_messages:
        expectedMessages,

      found_messages:
        records.length,

      missing_sequences:
        null,

      missing_count:
        missingSequences.length,

      loss_percentage:
        lossPercentage,
    };
  }

  return {
    device_id: deviceId,

    expected_messages:
      expectedMessages,

    found_messages:
      records.length,

    missing_sequences:
      missingSequences,

    loss_percentage:
      lossPercentage,
  };
}

async function run(): Promise<void> {
  try {

    await connectMongo();

    const devices =
      await getDevices();

    if (
      devices.length === 0
    ) {
      console.log(
        "No devices found."
      );

      return;
    }

    const results =
      await Promise.all(
        devices.map(
          (deviceId) =>
            analyzeDevice(
              deviceId
            )
        )
      );

    console.log(
      "\n========== LOSS ANALYSIS ==========\n"
    );

    console.table(
      results.map(
        (result) => ({
          device_id:
            result.device_id,

          expected:
            result.expected_messages,

          found:
            result.found_messages,

          missing:
            result.missing_count ??
            result
              .missing_sequences
              ?.length ??
            0,

          loss_percentage:
            `${result.loss_percentage}%`,
        })
      )
    );

    console.log(
      "\n========== DETAILED REPORT ==========\n"
    );

    console.log(
      JSON.stringify(
        results,
        null,
        2
      )
    );

  } catch (error) {

    console.error(
      "Loss analysis failed:",
      error
    );

  } finally {

    await mongoose.disconnect();

  }
}

void run();