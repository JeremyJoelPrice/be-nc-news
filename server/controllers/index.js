const { getApiWelcomeMessage } = require("./api.controller.js");
exports.getApiWelcomeMessage = getApiWelcomeMessage;

const { getTopics } = require("./topics.controller.js");
exports.getTopics = getTopics;

const {
	getArticles,
	getArticleById,
	patchArticleById,
	getCommentsByArticleId
} = require("./articles.controller.js");
exports.getArticles = getArticles;
exports.getArticleById = getArticleById;
exports.patchArticleById = patchArticleById;
exports.getCommentsByArticleId = getCommentsByArticleId;