import { Router }
    from "express";

import {
    metricsService
}
    from "../services/metrics-instance.js";

import { runtimeConfig }
from "../config/runtime-config-instance.js";
import { batchWriterManager } from "../subscriber/batch-writer-manager-instance.js";

const router = Router();

router.get(
    "/health",
    (_, res) => {

        res.json({
            status: "UP",
            uptime_seconds:
                metricsService
                    .getSnapshot()
                    .uptime_seconds,
        });

    }
);

router.get(
    "/metrics",
    (_, res) => {

        res.json(
            metricsService
                .getSnapshot()
        );

    }
);

router.get(
    "/metrics/history",
    (_, res) => {

        res.json(
            metricsService
                .getHistory()
        );

    }
);


router.post(
  "/config",
  (req, res) => {

    const {
      batchSize,
      flushIntervalMs
    } = req.body;

    runtimeConfig.update(
      batchSize,
      flushIntervalMs
    );

    batchWriterManager
      .reloadConfig();

    res.json({
      success: true,

      config:
        runtimeConfig
          .getConfig(),
    });

  }
);

export default router;