const { getApiWelcomeMessage } = require("./api.controller.js");
exports.getApiWelcomeMessage = getApiWelcomeMessage;

const { getTopics } = require("./topics.controller.js");
exports.getTopics = getTopics;

const {
	getArticles,
	getArticleById,
	patchArticleById
} = require("./articles.controller.js");
exports.getArticles = getArticles;
exports.getArticleById = getArticleById;
exports.patchArticleById = patchArticleById;

const {
	deleteCommentById,
	getCommentsByArticleId,
	postCommentByArticleId
} = require("./comments.controller.js");
exports.deleteCommentById = deleteCommentById;
exports.getCommentsByArticleId = getCommentsByArticleId;
exports.postCommentByArticleId = postCommentByArticleId;
