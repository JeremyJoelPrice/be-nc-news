const database = require("../../database/connection.js");
const { vetCommentId, vetArticleId } = require("../../database/utils");

exports.createCommentByArticleId = async (article_id, comment) => {
	await vetArticleId(article_id);

	// Vet comment object
	const { body, username } = comment;
	if (
		Object.keys(comment).length !== 2 ||
		!body ||
		!username ||
		typeof body !== "string" ||
		typeof username !== "string"
	) {
		throw { status: 400, message: "Bad Request: Invalid input" };
	}

	// Post comment
	const response = (
		await database.query(
			`
			INSERT INTO comments
			(article_id, body, author)
			VALUES ($1, $2, $3)
			RETURNING *;
			`,
			[article_id, body, username]
		)
	).rows[0];
	return response;
};

exports.readCommentsByArticleId = async (article_id) => {
	await vetArticleId(article_id);

	const comments = (
		await database.query(
			`
			SELECT * FROM comments WHERE article_id = $1
			`,
			[article_id]
		)
	).rows;
	
	return comments;
};

exports.removeCommentById = async (comment_id) => {
	await vetCommentId(comment_id);

	const response = (
		await database.query(
			`
            DELETE FROM comments
            WHERE comment_id = $1;
            `,
			[comment_id]
		)
	).rows[0];
	return response;
};
