const {
	readArticles,
	readArticleById,
	updateArticleById,
	readCommentsByArticleId,
	createCommentByArticleId
} = require("./articles.model.js");
exports.readArticles = readArticles;
exports.readArticleById = readArticleById;
exports.updateArticleById = updateArticleById;
exports.readCommentsByArticleId = readCommentsByArticleId;
exports.createCommentByArticleId = createCommentByArticleId;

const { readTopics } = require("./topics.model");
exports.readTopics = readTopics;
