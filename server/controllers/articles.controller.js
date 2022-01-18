const { response } = require("../app.js");
const {
	readArticles,
	readArticleById,
	updateArticleById
} = require("../models/index.js");

exports.getArticles = async (request, response, next) => {
	try {
		response.status(200).send(await readArticles());
	} catch (error) {
		next(error);
	}
};

exports.getArticleById = async (request, response, next) => {
	try {
		response.status(200).send(await readArticleById(request.params.article_id));
	} catch (error) {
		next(error);
	}
};

exports.patchArticleById = async (request, response, next) => {
	try {
		response
			.status(200)
			.send(await updateArticleById(request.params.article_id, request.body));
	} catch (error) {
		next(error);
	}
};
