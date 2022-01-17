const { readArticleById, updateArticleById } = require("./articles.model.js");
exports.readArticleById = readArticleById;
exports.updateArticleById = updateArticleById;

const { readTopics } = require("./topics.model");
exports.readTopics = readTopics;
