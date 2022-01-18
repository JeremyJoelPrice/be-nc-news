const database = require("../../database/connection.js");

exports.readArticles = async () => {
	// establish comment count
	const result = await database.query(`
	SELECT * FROM articles;
	`);
	return [result.rows[0]];
};

exports.readArticleById = async (article_id) => {
	const articleResponse = await database.query(
		`
    SELECT * FROM articles
    WHERE article_id = $1;
    `,
		[article_id]
	);

	const article = articleResponse.rows[0];
	if (!article) throw { status: 404, message: "Article not found" };

	const commentsResponse = await database.query(
		`
    SELECT * FROM comments
    WHERE article_id = $1;
    `,
		[article_id]
	);

	article.comment_count = commentsResponse.rows.length;
	return article;
};

exports.updateArticleById = async (article_id, requestBody) => {
	if (!requestBody.inc_votes) {
		throw {
			status: 400,
			message: "Bad Request: key missing from request body"
		};
	}
	if (Object.keys(requestBody).length > 1) {
		throw {
			status: 400,
			message: "Bad Request: Unexpected key"
		};
	}
	const response = await database.query(
		`
	UPDATE articles
	SET votes = votes + $1
	WHERE article_id = $2
	RETURNING *;
	`,
		[requestBody.inc_votes, article_id]
	);
	return response.rows[0];
};
