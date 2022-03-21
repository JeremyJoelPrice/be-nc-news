const {
	createCommentByArticleId,
	readCommentsByArticleId,
	removeCommentById
} = require("../models");

exports.getCommentsByArticleId = async (request, response, next) => {
	try {
		const comments = await readCommentsByArticleId(request.params.article_id);
		response.status(200).send({ comments });
	} catch (error) {
		next(error);
	}
};

exports.postCommentByArticleId = async (request, response, next) => {
	try {
		const comment = await createCommentByArticleId(
			request.params.article_id,
			request.body
		);
		response.status(200).send({ comment });
	} catch (error) {
		next(error);
	}
};

exports.deleteCommentById = async (request, response, next) => {
	try {
		await removeCommentById(request.params.comment_id);
		response.sendStatus(204);
	} catch (error) {
		next(error);
	}
};
