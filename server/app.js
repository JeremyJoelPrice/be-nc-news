const { getApiWelcomeMessage, getTopics } = require("./controller.js");

const express = require("express");
const app = express();

app.use(express.json());

app.get("/api", getApiWelcomeMessage);

app.get("/api/topics", getTopics);

module.exports = app;