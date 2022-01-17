const {
	getApiWelcomeMessage,
	getTopics,
	getArticleById
} = require("./controllers/index.js");
const {
	handleCustomErrors,
	handlePsqlErrors,
	handleServerErrors
} = require("./errorHandling.js");

const express = require("express");
const app = express();

app.use(express.json());

app.get("/api", getApiWelcomeMessage);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
