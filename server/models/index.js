const {
	readArticles,
	readArticleById,
	updateArticleById,
	readCommentsByArticleId
} = require("./articles.model.js");
exports.readArticles = readArticles;
exports.readArticleById = readArticleById;
exports.updateArticleById = updateArticleById;
exports.readCommentsByArticleId = readCommentsByArticleId;

const { readTopics } = require("./topics.model");
exports.readTopics = readTopics;
