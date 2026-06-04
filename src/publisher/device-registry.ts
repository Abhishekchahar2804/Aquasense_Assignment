import { Device } from "../types/device.js";

import { TOPICS } from "./constants.js";

export class DeviceRegistry {
  private devices: Device[] = [];

  constructor() {
    this.initialize();
  }

  private initialize() {
    this.createDevices(
      TOPICS.TEMPERATURE,
      "temp-device",
      5
    );

    this.createDevices(
      TOPICS.PRESSURE,
      "pressure-device",
      5
    );

    this.createDevices(
      TOPICS.FLOW,
      "flow-device",
      5
    );
  }

  private createDevices(
    topic: string,
    prefix: string,
    count: number
  ) {
    for (let i = 1; i <= count; i++) {
      this.devices.push({
        id: `${prefix}-${i}`,
        topic,
        sequenceNumber: 0,
      });
    }
  }

  getDevicesByTopic(
    topic: string
  ): Device[] {
    return this.devices.filter(
      device => device.topic === topic
    );
  }
}