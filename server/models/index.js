const {
	readArticles,
	readArticleById,
	updateArticleById
} = require("./articles.model.js");
exports.readArticles = readArticles;
exports.readArticleById = readArticleById;
exports.updateArticleById = updateArticleById;

const { readTopics } = require("./topics.model");
exports.readTopics = readTopics;

const {
	createCommentByArticleId,
	removeCommentById,
	readCommentsByArticleId
} = require("./comments.model");
exports.createCommentByArticleId = createCommentByArticleId;
exports.removeCommentById = removeCommentById;
exports.readCommentsByArticleId = readCommentsByArticleId;
