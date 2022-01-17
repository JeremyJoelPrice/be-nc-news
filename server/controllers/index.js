const { getApiWelcomeMessage } = require("./api.controller.js");
exports.getApiWelcomeMessage = getApiWelcomeMessage;

const { getTopics } = require("./topics.controller.js");
exports.getTopics = getTopics;

const { getArticleById, patchArticleById } = require("./articles.controller");
exports.getArticleById = getArticleById;
exports.patchArticleById = patchArticleById;