const { removeCommentById } = require("../models/comments.model.js");

exports.deleteCommentById = async (request, response, next) => {
	try {
		await removeCommentById(request.params.comment_id);
		response.sendStatus(204);
	} catch (error) {
		next(error);
	}
};
