const { readTopics, readArticleById } = require("./model.js");

exports.getApiWelcomeMessage = (request, response, next) => {
	try {
		response.status(200).send({ message: "Welcome to NC_News API" });
	} catch (error) {
		next(error);
	}
};

exports.getTopics = async (request, response, next) => {
	try {
		response.status(200).send(await readTopics());
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
