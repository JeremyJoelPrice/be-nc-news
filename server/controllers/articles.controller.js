const {
	readArticles,
	readArticleById,
	updateArticleById
} = require("../models");

exports.getArticles = async (request, response, next) => {
	try {
		const articles = await readArticles(request.query);
		response.status(200).send({ articles });
	} catch (error) {
		next(error);
	}
};

exports.getArticleById = async (request, response, next) => {
	try {
		const article = await readArticleById(request.params.article_id);
		response.status(200).send({ article });
	} catch (error) {
		next(error);
	}
};

exports.patchArticleById = async (request, response, next) => {
	try {
		const article = await updateArticleById(
			request.params.article_id,
			request.body
		);
		response.status(200).send({ article });
	} catch (error) {
		next(error);
	}
};
