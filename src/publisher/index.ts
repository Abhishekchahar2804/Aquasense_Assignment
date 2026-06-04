import "./mqtt-client.js";

import { PublisherService }
from "./publisher.service.js";

const publisher =
  new PublisherService();

publisher.start();

process.on(
  "SIGINT",
  () => {
    publisher.stop();
    process.exit(0);
  }
);

process.on(
  "SIGTERM",
  () => {
    publisher.stop();
    process.exit(0);
  }
);