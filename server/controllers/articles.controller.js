const { readArticleById } = require("../models/index.js");

exports.getArticleById = async (request, response, next) => {
	try {
		response.status(200).send(await readArticleById(request.params.article_id));
	} catch (error) {
		next(error);
	}
};
