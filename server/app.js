const { getApiWelcomeMessage } = require("./controller.js");

const express = require("express");
const app = express();

app.use(express.json());

app.get("/api", getApiWelcomeMessage);

module.exports = app;