# MQTT Sensor Data Ingestion Pipeline

## Project Overview

This project simulates an IoT sensor data ingestion system using MQTT, Node.js, TypeScript, and MongoDB.

The goal was to build a pipeline that can receive sensor data from multiple devices, validate and process the messages, store them efficiently in MongoDB, and provide operational metrics through REST APIs.

The system includes:

* Publisher Service (simulated sensor devices)
* MQTT Broker (Mosquitto)
* Subscriber Service
* Payload Validation
* Checksum Verification
* Queue Management
* Batch Processing
* Metrics APIs
* Runtime Configuration Updates
* Loss Analysis

---

## Architecture

```text
+----------------------+
|   Publisher Service  |
+----------------------+
          |
          v
+----------------------+
|     MQTT Broker      |
|      Mosquitto       |
+----------------------+
          |
          v
+----------------------+
|  Subscriber Service  |
+----------------------+
          |
          v
+----------------------+
| Validation & Checksum|
+----------------------+
          |
          v
+----------------------+
|    Queue Manager     |
+----------------------+

     |       |       |

     v       v       v

+---------+ +---------+ +---------+
| Temp Q  | | Press Q | | Flow Q  |
+---------+ +---------+ +---------+

     |          |          |

     v          v          v

+--------------------------+
|     Batch Writers        |
+--------------------------+
              |
              v
+--------------------------+
|        MongoDB           |
+--------------------------+
              |
              v
+--------------------------+
|       REST APIs          |
| /health                  |
| /metrics                 |
| /metrics/history         |
| /config                  |
+--------------------------+
```

---

## Setup

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```env
PORT=3000

MONGO_URI=<your_mongodb_connection_string>

MQTT_BROKER_URL=mqtt://localhost:1883

BATCH_SIZE=100

FLUSH_INTERVAL_MS=2000

QUEUE_MAX_SIZE=10000

TEMPERATURE_RATE=10

PRESSURE_RATE=50

FLOW_RATE=100
```

### Start Mosquitto

Make sure the MQTT broker is running locally on port 1883.

---

## Running the Project

### Start Subscriber Service

```bash
npm run dev
```

This starts:

* Express server
* MongoDB connection
* MQTT subscriber
* Queue manager
* Batch writers
* Metrics collection

### Start Publisher Service

Open a second terminal:

```bash
npm run publisher
```

This will start publishing simulated sensor data to MQTT topics.

### Run Loss Analysis

```bash
npm run loss-analysis
```

This script analyzes stored records and reports missing sequence numbers and message loss percentage for each device.

---

## API Endpoints

### Health Check

```http
GET /health
```

Returns service status and uptime.

### Metrics

```http
GET /metrics
```

Returns ingestion statistics such as:

* received messages
* validated messages
* inserted records
* queue depth
* loss rate

### Metrics History

```http
GET /metrics/history
```

Returns previously captured metric snapshots.

### Update Runtime Configuration

```http
POST /config
```

Example:

```json
{
  "batchSize": 200,
  "flushIntervalMs": 5000
}
```

Updates batch writer configuration without restarting the application.

---

## Configuration Reference

| Variable          | Description                    |
| ----------------- | ------------------------------ |
| PORT              | API server port                |
| MONGO_URI         | MongoDB connection string      |
| MQTT_BROKER_URL   | MQTT broker URL                |
| BATCH_SIZE        | Number of records per batch    |
| FLUSH_INTERVAL_MS | Batch flush interval           |
| QUEUE_MAX_SIZE    | Maximum queue size per topic   |
| TEMPERATURE_RATE  | Temperature topic publish rate |
| PRESSURE_RATE     | Pressure topic publish rate    |
| FLOW_RATE         | Flow topic publish rate        |

---

## Design Decisions

* MQTT was used because it is commonly used in IoT systems and supports publish/subscribe communication.
* Separate queues were maintained for each topic so that high traffic from one sensor type does not affect others.
* Batch inserts were used to improve MongoDB write performance.
* Checksums were added to detect corrupted messages.
* Sequence numbers were added to support loss analysis.
* Runtime configuration updates allow changing batch settings without restarting the service.

---

## Assumptions

* MQTT broker is available before starting the application.
* MongoDB Atlas is accessible.
* Sequence numbers restart when the publisher process restarts.
* Queue sizes are limited to prevent memory issues.

---

## Future Improvements

* Persistent retry queue
* Prometheus integration
* Kafka/RabbitMQ support
* Sequence number persistence across restarts
* Horizontal scaling for subscribers
* Dead-letter queue support
