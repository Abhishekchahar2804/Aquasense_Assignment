import express from "express";

const app = express();

app.use(express.json());

import routes
from "./api/routes.js";

app.use(routes);

export default app;