const {
	getApiWelcomeMessage,
	getTopics,
	getArticles,
	getArticleById,
	patchArticleById,
	getCommentsByArticleId,
	postCommentByArticleId
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

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);

// app.all("/*", handle404s);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
